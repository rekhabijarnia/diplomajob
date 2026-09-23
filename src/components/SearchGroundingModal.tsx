import React, { useState } from 'react';

interface WebSource {
  uri: string;
  title: string;
}

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [sources, setSources] = useState<WebSource[]>([]);
  const [lastSearchedTopic, setLastSearchedTopic] = useState<string>('');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  if (!isOpen) return null;

  const presetTopics = [
    {
      title: 'RRB JE 2025 Diploma Vacancies',
      query: 'RRB Junior Engineer 2025 recruitment notification eligibility for diploma mechanical electrical civil',
    },
    {
      title: 'MSBTE Circulars & Exam Schedule',
      query: 'MSBTE official circular exam schedule summer winter 2025 timetable Maharashtra polytechnic',
    },
    {
      title: 'BTEUP Latest Circular & Results',
      query: 'BTEUP Uttar Pradesh polytechnic diploma latest notifications circulars exam schedule 2025',
    },
    {
      title: 'NATS DBT Stipend Revisions',
      query: 'NATS national apprenticeship training scheme diploma stipend direct benefit transfer DBT hike notification',
    },
    {
      title: 'DRDO CEPTAM Diploma Senior Tech',
      query: 'DRDO CEPTAM Senior Technical Assistant STA-B diploma mechanical electrical electronics recruitment',
    },
    {
      title: 'Tata Motors DET Campus Drives',
      query: 'Tata Motors Diploma Engineer Trainee DET recruitment walkin drives 2025 salary eligibility',
    },
  ];

  const handleExecuteSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setLastSearchedTopic(q);
    setSearchResult(null);
    setSources([]);
    setIsQuotaExceeded(false);

    try {
      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Server returned error status ${response.status}`);
      }

      setSearchResult(data.text);
      setSources(data.sources || []);
      setIsQuotaExceeded(data.isQuotaExceeded || false);
    } catch (err: any) {
      console.error('Search grounding error:', err);
      setSearchResult(`⚠️ Failed to fetch grounded search data: ${err.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">travel_explore</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">Live Board & PSU Circulars Radar</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Powered by gemini-3.8-flash with real-time web verification & official source citations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch(searchQuery);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search official notices (e.g., RRB JE 2025 diploma notification, MSBTE summer schedule)..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-4 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Search Web</span>
              <span className="material-symbols-outlined text-[16px]">manage_search</span>
            </button>
          </form>

          {/* Quick preset chips */}
          <div>
            <span className="text-xs font-semibold text-on-surface-variant block mb-2">
              Popular Verified Queries:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(topic.query);
                    handleExecuteSearch(topic.query);
                  }}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium rounded-lg border border-outline-variant/30 flex items-center gap-1.5 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">feed</span>
                  <span>{topic.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quota limit indicator banner */}
          {isQuotaExceeded && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
                info
              </span>
              <div>
                <p className="font-bold text-amber-300">Rate Limit Notice (Free Tier)</p>
                <p className="text-[11px] mt-0.5 text-amber-200/90">
                  Gemini API rate limit reached for live search grounding. Providing verified state technical board and central portal data. Attach a billing-enabled key in <strong>Settings &gt; Secrets</strong> for higher rate limits.
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-bold text-on-surface">Searching live web with Google Search Grounding...</p>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Cross-verifying official state board gazettes, NATS portal updates, and PSU circulars
              </p>
            </div>
          )}

          {/* Search results */}
          {!isLoading && searchResult && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-surface-container-low p-4 sm:p-5 rounded-xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Live Grounded Intelligence
                  </span>
                  <span className="text-[11px] text-on-surface-variant italic truncate max-w-[200px]">
                    Query: {lastSearchedTopic}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {searchResult}
                </div>
              </div>

              {/* Citations and Sources list */}
              {sources.length > 0 && (
                <div className="bg-surface-container-low/70 p-4 rounded-xl border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-2.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">link</span>
                    Verified Live Web Citations ({sources.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-surface-container hover:bg-surface-container-high rounded-lg border border-outline-variant/30 transition-colors flex items-start gap-2 group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary mt-0.5 shrink-0">
                          open_in_new
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-on-surface group-hover:text-primary truncate">
                            {src.title}
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate">
                            {src.uri}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
