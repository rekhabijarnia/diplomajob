import React, { useState, useMemo } from 'react';
import { Job } from '../data/portalData';

interface FindJobsScreenProps {
  jobs: Job[];
  initialBranch?: string;
  initialCompany?: string;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
}

export const FindJobsScreen: React.FC<FindJobsScreenProps> = ({
  jobs,
  initialBranch,
  initialCompany,
  savedJobIds,
  onToggleSaveJob,
  onApplyJob,
  onViewJobDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(initialBranch || 'all');
  const [selectedType, setSelectedType] = useState<'all' | 'job' | 'apprentice' | 'internship'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'cutoff'>('latest');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Saved filter
      if (showSavedOnly && !savedJobIds.includes(job.id)) {
        return false;
      }

      // Branch filter
      if (selectedBranch !== 'all' && job.branchSlug !== selectedBranch) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Company initial filter
      if (initialCompany && !job.company.toLowerCase().includes(initialCompany.toLowerCase())) {
        return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchLocation = job.location.toLowerCase().includes(q);
        const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchLocation && !matchSkills) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') {
        return b.salaryNumeric - a.salaryNumeric;
      }
      if (sortBy === 'cutoff') {
        return a.minPercentage - b.minPercentage;
      }
      return 0; // Default order
    });
  }, [jobs, selectedBranch, selectedType, selectedLocation, searchQuery, sortBy, showSavedOnly, savedJobIds, initialCompany]);

  const branches = [
    { slug: 'all', label: 'All Branches' },
    { slug: 'mech', label: 'Mechanical' },
    { slug: 'comp', label: 'Computer / IT' },
    { slug: 'civil', label: 'Civil' },
    { slug: 'elec', label: 'Electrical' },
    { slug: 'entc', label: 'Electronics & TC' },
    { slug: 'auto', label: 'Automobile' },
    { slug: 'chem', label: 'Chemical' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-highest rounded-2xl p-6 sm:p-8 mb-6 border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              100% Recruiter Verified • Zero Fee Guarantee
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              Verified Diploma & Polytechnic Openings
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
              Apply directly with your polytechnic roll number. Direct interview invitations without commercial middleman fees.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                showSavedOnly
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showSavedOnly ? 'bookmark' : 'bookmark_border'}
              </span>
              <span>Saved Jobs ({savedJobIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-outline-variant/30 mb-6 space-y-4">
        {/* Row 1: Search and Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or skills (e.g. AutoCAD, Python, PLC, CNC)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">clear</span>
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
            >
              <option value="all">All Industrial Locations</option>
              <option value="Pune">Pune & PCMC MIDC</option>
              <option value="Mumbai">Mumbai / Navi Mumbai</option>
              <option value="Bengaluru">Bengaluru / Peenya</option>
              <option value="Chennai">Chennai / Sriperumbudur</option>
              <option value="Gujarat">Gujarat (Sanand / Jamnagar)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:border-primary text-on-surface"
            >
              <option value="latest">Sort: Recently Posted</option>
              <option value="salary">Sort: Package (High to Low)</option>
              <option value="cutoff">Sort: Cutoff % (Lowest First)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Opportunity Type Filters & Branch Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-container">
          {/* Opportunity Type Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl">
            {(
              [
                { id: 'all', label: 'All Openings' },
                { id: 'job', label: 'Full-Time (DET)' },
                { id: 'apprentice', label: 'NATS Apprenticeships' },
                { id: 'internship', label: 'Summer/Winter Internships' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  selectedType === t.id
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <span className="text-xs font-semibold text-on-surface-variant">
            Showing <strong className="text-on-surface">{filteredJobs.length}</strong> matching vacancies
          </span>
        </div>

        {/* Row 3: Branch filter chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-on-surface mr-1">Discipline:</span>
          {branches.map((b) => (
            <button
              key={b.slug}
              onClick={() => setSelectedBranch(b.slug)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedBranch === b.slug
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Listing */}
      {filteredJobs.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/30 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface">No Vacancies Found</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Try adjusting your search criteria, clearing selected filters, or exploring all diploma branches.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBranch('all');
              setSelectedType('all');
              setSelectedLocation('all');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-base ${job.companyColor} shrink-0`}
                      >
                        {job.companyInitials}
                      </div>
                      <div>
                        <h3
                          onClick={() => onViewJobDetails(job)}
                          className="text-sm sm:text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                        >
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs flex-wrap">
                          <span className="font-semibold text-on-surface">{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleSaveJob(job.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-primary-fixed text-primary border-primary'
                          : 'text-on-surface-variant hover:text-primary border-outline-variant/30 hover:bg-surface-container'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="px-2.5 py-0.5 bg-surface-container rounded-lg text-xs text-on-surface font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">payments</span>
                      {job.salary}
                    </span>
                    <span className="px-2.5 py-0.5 bg-surface-container rounded-lg text-xs text-on-surface font-medium">
                      {job.experience}
                    </span>
                    <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-lg text-xs font-semibold">
                      {job.branch}
                    </span>
                    {job.natsApproved && (
                      <span className="px-2.5 py-0.5 bg-secondary-fixed/50 text-secondary rounded-lg text-xs font-bold">
                        NATS / DBT Approved
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[11px] text-on-surface-variant font-medium self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-5 -mb-5 p-3.5 rounded-b-2xl bg-surface-container-low/70">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[15px]">schedule</span> {job.postedAgo}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewJobDetails(job)}
                      className="px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onApplyJob(job)}
                      className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
