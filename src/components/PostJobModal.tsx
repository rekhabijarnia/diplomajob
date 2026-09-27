import React, { useState, useEffect } from 'react';
import { Job } from '../data/portalData';
import { auth, db, collection, addDoc, googleProvider, signInWithPopup, User } from '../firebase';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Tata Motors Ltd');
  const [location, setLocation] = useState('Chakan MIDC, Pune');
  const [salary, setSalary] = useState('₹3.20 LPA + Canteen');
  const [branch, setBranch] = useState('Diploma Mechanical / Production');
  const [experience, setExperience] = useState('Fresher (2024 / 2025)');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('AutoCAD, 5S, Torque Tools, Vernier Caliper');
  const [type, setType] = useState<'job' | 'internship' | 'apprentice'>('job');
  const [agreedZeroFee, setAgreedZeroFee] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setCurrentUser(res.user);
      }
    } catch (e) {
      console.warn('Google sign-in error in PostJobModal:', e);
    } finally {
      setGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedZeroFee) return;

    setSubmitting(true);
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title,
      company,
      companyInitials: company.slice(0, 2).toUpperCase(),
      companyColor: 'text-primary',
      location,
      industrialBelt: location.includes('Pune') ? 'Pune Industrial Belt' : 'Regional MIDC',
      salary,
      salaryNumeric: 320000,
      experience,
      branch,
      branchSlug: branch.toLowerCase().includes('mech')
        ? 'mech'
        : branch.toLowerCase().includes('civil')
        ? 'civil'
        : 'comp',
      isVerified: true,
      postedAgo: 'Posted just now',
      description: description || 'Supervise production floor, inspect engineering tolerances, and log shift operations.',
      type,
      perks: ['Subsidized Canteen', 'Bus Facility', 'Health Cover'],
      skills: skills.split(',').map((s) => s.trim()),
      responsibilities: [
        'Inspect manufactured parts according to engineering drawing specifications.',
        'Coordinate with shopfloor machine operators for timely cycle execution.',
        'Maintain 5S and safety adherence during all work shifts.'
      ],
      minPercentage: 60,
      openings: 10
    };

    try {
      // Persist to Firestore
      await addDoc(collection(db, 'postedJobs'), {
        ...newJob,
        postedBy: auth.currentUser?.uid || 'recruiter',
        recruiterEmail: auth.currentUser?.email || 'recruiter@company.com',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Firestore error saving job:', err);
    } finally {
      onJobCreated(newJob);
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Post a Verified Polytechnic Opening</h3>
            <p className="text-xs text-white/80">
              Direct connection to 120,000+ diploma engineers (Persisted in Firestore)
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Recruiter Google Authentication Status */}
          {currentUser ? (
            <div className="p-3 bg-surface-container rounded-xl border border-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Recruiter'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {(currentUser.displayName || currentUser.email || 'R')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-on-surface truncate">{currentUser.displayName || 'Plant Recruiter'}</p>
                  <p className="text-[10px] text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Posting as Verified Google Recruiter ({currentUser.email})
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-secondary/20 text-secondary font-bold px-2 py-0.5 rounded shrink-0">
                Authorized
              </span>
            </div>
          ) : (
            <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-on-surface">Recruiter Verification</span>
                  <span className="block text-[10px] text-on-surface-variant truncate">Sign in with Google to post job openings</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5"
              >
                {googleLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Sign in with Google</span>
                )}
              </button>
            </div>
          )}
          <div>
            <label className="block font-bold text-on-surface mb-1">Job / Apprenticeship Role Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Diploma Engineer Trainee (DET) - Assembly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Company / Plant Name</label>
              <input
                required
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Plant Location / MIDC</label>
              <input
                required
                type="text"
                placeholder="e.g. Chakan MIDC, Pune"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Opportunity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              >
                <option value="job">Full-Time Job (DET)</option>
                <option value="apprentice">1-Year NATS/BOAT Apprenticeship</option>
                <option value="internship">Polytechnic Internship</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Salary / Monthly Stipend</label>
              <input
                required
                type="text"
                placeholder="e.g. ₹2.80 - ₹3.50 LPA"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Eligible Branch Stream</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              >
                <option value="Diploma Mechanical / Production">Diploma Mechanical / Production</option>
                <option value="Diploma Computer / IT">Diploma Computer / IT</option>
                <option value="Diploma Civil Engineering">Diploma Civil Engineering</option>
                <option value="Diploma Electrical Engineering">Diploma Electrical Engineering</option>
                <option value="Diploma Electronics & TC">Diploma Electronics & TC</option>
                <option value="Diploma Automobile Engineering">Diploma Automobile Engineering</option>
                <option value="Diploma Chemical Engineering">Diploma Chemical Engineering</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Batch / Experience</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">Required Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Explain line duties, shift details, inspection procedures, and training schedule..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface resize-none"
            />
          </div>

          {/* Zero Fee Declaration Checkbox */}
          <div className="p-3 bg-secondary/15 rounded-xl border border-secondary/30 text-on-surface">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                required
                type="checkbox"
                checked={agreedZeroFee}
                onChange={(e) => setAgreedZeroFee(e.target.checked)}
                className="mt-0.5 rounded text-secondary focus:ring-secondary w-4 h-4 shrink-0"
              />
              <span className="text-[11px] leading-tight">
                <strong className="text-secondary">Zero-Fee Compliance Declaration:</strong> I confirm our organization will never ask applicants for registration fees, training fees, uniform deposits, or test fees.
              </span>
            </label>
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
              disabled={!agreedZeroFee || submitting}
              className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Publishing to Firestore...' : 'Publish Verified Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
