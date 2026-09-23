import React from 'react';
import { Job } from '../data/portalData';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApply,
  isSaved,
  onToggleSave,
}) => {
  if (!job) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert(`Link for ${job.title} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 bg-surface-container-low border-b border-surface-container">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-xl ${job.companyColor} shrink-0`}
              >
                {job.companyInitials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-xl font-bold text-on-surface">{job.title}</h3>
                  {job.isVerified && (
                    <span className="px-2 py-0.5 bg-secondary-fixed/50 text-secondary text-[11px] font-bold rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Verified Recruiter
                    </span>
                  )}
                  {job.natsApproved && (
                    <span className="px-2 py-0.5 bg-primary-fixed text-primary text-[11px] font-bold rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">account_balance</span>
                      NATS / BOAT Certified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
                  <span className="font-semibold text-on-surface">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="text-secondary font-medium">{job.industrialBelt}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant block font-medium">Salary / Stipend</span>
              <span className="text-xs font-bold text-secondary">{job.salary}</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant block font-medium">Eligible Stream</span>
              <span className="text-xs font-bold text-primary truncate block">{job.branch}</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant block font-medium">Experience Level</span>
              <span className="text-xs font-bold text-on-surface">{job.experience}</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant block font-medium">Minimum Cutoff</span>
              <span className="text-xs font-bold text-tertiary">{job.minPercentage}% Aggregate</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-on-surface">
          {/* Zero-Fee Charter Guarantee Box */}
          <div className="p-3.5 bg-secondary-fixed/30 text-on-secondary-container rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-secondary">verified_user</span>
              <span className="leading-snug">
                <strong>Zero-Fee Audited Listing: </strong> This employer is legally committed not to charge candidates any interview or placement fees.
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-surface-container-lowest text-secondary font-bold rounded shrink-0">
              100% Free
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-on-surface mb-2">Role Overview</h4>
            <p className="text-on-surface-variant leading-relaxed text-xs">{job.description}</p>
          </div>

          {/* Key Day-to-Day Responsibilities */}
          <div>
            <h4 className="text-sm font-bold text-on-surface mb-2">Shopfloor & Technical Responsibilities</h4>
            <ul className="space-y-1.5 text-on-surface-variant text-xs">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                    check
                  </span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Skills Required */}
          <div>
            <h4 className="text-sm font-bold text-on-surface mb-2">Technical Skills & Tools</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Plant Perks & Amenities */}
          <div>
            <h4 className="text-sm font-bold text-on-surface mb-2">Plant Amenities & Benefits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg text-xs text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    check_circle
                  </span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-primary-fixed text-primary border-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSaved ? 'bookmark_added' : 'bookmark_border'}
              </span>
              <span>{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApply(job);
                onClose();
              }}
              className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Quick Apply with Diploma Roll No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
