import React, { useState } from 'react';
import { JOBS_DATA, Job } from '../data/portalData';

interface ApprenticeshipsScreenProps {
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
  onCheckEligibility: () => void;
}

export const ApprenticeshipsScreen: React.FC<ApprenticeshipsScreenProps> = ({
  onApplyJob,
  onViewJobDetails,
  onCheckEligibility,
}) => {
  const [calcTrade, setCalcTrade] = useState<number>(14500);
  const [calcSector, setCalcSector] = useState<number>(1.0);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const estimatedStipend = Math.round(calcTrade * calcSector);
  const apprenticeJobs = JOBS_DATA.filter((j) => j.type === 'apprentice' || j.natsApproved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-fixed to-surface-container-highest rounded-3xl p-6 sm:p-10 border border-primary-fixed-dim relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            Ministry of Education & BOAT Certified NATS Gateway
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface mb-3">
            National Apprenticeship Training Scheme (NATS) for Diploma Engineers
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
            Get guaranteed 1-year practical industry training in Central/State PSUs, Indian Railways, and Tier-1 conglomerates. Receive monthly DBT stipends ranging from ₹12,000 to ₹18,500 directly into your bank account.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onCheckEligibility}
              className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Verify 16-Digit NATS Eligibility
            </button>
            <a
              href="#checklist"
              className="bg-surface-container-lowest hover:bg-surface text-on-surface text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs border border-outline-variant/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              Registration Checklist
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 text-center">
          <div className="text-2xl font-extrabold text-primary">₹14,500</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">Average Monthly DBT Stipend</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 text-center">
          <div className="text-2xl font-extrabold text-secondary">3,200+</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">Active PSU & Corporate Seats</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 text-center">
          <div className="text-2xl font-extrabold text-tertiary">1 Year</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">Mandatory Training Term</div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 text-center">
          <div className="text-2xl font-extrabold text-primary">100%</div>
          <div className="text-xs text-on-surface-variant font-medium mt-1">Govt Certificate of Proficiency</div>
        </div>
      </div>

      {/* Embedded Live Stipend Calculator & Breakdown */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">calculate</span>
              <h2 className="text-lg font-bold text-on-surface">
                Official NATS Stipend Estimator & DBT Simulator
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Under the Apprentices Act 1961 as amended in 2021, diploma engineering apprentices receive direct stipend payouts composed of 50% Government DBT and 50% Employer share.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Select Diploma Stream</label>
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
                  <option value={14000}>Chemical Engineering (₹14,000 base)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Company / PSU Category</label>
                <select
                  value={calcSector}
                  onChange={(e) => setCalcSector(Number(e.target.value))}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-medium text-on-surface border border-outline-variant/40 outline-none"
                >
                  <option value={1.0}>Heavy Engineering / Tier-1 MNC (100% Rate)</option>
                  <option value={1.15}>PSU Maharatna / Navratna (BHEL, IOCL, ONGC) (+15%)</option>
                  <option value={0.95}>Auto Ancillary & MIDC Units (Standard)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant">Estimated Monthly Stipend</span>
            <div className="text-2xl font-extrabold text-primary my-1">
              ₹{estimatedStipend.toLocaleString('en-IN')} <span className="text-xs font-normal text-on-surface-variant">/ month</span>
            </div>
            <div className="space-y-1 text-[11px] text-on-surface-variant pt-2 border-t border-surface-container">
              <div className="flex justify-between">
                <span>Govt DBT Transfer:</span>
                <span className="font-bold text-secondary">₹{Math.round(estimatedStipend / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Employer Direct Transfer:</span>
                <span className="font-bold text-on-surface">₹{Math.round(estimatedStipend / 2).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              Credited directly into Aadhaar NPCI linked bank
            </div>
          </div>
        </div>
      </div>

      {/* Open Apprenticeships Vacancies List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Active NATS Approved Apprenticeships</h2>
            <p className="text-xs text-on-surface-variant">Verified direct training contracts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apprenticeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-base ${job.companyColor}`}
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
                      <div className="text-xs text-on-surface-variant">
                        {job.company} • {job.location}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary-fixed text-primary rounded-md text-[11px] font-bold">
                    NATS 1-Yr
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 my-3">
                  <span className="px-2.5 py-0.5 bg-secondary-fixed/50 text-secondary rounded-lg text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    {job.salary}
                  </span>
                  <span className="px-2.5 py-0.5 bg-surface-container rounded-lg text-xs text-on-surface font-semibold">
                    {job.branch}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-5 -mb-5 p-3.5 rounded-b-2xl bg-surface-container-low/70">
                <span className="text-[11px] text-on-surface-variant">Open Seats: {job.openings}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewJobDetails(job)}
                    className="px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container rounded-lg"
                  >
                    View Terms
                  </button>
                  <button
                    onClick={() => onApplyJob(job)}
                    className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Apply with NATS ID
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step NATS Checklist Section */}
      <div id="checklist" className="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          4 Steps to Register on the Official NATS / BOAT Portal
        </h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Follow these mandatory steps to activate your 16-digit enrollment number for monthly DBT stipend disbursal:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs mb-3">
              1
            </div>
            <h4 className="text-xs font-bold text-on-surface mb-1">Student Enrollment</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Visit nats.education.gov.in and click "Student Register" with your MSBTE/BTEUP roll number and provisional certificate.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs mb-3">
              2
            </div>
            <h4 className="text-xs font-bold text-on-surface mb-1">NPCI Aadhaar Bank Seeding</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Link your Aadhaar card with your active savings bank account (SBI, Bank of Baroda, etc.) to enable direct govt DBT credits.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs mb-3">
              3
            </div>
            <h4 className="text-xs font-bold text-on-surface mb-1">Contract Code Generation</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Once selected by Tata Motors, L&T, or BHEL, the plant HR generates your formal 12-month training contract.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-xs mb-3">
              4
            </div>
            <h4 className="text-xs font-bold text-on-surface mb-1">Certificate of Proficiency</h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Upon completing 365 days of shopfloor training, receive an official Government of India National Apprenticeship Certificate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
