import React, { useState } from 'react';

interface NatsEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNats: () => void;
}

export const NatsEligibilityModal: React.FC<NatsEligibilityModalProps> = ({
  isOpen,
  onClose,
  onApplyNats,
}) => {
  const [passingYear, setPassingYear] = useState('2024');
  const [stream, setStream] = useState('Mechanical Engineering');
  const [hasWorkExpOverOneYear, setHasWorkExpOverOneYear] = useState(false);
  const [hasDoneApprenticeshipBefore, setHasDoneApprenticeshipBefore] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  const isEligible = !hasWorkExpOverOneYear && !hasDoneApprenticeshipBefore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-on-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
            <div>
              <h3 className="text-base font-bold">Official NATS Eligibility Checker</h3>
              <p className="text-xs text-on-primary/80">Apprentices Act 1961 Compliance Rule Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {!checked ? (
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-on-surface mb-1">Diploma Completion Year</label>
                <select
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none"
                >
                  <option value="2025">2025 (Appearing Final Semester)</option>
                  <option value="2024">2024 Passout (Eligible for 3 years)</option>
                  <option value="2023">2023 Passout (Eligible)</option>
                  <option value="2022">2022 Passout (Eligible)</option>
                  <option value="2021">2021 or earlier (Expired window)</option>
                </select>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Rule: Diploma candidates are eligible up to 3 years from date of passing certificate.
                </p>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Diploma Engineering Branch</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Engineering & IT">Computer Engineering & IT</option>
                  <option value="Electronics & TC">Electronics & TC</option>
                  <option value="Automobile Engineering">Automobile Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-surface-container">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-on-surface">
                  <input
                    type="checkbox"
                    checked={hasWorkExpOverOneYear}
                    onChange={(e) => setHasWorkExpOverOneYear(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span>I have 1 year or more of full-time work experience</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-on-surface">
                  <input
                    type="checkbox"
                    checked={hasDoneApprenticeshipBefore}
                    onChange={(e) => setHasDoneApprenticeshipBefore(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span>I have already completed a 1-year NATS apprenticeship elsewhere</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setChecked(true)}
                  className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-lg shadow-sm"
                >
                  Verify My Eligibility Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              {isEligible && passingYear !== '2021' ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface">
                    Congratulations! You are 100% Eligible for NATS 2.0
                  </h4>
                  <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed text-xs">
                    As a <strong>{passingYear} {stream}</strong> diploma holder, you qualify for 1-year government apprentice contracts with monthly DBT stipends up to <strong>₹18,500/month</strong>.
                  </p>
                  <div className="p-3 bg-secondary-fixed/30 rounded-xl text-left border border-secondary-fixed">
                    <p className="font-bold text-on-secondary-container mb-1">Next Actions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-on-secondary-container">
                      <li>Ensure your Aadhaar is linked to your bank account (NPCI status: Active).</li>
                      <li>Apply directly to matching PSU and MNC vacancies on DiplomaJob.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-error-container text-error flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">warning</span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface">NATS Eligibility Criteria Not Met</h4>
                  <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed text-xs">
                    Under the Apprentices Act, candidates with &gt;1 year experience or prior apprentice contracts are not eligible for government subsidized apprentice quotas. However, you can apply directly to our regular <strong>Full-Time Diploma Engineer Trainee (DET)</strong> vacancies!
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setChecked(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-lg"
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyNats();
                    onClose();
                  }}
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-sm"
                >
                  Browse Openings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
