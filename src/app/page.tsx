'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, ExternalLink, MessageCircle, User } from 'lucide-react';

type Mention = {
  id: string;
  keyword: string;
  author: string;
  text: string;
  sentiment: string;
  url: string | null;
  createdAt: string;
};

export default function Home() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);

  const fetchMentions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentions');
      const data = await res.json();
      if (data.success) {
        setMentions(data.mentions);
      }
    } catch (err) {
      console.error("Failed to fetch mentions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setScraping(true);
    try {
      const res = await fetch('/api/scrape', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Scrape complete! Saved ${data.savedCount} new mentions out of ${data.totalAnalyzed} analyzed.`);
        await fetchMentions();
      } else {
        alert("Failed to scrape data: " + data.error);
      }
    } catch (err) {
      console.error("Scrape failed", err);
      alert("Error occurred while scraping");
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchMentions();
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Reddit Monitor</h1>
            </div>

            <button
              onClick={handleRefreshData}
              disabled={scraping}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${scraping ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'AI is Scraping...' : 'Fetch New Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Mentions</h2>
          <p className="text-sm text-gray-500">Monitoring Reddit for: ruul, tipalti, payouts, paddle</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-500">Loading saved mentions...</p>
          </div>
        ) : mentions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No mentions found</h3>
            <p className="mt-1 text-sm text-gray-500">Click the fetch button to start scanning Reddit.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentions.map((mention) => (
              <div
                key={mention.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {mention.keyword}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSentimentColor(mention.sentiment)}`}>
                      {mention.sentiment}
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm line-clamp-6 mb-4 whitespace-pre-wrap">
                    "{mention.text}"
                  </p>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1.5 text-gray-400" />
                    <span className="truncate max-w-[120px]">{mention.author}</span>
                  </div>

                  {mention.url && (
                    <a
                      href={mention.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span className="hidden sm:inline mr-1">Source</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
