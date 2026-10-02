import React, { useState, useEffect } from 'react';
import { COMPANIES_DATA, Company, AcademicCriteria } from '../data/portalData';
import { CompanyCriteriaModal } from './CompanyCriteriaModal';

interface CompaniesScreenProps {
  onSelectCompany: (companyId: string) => void;
  onViewCompanyJobs: (companyName: string) => void;
}

const STORAGE_KEY = 'diplomajob_custom_companies_criteria';

export const CompaniesScreen: React.FC<CompaniesScreenProps> = ({
  onSelectCompany,
  onViewCompanyJobs,
}) => {
  // Load companies with any custom criteria persisted in localStorage
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Record<string, Partial<Company> & { academicCriteria: AcademicCriteria }> = JSON.parse(saved);
        // Merge with COMPANIES_DATA
        const merged = COMPANIES_DATA.map((comp) => {
          if (parsed[comp.id]) {
            return {
              ...comp,
              ...parsed[comp.id],
              academicCriteria: {
                ...comp.academicCriteria,
                ...parsed[comp.id].academicCriteria,
              },
              isCustomCriteria: true,
            };
          }
          return comp;
        });

        // Add any newly created companies
        Object.entries(parsed).forEach(([id, customData]) => {
          if (!merged.some((c) => c.id === id)) {
            merged.unshift({
              id,
              name: customData.name || 'New Engineering Corp',
              initials: (customData.name || 'NC').slice(0, 2).toUpperCase(),
              color: 'text-primary',
              openings: customData.openings || 25,
              category: customData.category || 'Automotive & Manufacturing',
              headquarters: customData.headquarters || 'Pune, Maharashtra',
              locations: customData.locations || ['Chakan (Pune)', 'Sanand'],
              description: customData.description || 'Verified enterprise hiring diploma engineers directly with zero placement fees.',
              hiringBranches: customData.hiringBranches || ['Mechanical', 'Electrical', 'Automobile'],
              benefits: customData.benefits || ['Subsidized Canteen', 'Plant Transport', 'Medical Cover'],
              academicCriteria: customData.academicCriteria,
              isCustomCriteria: true,
            } as Company & { isCustomCriteria?: boolean });
          }
        });

        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse saved custom companies:', e);
    }
    return COMPANIES_DATA;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCgpaFilter, setSelectedCgpaFilter] = useState<string>('all');
  const [selectedQualification, setSelectedQualification] = useState<string>('all');
  const [selectedBacklogFilter, setSelectedBacklogFilter] = useState<string>('all');

  // Candidate Self-Check Interactive Input
  const [candidateCgpaInput, setCandidateCgpaInput] = useState<string>('7.2');
  const [candidateBacklogs, setCandidateBacklogs] = useState<number>(0);

  // Criteria Modal State
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const parsedCandidateCgpa = parseFloat(candidateCgpaInput);

  const handleOpenAddCriteria = (companyToEdit?: Company) => {
    setEditingCompany(companyToEdit || null);
    setIsCriteriaModalOpen(true);
  };

  const handleSaveCriteria = (
    companyId: string,
    updatedData: Partial<Company> & { academicCriteria: AcademicCriteria }
  ) => {
    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === companyId);
      let updated: Company[];
      if (exists) {
        updated = prev.map((c) =>
          c.id === companyId
            ? ({
                ...c,
                ...updatedData,
                academicCriteria: updatedData.academicCriteria,
                isCustomCriteria: true,
              } as Company)
            : c
        );
      } else {
        const newComp: Company = {
          id: companyId,
          name: updatedData.name || 'New Enterprise',
          initials: (updatedData.name || 'NE').slice(0, 2).toUpperCase(),
          color: 'text-primary',
          openings: 20,
          category: updatedData.category || 'Automotive & Manufacturing',
          headquarters: updatedData.headquarters || 'Pune, Maharashtra',
          locations: ['Pune Industrial Corridor'],
          description: 'Recruiting polytechnic diploma candidates with verified criteria.',
          hiringBranches: ['Mechanical', 'Electrical', 'Production'],
          benefits: ['Subsidized Canteen', 'Provident Fund', 'Annual Bonus'],
          academicCriteria: updatedData.academicCriteria,
          isCustomCriteria: true,
        } as Company;
        updated = [newComp, ...prev];
      }

      // Persist to localStorage
      try {
        const existingStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        existingStored[companyId] = {
          ...updatedData,
          academicCriteria: updatedData.academicCriteria,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingStored));
      } catch (err) {
        console.warn('Error saving to localStorage:', err);
      }

      return updated;
    });

    showToast(`Academic criteria saved for ${updatedData.name || 'Company'}! Cutoff updated to ${updatedData.academicCriteria.minCgpa} CGPA (${updatedData.academicCriteria.minPercentage}%).`);
  };

  const filteredCompanies = companies.filter((comp) => {
    // Search text
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = comp.name.toLowerCase().includes(q);
      const matchCategory = comp.category.toLowerCase().includes(q);
      const matchDesc = comp.description.toLowerCase().includes(q);
      const matchSpecial = comp.academicCriteria.specialConditions?.toLowerCase().includes(q);
      const matchQual = comp.academicCriteria.allowedQualifications.some((ql) => ql.toLowerCase().includes(q));
      if (!matchName && !matchCategory && !matchDesc && !matchSpecial && !matchQual) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'all' && !comp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    // Min CGPA Cutoff
    if (selectedCgpaFilter !== 'all') {
      const maxAllowedCutoff = parseFloat(selectedCgpaFilter);
      // Candidates can filter for companies whose cutoff is <= their filter target
      if (comp.academicCriteria.minCgpa > maxAllowedCutoff) {
        return false;
      }
    }

    // Qualification
    if (selectedQualification !== 'all') {
      const hasQual = comp.academicCriteria.allowedQualifications.some((q) =>
        q.toLowerCase().includes(selectedQualification.toLowerCase())
      );
      if (!hasQual) return false;
    }

    // Backlog filter
    if (selectedBacklogFilter === 'zero' && comp.academicCriteria.maxLiveBacklogs > 0) {
      return false;
    }
    if (selectedBacklogFilter === 'allows_backlogs' && comp.academicCriteria.maxLiveBacklogs === 0) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-secondary/40 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Direct Plant Recruiter Directory & Degree Standards
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            Top Employers & Academic Criteria
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-2xl leading-relaxed">
            Verify official Minimum CGPA / Percentage cutoffs, accepted polytechnic diplomas, lateral entry degrees, and backlog policies across 650+ verified engineering giants.
          </p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleOpenAddCriteria()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 hover:scale-101 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add / Configure Company Criteria</span>
            </button>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              Recruiters can customize CGPA cutoffs & degree eligibility
            </span>
          </div>
        </div>

        {/* Quick Candidate Eligibility Check Card */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-primary/20 shadow-md md:w-80 shrink-0">
          <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
            <span className="material-symbols-outlined text-[18px]">rule</span>
            <span>Live Eligibility Calculator</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mb-3 leading-snug">
            Enter your current Diploma CGPA or % to test match against all employer cutoff requirements:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1">Your CGPA</label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="10.0"
                value={candidateCgpaInput}
                onChange={(e) => setCandidateCgpaInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface focus:border-primary outline-none"
                placeholder="7.2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1">Live Backlogs</label>
              <select
                value={candidateBacklogs}
                onChange={(e) => setCandidateBacklogs(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 text-xs font-bold bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface focus:border-primary outline-none"
              >
                <option value={0}>0 Backlogs</option>
                <option value={1}>1 Backlog</option>
                <option value={2}>2+ Backlogs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-outline-variant/30 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employer, sector, qualification (e.g. Mechanical, Lateral B.Tech)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
            />
          </div>

          {/* Sector filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface font-medium"
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

        {/* Detailed Academic Criteria Filters Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 mr-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Academic Cutoff:
          </span>

          {/* CGPA Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Cutoffs' },
              { id: '6.0', label: 'Max 6.0 CGPA (55%)' },
              { id: '6.5', label: 'Max 6.5 CGPA (60%)' },
              { id: '7.0', label: 'Max 7.0 CGPA (65%)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCgpaFilter(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCgpaFilter === item.id
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <span className="text-outline-variant/40 hidden sm:inline">|</span>

          {/* Qualification Filter */}
          <select
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            className="px-2.5 py-1 text-xs bg-surface-container border border-outline-variant/30 rounded-lg outline-none text-on-surface font-semibold"
          >
            <option value="all">Any Degree / Qualification</option>
            <option value="3-Year Regular">3-Year Regular Diploma</option>
            <option value="Lateral Entry">Lateral Entry B.Tech / Diploma</option>
            <option value="Dual ITI">Dual ITI + Diploma</option>
          </select>

          {/* Backlog Policy */}
          <select
            value={selectedBacklogFilter}
            onChange={(e) => setSelectedBacklogFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-surface-container border border-outline-variant/30 rounded-lg outline-none text-on-surface font-semibold"
          >
            <option value="all">All Backlog Rules</option>
            <option value="zero">Strict 0 Active Backlogs</option>
            <option value="allows_backlogs">Allows Cleared Backlogs (Max 1)</option>
          </select>

          {(selectedCgpaFilter !== 'all' || selectedQualification !== 'all' || selectedBacklogFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedCgpaFilter('all');
                setSelectedQualification('all');
                setSelectedBacklogFilter('all');
                setSelectedCategory('all');
                setSearch('');
              }}
              className="text-xs text-error hover:underline font-semibold ml-auto flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Action Header */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1 flex-wrap gap-2">
        <span>Showing <strong>{filteredCompanies.length}</strong> employers matching academic criteria</span>
        <div className="flex items-center gap-3">
          {candidateCgpaInput && (
            <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Evaluated against your {candidateCgpaInput} CGPA
            </span>
          )}
          <button
            onClick={() => handleOpenAddCriteria()}
            className="text-primary hover:underline font-bold text-xs flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">add_circle</span>
            Add / Update Criteria
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map((comp) => {
          const meetsCgpa = !isNaN(parsedCandidateCgpa) && parsedCandidateCgpa >= comp.academicCriteria.minCgpa;
          const meetsBacklogs = candidateBacklogs <= comp.academicCriteria.maxLiveBacklogs;
          const isEligible = meetsCgpa && meetsBacklogs;
          const isCustom = (comp as any).isCustomCriteria;

          return (
            <div
              key={comp.id}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Logo, Company Name & Live Eligibility Pill */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center font-bold text-xl ${comp.color} shadow-xs shrink-0`}
                    >
                      {comp.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-on-surface group-hover:text-primary transition-colors">
                          {comp.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-secondary/15 text-secondary text-[10px] font-bold rounded-full border border-secondary/30 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Verified Employer
                        </span>
                        {isCustom && (
                          <span className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-extrabold rounded-full border border-primary/30 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">tune</span>
                            Custom Criteria
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-primary font-semibold">{comp.category}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">HQ: {comp.headquarters}</p>
                    </div>
                  </div>

                  {/* Candidate Quick Eligibility Status */}
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 bg-secondary-fixed/50 text-secondary text-xs font-bold rounded-lg mb-1.5">
                      {comp.openings} Openings
                    </span>
                    {candidateCgpaInput && (
                      <div className="block">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            Eligible ({comp.academicCriteria.minCgpa} Cutoff)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                            Needs {comp.academicCriteria.minCgpa} CGPA
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                  {comp.description}
                </p>

                {/* HIGHLIGHTED ACADEMIC & DEGREE CRITERIA BOX */}
                <div className="bg-surface-container-low/80 p-4 rounded-xl border border-outline-variant/40 space-y-3 mb-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">school</span>
                      Academic & Degree Criteria
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-on-surface-variant">Min Cutoff:</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary text-white font-extrabold text-xs shadow-xs">
                          {comp.academicCriteria.minCgpa} CGPA ({comp.academicCriteria.minPercentage}%)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAddCriteria(comp)}
                        className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container text-[11px] flex items-center gap-0.5 font-bold transition-colors"
                        title="Edit Academic Criteria"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Criteria Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Degree Required */}
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant block mb-1">
                        Degree / Qualification Required:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {comp.academicCriteria.allowedQualifications.map((qual, qIdx) => (
                          <span
                            key={qIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface border border-outline-variant/30"
                          >
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Backlog Policy & Eligible Batches */}
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant block">
                          Backlog Policy:
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          comp.academicCriteria.maxLiveBacklogs === 0 ? 'text-secondary' : 'text-amber-400'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {comp.academicCriteria.maxLiveBacklogs === 0 ? 'check_circle' : 'info'}
                          </span>
                          {comp.academicCriteria.maxLiveBacklogs === 0
                            ? 'Strict Zero Active Backlogs at Joining'
                            : `Allows up to ${comp.academicCriteria.maxLiveBacklogs} Cleared Backlog`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant block">
                          Eligible Passing Batches:
                        </span>
                        <span className="text-[11px] font-medium text-on-surface">
                          {comp.academicCriteria.eligibleBatches.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accreditation & Special Terms */}
                  <div className="pt-2 border-t border-outline-variant/20 text-[11px] space-y-1">
                    <div className="flex items-start gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0 mt-0.5">verified_user</span>
                      <span><strong>Board Approval: </strong>{comp.academicCriteria.boardRequirements}</span>
                    </div>
                    {comp.academicCriteria.specialConditions && (
                      <div className="flex items-start gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] text-secondary shrink-0 mt-0.5">info</span>
                        <span><strong>Special Requirement: </strong>{comp.academicCriteria.specialConditions}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Disciplines */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-on-surface block mb-1.5">Target Disciplines:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.hiringBranches.map((br, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-container text-primary rounded-md text-[11px] font-bold border border-primary/20"
                      >
                        {br}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Plant Locations */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-on-surface-variant block mb-1">Key Plant Corridors:</span>
                  <div className="flex flex-wrap gap-1">
                    {comp.locations.map((loc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-container text-on-surface rounded text-[10px] font-medium"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl bg-surface-container-low/70">
                <button
                  type="button"
                  onClick={() => handleOpenAddCriteria(comp)}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl text-xs font-bold transition-all border border-primary/20 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                  <span>Add / Edit Criteria</span>
                </button>
                <button
                  onClick={() => onViewCompanyJobs(comp.name)}
                  className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:scale-101 active:scale-99"
                >
                  <span>View {comp.openings} Openings</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding / Editing Company Academic Criteria */}
      <CompanyCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        onSaveCriteria={handleSaveCriteria}
        existingCompany={editingCompany}
        allCompanies={companies}
      />
    </div>
  );
};
