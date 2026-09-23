import React, { useState } from 'react';
import { CAREER_RESOURCES, ResourceItem } from '../data/portalData';

export const CareerResourcesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'DET Interview', label: 'DET Interview Kits' },
    { id: 'NATS Guide', label: 'NATS / BOAT Official Guides' },
    { id: 'PSU Syllabus', label: 'RRB / SSC JE Syllabus' },
    { id: 'MSBTE / BTEUP Papers', label: 'MSBTE / BTEUP Model Papers' },
  ];

  const filteredResources = CAREER_RESOURCES.filter((res) => {
    if (selectedCategory !== 'all' && res.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!res.title.toLowerCase().includes(q) && !res.description.toLowerCase().includes(q) && !res.branch.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleDownload = (res: ResourceItem) => {
    setDownloadToast(`Downloading: "${res.title}" (PDF Package)`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">download_done</span>
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Free Study Material & Placement Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            Polytechnic Career & Exam Resources
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
            Download solved model answers, Diploma Engineer Trainee (DET) technical viva question banks, and government PSU exam roadmaps.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by topic (GD&T, PLC ladder logic, Concrete tests, RRB JE, MSBTE)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
          />
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <span className="px-2.5 py-0.5 bg-primary-fixed text-primary text-[11px] font-bold rounded-md">
                  {res.category}
                </span>
                <span className="text-[11px] text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  {res.readsOrDownloads}
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface mb-2 leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                {res.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl bg-surface-container-low/70">
              <div className="text-[11px] text-on-surface-variant">
                <span className="font-semibold text-on-surface">Target: {res.branch}</span> • {res.dateAdded}
              </div>
              <button
                onClick={() => handleDownload(res)}
                className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Salary & Industrial Corridor Benchmark Report */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30">
        <h3 className="text-base font-bold text-on-surface mb-1">
          2024-2025 Polytechnic Fresher Salary Benchmarks by Industrial Belt
        </h3>
        <p className="text-xs text-on-surface-variant mb-4">
          Report aggregated from 42,000+ verified campus and off-campus offer letters across Indian industrial corridors:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="font-bold text-on-surface block">Pune & PCMC MIDC</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Automotive, Heavy Forging, IoT</span>
            <span className="text-sm font-extrabold text-primary block mt-2">₹2.6L - ₹4.2L / yr</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="font-bold text-on-surface block">Chennai & Sriperumbudur</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Automobile, Electronics, Hydraulics</span>
            <span className="text-sm font-extrabold text-primary block mt-2">₹2.5L - ₹3.9L / yr</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="font-bold text-on-surface block">Bengaluru (Peenya & Whitefield)</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Precision Tooling, IT Support, EV</span>
            <span className="text-sm font-extrabold text-primary block mt-2">₹3.0L - ₹5.0L / yr</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="font-bold text-on-surface block">Gujarat (Sanand & Dahej)</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Chemicals, EV Batteries, EPC Infra</span>
            <span className="text-sm font-extrabold text-primary block mt-2">₹2.8L - ₹4.4L / yr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
