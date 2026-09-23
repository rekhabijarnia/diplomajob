import React from 'react';
import { JOBS_DATA, Job } from '../data/portalData';

interface InternshipsScreenProps {
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
}

export const InternshipsScreen: React.FC<InternshipsScreenProps> = ({
  onApplyJob,
  onViewJobDetails,
}) => {
  const internshipJobs = JOBS_DATA.filter((j) => j.type === 'internship' || j.salary.includes('month') || j.salary.includes('Stipend'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-secondary-fixed/50 via-surface-container to-surface-container-high rounded-3xl p-6 sm:p-10 border border-secondary-fixed">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-secondary text-xs font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">school</span>
            Mandatory MSBTE & BTEUP 6-Week Summer Training
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface mb-3">
            Polytechnic Industrial Internships
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
            Complete your 4th or 6th semester mandatory in-plant industrial training with verified engineering companies. Receive monthly stipends, practical machine access, and formal completion certificates for college viva submission.
          </p>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internshipJobs.map((job) => (
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
                <span className="px-2 py-0.5 bg-secondary-fixed/60 text-secondary rounded-md text-[11px] font-bold">
                  Internship
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 my-3">
                <span className="px-2.5 py-0.5 bg-surface-container rounded-lg text-xs text-on-surface font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">payments</span>
                  {job.salary}
                </span>
                <span className="px-2.5 py-0.5 bg-primary-fixed text-primary rounded-lg text-xs font-semibold">
                  {job.branch}
                </span>
                <span className="px-2.5 py-0.5 bg-surface-container rounded-lg text-xs text-on-surface-variant">
                  {job.experience}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container-low -mx-5 -mb-5 p-3.5 rounded-b-2xl bg-surface-container-low/70">
              <span className="text-[11px] text-on-surface-variant">
                Certificate for MSBTE Credit Included
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewJobDetails(job)}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container rounded-lg"
                >
                  Details
                </button>
                <button
                  onClick={() => onApplyJob(job)}
                  className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  Quick Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
