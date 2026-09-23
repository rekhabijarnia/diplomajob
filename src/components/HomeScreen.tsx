import React, { useState } from 'react';
import { BRANCHES_DATA, JOBS_DATA, COMPANIES_DATA, TESTIMONIALS_DATA, Job } from '../data/portalData';

interface HomeScreenProps {
  onSelectBranch: (branchSlug: string) => void;
  onSelectCompany: (companyId: string) => void;
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
  onNavigate: (screen: any) => void;
  onOpenReportFraud: () => void;
  onOpenAuth: () => void;
  onOpenNatsEligibility: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectBranch,
  onSelectCompany,
  onApplyJob,
  onViewJobDetails,
  onNavigate,
  onOpenReportFraud,
  onOpenAuth,
  onOpenNatsEligibility,
}) => {
  // Hero Search State
  const [searchSkills, setSearchSkills] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');

  // NATS Calculator State
  const [calcTrade, setCalcTrade] = useState<number>(14500);
  const [calcSector, setCalcSector] = useState<number>(1.0);

  const estimatedStipend = Math.round(calcTrade * calcSector);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('find-jobs');
  };

  const featuredJobs = JOBS_DATA.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-surface pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Signals Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-xs text-secondary text-xs font-bold border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
              4.9/5 Student Trust Rating
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-container text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              100% Free • Zero Placement Fees
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              AICTE, MSBTE & NATS Aligned
            </span>
          </div>

          {/* Main Typography Hierarchy */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight mb-3">
              Find Your First Job <br className="hidden sm:inline" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">
                After Diploma
              </span>
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Discover 18,500+ verified fresher jobs, apprenticeships (NATS/BOAT approved), and technical internships tailored specifically for India’s polytechnic diploma graduates.
            </p>
          </div>

          {/* Smart Multi-Input Search Engine */}
          <div className="max-w-5xl mx-auto bg-surface-container-lowest rounded-2xl shadow-xl p-2.5 sm:p-3 border border-outline-variant/30 mb-5">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Field 1: Technical Role / Skills */}
              <div className="md:col-span-4 flex items-center px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-outline mr-2 text-[20px]">build</span>
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-on-surface-variant leading-none mb-1">
                    Skills / Job Title
                  </label>
                  <input
                    value={searchSkills}
                    onChange={(e) => setSearchSkills(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-on-surface outline-none placeholder:text-outline font-medium"
                    placeholder="AutoCAD, CNC, Python, PLC..."
                    type="text"
                  />
                </div>
              </div>

              {/* Field 2: Branch Selector */}
              <div className="md:col-span-3 flex items-center px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-outline mr-2 text-[20px]">school</span>
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-on-surface-variant leading-none mb-1">
                    Branch Stream
                  </label>
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-on-surface outline-none cursor-pointer font-medium"
                  >
                    <option value="all">All Diploma Branches</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="comp">Computer / IT</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="elec">Electrical Engineering</option>
                    <option value="entc">Electronics & TC</option>
                    <option value="auto">Automobile Engineering</option>
                    <option value="chem">Chemical Engineering</option>
                  </select>
                </div>
              </div>

              {/* Field 3: Location / Industrial Belts */}
              <div className="md:col-span-3 flex items-center px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-outline mr-2 text-[20px]">location_on</span>
                <div className="w-full">
                  <label className="block text-[11px] font-bold text-on-surface-variant leading-none mb-1">
                    Industrial Hub
                  </label>
                  <input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-on-surface outline-none placeholder:text-outline font-medium"
                    placeholder="Pune, Chennai, MIDC, Remote"
                    type="text"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="md:col-span-2 flex">
                <button
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 py-3 transition-colors shadow-md"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
            <span className="text-xs text-on-surface-variant font-semibold">Trending Searches:</span>
            {[
              'Freshers 2024/2025',
              'Tata Motors Apprentice',
              'Junior Web Dev',
              'Sub-Engineer Civil',
              'CNC Programmer',
              'Wiring Harness',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => onNavigate('find-jobs')}
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full text-xs text-on-surface font-medium transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Hero Visual Mosaic Strip */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[28px]">precision_manufacturing</span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-on-surface">5,400+</div>
                <div className="text-xs text-on-surface-variant font-medium">Core Manufacturing & MIDC Jobs</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[28px]">badge</span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-on-surface">4,120+</div>
                <div className="text-xs text-on-surface-variant font-medium">NATS Government Stipends</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary shrink-0">
                <span className="material-symbols-outlined text-[28px]">terminal</span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-on-surface">3,890+</div>
                <div className="text-xs text-on-surface-variant font-medium">IT, QA & Technical Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHES HUB (INTERACTIVE BENTO GRID) */}
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="text-xs text-primary uppercase tracking-wider mb-1 font-extrabold">
                Polytechnic Disciplines
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                Explore by Diploma Engineering Branch
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Every branch tailored with specific salary ranges, skill requisites, and immediate plant & corporate openings across India.
            </p>
          </div>

          {/* Bento Grid 8 Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRANCHES_DATA.map((branch) => (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch.slug)}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">{branch.icon}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${branch.badgeBg} ${branch.badgeText} text-[11px] font-bold`}>
                      {branch.openings.toLocaleString('en-IN')} Openings
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-1.5 group-hover:text-primary transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {branch.description}
                  </p>
                </div>
                <div>
                  <div className="bg-surface-container-low px-3 py-2 rounded-xl flex items-center justify-between mb-3 border border-outline-variant/20">
                    <span className="text-[11px] font-semibold text-on-surface-variant">Fresher Package:</span>
                    <span className="text-xs text-secondary font-bold">{branch.fresherPackage}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-primary font-bold group-hover:gap-2 transition-all">
                    <span>View Openings</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED & VERIFIED JOBS SECTION */}
      <section className="py-12 sm:py-16 bg-surface-container-low" id="featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Direct Recruiter Verification
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                Latest Verified Jobs for Diploma Freshers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline"
            >
              <span>Browse all 18,500+ Jobs</span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </button>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-lg ${job.companyColor}`}
                      >
                        {job.companyInitials}
                      </div>
                      <div>
                        <h3
                          onClick={() => onViewJobDetails(job)}
                          className="text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                        >
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                          <span className="font-semibold text-on-surface">{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-secondary-fixed/50 text-secondary rounded-md text-[11px] font-bold whitespace-nowrap">
                      Verified Employer
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-4">
                    <span className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-on-surface font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-secondary">payments</span>
                      {job.salary}
                    </span>
                    <span className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-on-surface font-medium">
                      {job.experience}
                    </span>
                    <span className="px-2.5 py-1 bg-primary-fixed text-on-primary-fixed rounded-lg text-xs font-semibold">
                      {job.branch}
                    </span>
                    <span className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-on-surface-variant">
                      Demo Listing
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl bg-surface-container-low/70">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {job.postedAgo}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewJobDetails(job)}
                      className="px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onApplyJob(job)}
                      className="bg-primary hover:bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NATS / GOVERNMENT APPRENTICESHIP SHOWCASE */}
      <section className="py-12 sm:py-16 bg-surface" id="nats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-fixed to-surface-container-highest rounded-3xl p-6 sm:p-10 text-on-surface relative overflow-hidden border border-primary-fixed-dim">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text and Scheme Highlights */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-bold mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  Ministry of Education (Govt. of India) Scheme
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3 leading-tight">
                  1-Year NATS & BOAT Apprenticeships
                </h2>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Gain mandatory 1-year hands-on industrial training right after polytechnic. Receive monthly government direct benefit transfer (DBT) stipends ranging from{' '}
                  <strong className="text-on-surface">₹12,000 to ₹18,500/month</strong> with official government certification.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-outline-variant/30">
                    <div className="text-xl font-extrabold text-primary">₹14,500</div>
                    <div className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Avg PSU Monthly Stipend</div>
                  </div>
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-outline-variant/30">
                    <div className="text-xl font-extrabold text-secondary">100%</div>
                    <div className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Govt Certificate Award</div>
                  </div>
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-outline-variant/30 col-span-2 sm:col-span-1">
                    <div className="text-xl font-extrabold text-tertiary">3,200+</div>
                    <div className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Active PSU/Corp Seats</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onOpenNatsEligibility}
                    className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    Check NATS Eligibility
                  </button>
                  <button
                    onClick={() => onNavigate('career-resources')}
                    className="bg-surface-container-lowest hover:bg-surface text-on-surface text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs border border-outline-variant/30 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download NATS User Guide
                  </button>
                </div>
              </div>

              {/* Interactive Stipend & Eligibility Calculator Card */}
              <div className="lg:col-span-5">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-lg border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-extrabold text-on-surface">Stipend Estimator</span>
                    <span className="material-symbols-outlined text-secondary text-[24px]">calculate</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Calculate your estimated apprentice pay based on trade and industry tier.
                  </p>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Your Diploma Stream</label>
                      <select
                        value={calcTrade}
                        onChange={(e) => setCalcTrade(Number(e.target.value))}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-medium text-on-surface border border-outline-variant/40 outline-none"
                      >
                        <option value={14500}>Mechanical / Production (₹14,500 base)</option>
                        <option value={15500}>Electrical / Electronics (₹15,500 base)</option>
                        <option value={16000}>Computer / Information Tech (₹16,000 base)</option>
                        <option value={13500}>Civil / Environmental (₹13,500 base)</option>
                        <option value={15000}>Automobile / EV Tech (₹15,000 base)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Industry Sector</label>
                      <select
                        value={calcSector}
                        onChange={(e) => setCalcSector(Number(e.target.value))}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-medium text-on-surface border border-outline-variant/40 outline-none"
                      >
                        <option value={1.0}>Heavy Engineering / Tier-1 MNC (100%)</option>
                        <option value={1.15}>PSU / Central Govt Navratna (+15% Allowance)</option>
                        <option value={0.95}>Auto Ancillary & MIDC MSME (Standard)</option>
                      </select>
                    </div>

                    <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between border border-outline-variant/20">
                      <div>
                        <div className="text-[11px] font-semibold text-on-surface-variant">
                          Estimated Monthly Stipend:
                        </div>
                        <div className="text-xl font-extrabold text-primary">
                          ₹{estimatedStipend.toLocaleString('en-IN')} / mo
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/60 text-secondary text-[11px] font-bold">
                        DBT Direct Pay
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('apprenticeships')}
                      className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary py-2.5 rounded-xl text-xs font-bold transition-colors text-center shadow-xs flex items-center justify-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>Apply for Matching NATS Openings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP HIRING COMPANIES */}
      <section className="py-12 sm:py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
              Trusted by Top Indian Engineering Giants
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Over 650+ verified corporate recruiters directly conduct walk-in and virtual placement drives on DiplomaJob.
            </p>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {COMPANIES_DATA.map((company) => (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company.id)}
                className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm ${company.color} mb-2 group-hover:scale-110 transition-transform`}
                >
                  {company.initials}
                </div>
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  {company.name}
                </span>
                <span className="text-[11px] text-secondary font-semibold mt-0.5">
                  {company.openings} Openings
                </span>
              </div>
            ))}

            {/* View Directory Card */}
            <div
              onClick={() => onNavigate('companies')}
              className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">
                +550
              </div>
              <span className="text-xs font-bold text-on-surface">More Corporates</span>
              <span className="text-[11px] text-primary font-bold mt-0.5 group-hover:underline">
                View Directory →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW DIPLOMA JOB WORKS (3-STEP VISUAL FLOW) */}
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="text-xs text-primary uppercase font-extrabold tracking-wider mb-1">
              Seamless Experience
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
              How DiplomaJob Accelerates Your Career
            </h2>
            <p className="text-sm text-on-surface-variant">
              Built exclusively for polytechnic engineers — zero B.Tech overlap and zero confusing requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary font-extrabold flex items-center justify-center text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Create Diploma Profile</h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Input your Board (MSBTE, BTEUP, DTE Karnataka), aggregate percentage, and technical lab skills in less than 3 minutes.
              </p>
              <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Instant Roll Number Verification
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary font-extrabold flex items-center justify-center text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Smart Branch Matching</h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Our recommendation engine filters out non-diploma vacancies, surfacing only roles actively hiring polytechnic talent.
              </p>
              <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Zero Clutter, 100% Targeted
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary font-extrabold flex items-center justify-center text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Direct HR Interviews</h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Receive direct WhatsApp alerts and email calls for plant interviews and campus walk-in drives with zero middlemen.
              </p>
              <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                100% Free - Zero Charges Always
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES & TESTIMONIALS */}
      <section className="py-12 sm:py-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="text-xs text-primary uppercase font-extrabold tracking-wider mb-1">
              Alumni Proof
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
              Polytechnic Graduates Placed via DiplomaJob
            </h2>
            <p className="text-sm text-on-surface-variant">
              Hear from graduates who transformed their diploma certificates into successful technical careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(t.stars)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface mb-4 italic leading-relaxed">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 bg-surface-container-low -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-outline-variant/20">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-xs ring-2 ring-primary/20 shrink-0"
                    alt={t.name}
                    src={t.image}
                  />
                  <div>
                    <div className="text-xs font-bold text-on-surface">{t.name}</div>
                    <div className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                      {t.college} • {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & FRAUD PREVENTION CALLOUT BOX */}
      <section className="py-12 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-highest/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[32px]">shield_with_heart</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1">
                  DiplomaJob Official Student Security Charter
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                  Every job listing on our network is vetted by our compliance team.{' '}
                  <strong className="text-on-surface font-bold">
                    No company or HR has the right to charge application fees, training deposits, or uniform fees.
                  </strong>{' '}
                  If anyone asks for money under our name, report them immediately.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-on-surface text-xs">
                  <span className="flex items-center gap-1 text-secondary font-bold">
                    <span className="material-symbols-outlined text-[16px]">verified</span> 100% Free For All Students
                  </span>
                  <span>•</span>
                  <span className="font-medium text-on-surface-variant">Direct Police / Cyber Cell Escalation</span>
                  <span>•</span>
                  <span className="font-medium text-on-surface-variant">Toll-Free WhatsApp Helpline</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={onOpenReportFraud}
                className="w-full sm:w-auto text-center px-4 py-2.5 bg-error hover:bg-on-error-container text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Report Suspicious HR
              </button>
              <button
                onClick={() => onNavigate('career-resources')}
                className="w-full sm:w-auto text-center px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition-colors border border-outline-variant/30"
              >
                Safety Tips
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION (POLYTECHNIC FAST-TRACK) */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-primary-container text-on-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Ready to Launch Your Technical Career?
          </h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6 text-on-primary-container leading-relaxed">
            Join 120,000+ diploma engineers actively landing verified core manufacturing, civil, electrical, and software engineering roles across India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="bg-surface-container-lowest hover:bg-surface text-primary text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-lg"
            >
              Register for Free
            </button>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="bg-primary/20 hover:bg-primary/30 text-on-primary text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors border border-white/20"
            >
              Browse All Openings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
