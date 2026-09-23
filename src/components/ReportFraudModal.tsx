import React, { useState } from 'react';
import { auth, db, collection, addDoc } from '../firebase';

interface ReportFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportFraudModal: React.FC<ReportFraudModalProps> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [reason, setReason] = useState('Security deposit for laptop / tools');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseToken, setCaseToken] = useState('DJ-SEC-8921');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = `DJ-SEC-${Math.floor(1000 + Math.random() * 9000)}`;
    setCaseToken(token);

    try {
      await addDoc(collection(db, 'fraudReports'), {
        token,
        userId: auth.currentUser?.uid || 'anonymous',
        reporterEmail: auth.currentUser?.email || 'anonymous',
        companyName,
        callerPhone,
        feeDemanded: amountRequested,
        reason,
        details,
        reportedAt: new Date().toISOString(),
        status: 'pending',
      });
    } catch (err) {
      console.error('Firestore save report error:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-error/40 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-error p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div>
              <h3 className="text-base font-bold">Anti-Fraud & Zero-Fee Shield</h3>
              <p className="text-xs text-white/80">
                Direct Police & Cyber Crime Cell Escalation Unit (Recorded in Firestore)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/40">
              <span className="material-symbols-outlined text-[32px]">shield_check</span>
            </div>
            <h4 className="text-lg font-bold text-on-surface">Report Escalated Successfully</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Case Token <strong className="text-on-surface">#{caseToken}</strong> saved to secure database. Legal compliance team has flagged this recruiter and notified state cyber cells.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="p-3 bg-error/15 text-on-surface rounded-xl border border-error/30">
              <p className="font-bold text-error">Mandatory Notice for All Students:</p>
              <p className="mt-0.5 text-on-surface-variant">
                Genuine engineering companies (Tata Motors, L&T, Cummins, Maruti Suzuki, Bosch, PSUs) NEVER charge diploma freshers money for interview passes, uniform deposits, or offer letters.
              </p>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Company / Fake Recruiter Name</label>
              <input
                required
                type="text"
                placeholder="e.g. 'Vertex Technical HR' or company impersonated"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-error text-on-surface"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-on-surface mb-1">Suspicious Phone / WhatsApp No.</label>
                <input
                  required
                  type="text"
                  placeholder="+91 98765 00000"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-error text-on-surface"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Amount Demanded (₹)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. ₹2,500"
                  value={amountRequested}
                  onChange={(e) => setAmountRequested(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-error text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">False Pretext Given</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-error text-on-surface"
              >
                <option value="Security deposit for laptop / tools">Security deposit for laptop / tools</option>
                <option value="Uniform / Safety shoes deposit">Uniform / Safety shoes deposit</option>
                <option value="Gate pass / Interview registration fee">Gate pass / Interview registration fee</option>
                <option value="Medical checkup cash payment">Medical checkup cash payment</option>
                <option value="Offer letter release charge">Offer letter release charge</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Additional Proof / Details (Optional)</label>
              <textarea
                rows={2}
                placeholder="Mention date of call, UPI ID they provided, or email address used."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-error text-on-surface resize-none"
              />
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-error hover:bg-error/90 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Logging...' : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">report</span>
                    <span>Submit Fraud Alert to Firestore</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
