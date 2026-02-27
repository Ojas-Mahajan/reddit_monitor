const FirecrawlApp = require('@mendable/firecrawl-js').default;
const OpenAI = require('openai');

const KEYWORDS = ['ruul', 'tipalti', 'payouts', 'paddle'];

async function testExtraction() {
    const openai = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const keyword = 'paddle';
    const searchUrl = `https://www.reddit.com/search/?q=${keyword}&sort=new`;

    console.log('Testing Firecrawl fetch...');
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: searchUrl,
            formats: ['markdown']
        })
    });
    const scrapeResult = await scrapeResponse.json();
    console.log('Firecrawl Response:', JSON.stringify(scrapeResult).substring(0, 500));

    const markdownText = scrapeResult.data ? scrapeResult.data.markdown : (scrapeResult.markdown || "");

    console.log(`Markdown size: ${markdownText.length} characters`);

    console.log('Testing NVIDIA LLaMA parsing...');
    const aiResponse = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
            {
                role: "system",
                content: `You are a data extractor. You will be given raw markdown scraped from a Reddit search page for the keyword "paddle".
              Your job is to identify valid comments or posts that mention the given keyword.
              Respond ONLY with a raw JSON array of objects. Do not wrap it in markdown block quotes (\`\`\`json).
              Each object must strictly have this format:
              {
                "keyword": "paddle",
                "author": "String, the reddit username of the person who posted it",
                "text": "String, the actual comment or post text",
                "sentiment": "String, exactly one of: 'Positive', 'Negative', 'Neutral'"
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

    const jsonStr = aiResponse.choices[0]?.message?.content?.trim();
    console.log('\n--- RAW LLM RESPONSE ---');
    console.log(jsonStr);
    console.log('------------------------\n');

    try {
        const parsed = JSON.parse(jsonStr);
        console.log('SUCCESS! Parsed', parsed.length, 'mentions.');
    } catch (e) {
        console.error('PARSE FAILED:', e.message);
    }
}

testExtraction().catch(console.error);
