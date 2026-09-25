import React, { useState } from 'react';
import { COMPANIES_DATA, Company } from '../data/portalData';

interface CompaniesScreenProps {
  onSelectCompany: (companyId: string) => void;
  onViewCompanyJobs: (companyName: string) => void;
}

export const CompaniesScreen: React.FC<CompaniesScreenProps> = ({
  onSelectCompany,
  onViewCompanyJobs,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCompanies = COMPANIES_DATA.filter((comp) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!comp.name.toLowerCase().includes(q) && !comp.category.toLowerCase().includes(q) && !comp.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCategory !== 'all' && !comp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Direct Plant Recruiter Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            Top Employers Hiring Diploma Engineers
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
            Explore 650+ verified engineering giants across automobile, infrastructure, power generation, and petrochemical corridors.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, technology, or plant sector..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
        >
          <option value="all">All Industry Sectors</option>
          <option value="Automotive">Automotive & Commercial Vehicles</option>
          <option value="Infrastructure">Infrastructure & Civil Construction</option>
          <option value="Metallurgy">Metallurgy & Heavy Forging</option>
          <option value="Power">Power Generation & Engines</option>
          <option value="Petrochemicals">Petrochemicals & Energy</option>
          <option value="Hydraulics">Precision Hydraulics & Tooling</option>
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center font-bold text-xl ${comp.color}`}
                  >
                    {comp.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface">{comp.name}</h3>
                    <p className="text-xs text-primary font-semibold">{comp.category}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">HQ: {comp.headquarters}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-secondary-fixed/50 text-secondary text-xs font-bold rounded-lg whitespace-nowrap">
                  {comp.openings} Openings
                </span>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
                {comp.description}
              </p>

              {/* Plant Locations */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-on-surface block mb-1">Key Plant Locations / MIDC:</span>
                <div className="flex flex-wrap gap-1">
                  {comp.locations.map((loc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-surface-container text-on-surface rounded text-[11px] font-medium"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hiring Branches */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-on-surface block mb-1">Target Diploma Disciplines:</span>
                <div className="flex flex-wrap gap-1">
                  {comp.hiringBranches.map((br, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-primary-fixed text-primary rounded text-[11px] font-bold"
                    >
                      {br}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl bg-surface-container-low/70">
              <span className="text-[11px] text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Verified Recruiter Seal
              </span>
              <button
                onClick={() => onViewCompanyJobs(comp.name)}
                className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>View {comp.openings} Vacancies</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
