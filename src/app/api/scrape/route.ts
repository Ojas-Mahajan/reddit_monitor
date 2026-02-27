import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

// (Replaced Firecrawl SDK with native fetch)

// Initialize OpenAI client pointing to NVIDIA's base URL
const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY as string,
    baseURL: 'https://integrate.api.nvidia.com/v1',
});

// The keywords we want to monitor
const KEYWORDS = ['ruul', 'tipalti', 'payouts', 'paddle'];

export async function POST() {
    try {
        const allMentions = [];
        const debugLogs: string[] = [];

        // 1. Scrape Reddit Search for each keyword
        for (const keyword of KEYWORDS) {
            let markdownText = "";
            const searchQuery = `site:reddit.com ${keyword} comments`;

            // Step 1: Tell Firecrawl to search the index engines for Reddit pages instead of navigating to Reddit itself
            const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: searchQuery,
                    scrapeOptions: {
                        formats: ['markdown']
                    }
                })
            });

            if (searchResponse.ok) {
                const searchResult = await searchResponse.json();
                if (searchResult.success && searchResult.data) {
                    // Extract the text descriptions provided by the search engine! 
                    // This is real text from real Reddit, and bypasses the 403 block.
                    markdownText = searchResult.data.map((res: any) => `URL: ${res.url}\nTitle: ${res.title}\nContent: ${res.description || res.markdown || ""}\n`).join("\n---\n");
                } else {
                    debugLogs.push(`Firecrawl Search unsuccess for ${keyword}: ${searchResult.error}`);
                }
            } else {
                const errBody = await searchResponse.text();
                debugLogs.push(`Failed to search for ${keyword} with HTTP status ${searchResponse.status}: ${errBody}`);
            }

            if (!markdownText || markdownText.trim() === "") {
                debugLogs.push(`No markdown gathered from search engine snippets for ${keyword}. Skipping.`);
                continue;
            }

            let extractedMentions: any[] = [];
            console.log(`Analyzing scraped data for ${keyword} with NVIDIA...`);

            try {
                // 2. Pass to NVIDIA LLM for extraction
                const aiResponse = await openai.chat.completions.create({
                    model: "meta/llama-3.1-8b-instruct",
                    messages: [
                        {
                            role: "system",
                            content: `You are a data extractor. You will be given raw text scraped from a Reddit search page for the keyword "${keyword}". 
Each extracted snippet from the search engine has a "URL", "Title", and "Content".
Your job is to identify valid comments or posts that mention the given keyword.
Respond ONLY with a raw JSON array of objects. Do not wrap it in markdown block quotes.
Each object must strictly have this format:
{
  "keyword": "${keyword}",
  "author": "String, the reddit username of the person who posted it",
  "text": "String, the actual comment or post text",
  "sentiment": "String, exactly one of: 'Positive', 'Negative', 'Neutral'",
  "url": "String, the exact URL provided for this specific snippet"
}`
                        },
                        {
                            role: "user",
                            content: markdownText.substring(0, 10000)
                        }
                    ],
                    temperature: 0.2,
                    max_tokens: 1024,
                });

                let jsonStr = aiResponse.choices[0]?.message?.content?.trim() || "";
                debugLogs.push(`[DEBUG] Raw AI Response for ${keyword}: ${jsonStr}`);

                // Cleanup JSON if LLM added formatting
                jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

                const mentions = JSON.parse(jsonStr);
                if (Array.isArray(mentions)) {
                    extractedMentions = mentions;
                }
            } catch (e: any) {
                debugLogs.push(`Failed to parse valid JSON from LLM for keyword ${keyword}: ${e.message}`);
            }

            const fallbackUrl = `https://www.reddit.com/search/?q=${keyword}&sort=new`;

            // Map scraped properties securely
            const validMentions = extractedMentions.map((m: any) => ({
                keyword: keyword,
                author: m.author || "u/Unknown",
                text: m.text || "Empty content",
                sentiment: m.sentiment || "Neutral",
                url: m.url || fallbackUrl
            }));

            allMentions.push(...validMentions);
        }

        // 3. Save extracted mentions to Database
        let savedCount = 0;
        for (const mention of allMentions) {
            // Basic deduplication: Check if we already saved this exact text
            const existing = await prisma.mention.findFirst({
                where: { text: mention.text }
            });

            if (!existing) {
                await prisma.mention.create({
                    data: {
                        keyword: mention.keyword,
                        author: mention.author,
                        text: mention.text,
                        sentiment: mention.sentiment,
                        url: mention.url,
                    }
                });
                savedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            savedCount,
            totalAnalyzed: allMentions.length,
            debug: debugLogs
        });

    } catch (error: any) {
        console.error("Scraper Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
