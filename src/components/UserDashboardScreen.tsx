import React, { useState, useEffect } from 'react';
import { auth, db, collection, query, where, onSnapshot, doc, getDoc, setDoc, User } from '../firebase';
import { Job } from '../data/portalData';

interface UserDashboardProps {
  onNavigate: (screen: any) => void;
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
  onOpenReportFraud: () => void;
  onOpenNatsEligibility: () => void;
  savedJobIds: string[];
  jobs: Job[];
  onToggleSaveJob: (jobId: string) => void;
}

interface ApplicationRecord {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  branch?: string;
  appliedAt: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  percentage?: string;
  natsId?: string;
}

export const UserDashboardScreen: React.FC<UserDashboardProps> = ({
  onNavigate,
  onApplyJob,
  onViewJobDetails,
  onOpenReportFraud,
  onOpenNatsEligibility,
  savedJobIds,
  jobs,
  onToggleSaveJob,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile' | 'resources'>('applications');

  // Candidate Academic Profile
  const [candidateName, setCandidateName] = useState('Rahul Shinde');
  const [candidateEmail, setCandidateEmail] = useState('rahul.shinde.diploma@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [branch, setBranch] = useState('Mechanical Engineering');
  const [board, setBoard] = useState('MSBTE (Maharashtra)');
  const [collegeName, setCollegeName] = useState('Government Polytechnic Pune');
  const [passoutYear, setPassoutYear] = useState('2024');
  const [percentage, setPercentage] = useState('78.4%');
  const [natsId, setNatsId] = useState('WMH20240981245');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Real-time Applications
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'app-sample-1',
      jobTitle: 'Diploma Production Trainee (DET)',
      company: 'Tata Motors Passenger Vehicles',
      branch: 'Mechanical Engineering',
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'shortlisted',
      percentage: '78.4%',
      natsId: 'WMH20240981245',
    },
    {
      id: 'app-sample-2',
      jobTitle: 'Junior Tooling & Die Technician',
      company: 'Bajaj Auto Ltd (Akurdi)',
      branch: 'Automobile / Production',
      appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'under_review',
      percentage: '78.4%',
      natsId: 'WMH20240981245',
    },
    {
      id: 'app-sample-3',
      jobTitle: 'NATS Apprentice - Quality Control',
      company: 'Larsen & Toubro Heavy Engineering',
      branch: 'Mechanical',
      appliedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      status: 'interview_scheduled',
      percentage: '78.4%',
      natsId: 'WMH20240981245',
    },
  ]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.displayName) setCandidateName(user.displayName);
        if (user.email) setCandidateEmail(user.email);

        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setCandidateName(data.name);
            if (data.phone) setPhone(data.phone);
            if (data.branch) setBranch(data.branch);
            if (data.board) setBoard(data.board);
            if (data.college) setCollegeName(data.college);
            if (data.passingYear) setPassoutYear(data.passingYear);
            if (data.percentage) setPercentage(data.percentage);
            if (data.natsId) setNatsId(data.natsId);
          }
        } catch (e) {
          console.warn('Error fetching profile from Firestore:', e);
        }

        // Listen to candidate's own applications
        try {
          const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
          const appUnsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const liveApps: ApplicationRecord[] = [];
              snapshot.forEach((d) => {
                const item = d.data();
                liveApps.push({
                  id: d.id,
                  jobId: item.jobId,
                  jobTitle: item.jobTitle || 'Diploma Trainee',
                  company: item.company || 'Industrial Plant',
                  branch: item.branch,
                  appliedAt: item.appliedAt || new Date().toISOString(),
                  status: item.status || 'submitted',
                  percentage: item.percentage,
                  natsId: item.natsId,
                });
              });
              setApplications(liveApps);
            }
          }, (err) => console.warn('Candidate applications listener error:', err));

          return () => appUnsub();
        } catch (err) {
          console.warn('Applications query failed:', err);
        }
      }
    });

    return () => unsub();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          name: candidateName,
          email: candidateEmail,
          phone,
          branch,
          board,
          college: collegeName,
          passingYear: passoutYear,
          percentage,
          natsId,
          role: 'student',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.error('Failed to save profile to Firestore:', err);
      }
    }

    setIsSavingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  const getStatusBadge = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Application Submitted
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Plant HR Reviewing
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Shortlisted for Plant Drive
          </span>
        );
      case 'interview_scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <span className="material-symbols-outlined text-[14px]">event</span>
            Shopfloor Interview Scheduled
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/25 text-green-300 border border-green-500/40">
            <span className="material-symbols-outlined text-[14px]">celebration</span>
            Selected / Offer Issued
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
            Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Received
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {profileSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-500 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Polytechnic academic dossier saved successfully!
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={candidateName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-primary/30 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg ring-4 ring-primary/20">
                {candidateName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  {candidateName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
                  Diploma Engineer
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  Zero-Fee Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                {candidateEmail} • {branch} ({passoutYear} Batch)
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                  {collegeName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-secondary">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  NATS ID: {natsId || 'Not Linked'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigate('resume-builder')}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              Download Resume
            </button>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold rounded-xl border border-outline-variant/40 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              Explore Drives
            </button>
          </div>
        </div>

        {/* Dashboard Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-outline-variant/30">
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Applied Drives</span>
            <p className="text-2xl font-black text-on-surface mt-1">{applications.length}</p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Shortlisted</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {applications.filter((a) => a.status === 'shortlisted' || a.status === 'selected' || a.status === 'interview_scheduled').length}
            </p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Saved Bookmarks</span>
            <p className="text-2xl font-black text-primary mt-1">{savedJobs.length}</p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">NATS Stipend Status</span>
            <p className="text-sm font-bold text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">payments</span>
              Govt DBT Ready
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-outline-variant/30 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">assignment</span>
          My Applied Jobs ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          Saved Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          Polytechnic Academic Profile
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'resources'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          NATS & Career Tools
        </button>
      </div>

      {/* TAB 1: APPLIED JOBS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">Application History & Real-Time Tracking</h3>
            <span className="text-xs text-on-surface-variant">Live sync with Plant HR portals</span>
          </div>

          {applications.length === 0 ? (
            <div className="bg-surface-container p-12 text-center rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-3">
                work_outline
              </span>
              <h4 className="text-sm font-bold text-on-surface">You haven't applied to any drives yet</h4>
              <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                Explore zero-placement fee polytechnic jobs, apprenticeships, and plant walk-ins.
              </p>
              <button
                onClick={() => onNavigate('find-jobs')}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Browse Polytechnic Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-surface-container hover:bg-surface-container-high transition-all p-5 rounded-2xl border border-outline-variant/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-primary font-black text-lg shrink-0">
                      {app.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{app.jobTitle}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{app.company}</p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-primary">calendar_today</span>
                          Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        {app.branch && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-semibold">
                              {app.branch}
                            </span>
                          </>
                        )}
                        {app.percentage && (
                          <>
                            <span>•</span>
                            <span>Score: {app.percentage}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                    <div>{getStatusBadge(app.status)}</div>
                    <button
                      onClick={() => onNavigate('find-jobs')}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface border border-outline-variant/30"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED JOBS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">Bookmarked Polytechnic Opportunities</h3>
            <span className="text-xs text-on-surface-variant">{savedJobs.length} saved jobs</span>
          </div>

          {savedJobs.length === 0 ? (
            <div className="bg-surface-container p-12 text-center rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-3">
                bookmark_border
              </span>
              <h4 className="text-sm font-bold text-on-surface">No saved jobs yet</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Click the bookmark icon on any job card to save it for later.
              </p>
              <button
                onClick={() => onNavigate('find-jobs')}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Find Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {job.branch}
                        </span>
                        <h4 className="text-sm font-bold text-on-surface mt-0.5">{job.title}</h4>
                        <p className="text-xs text-on-surface-variant">{job.company}</p>
                      </div>
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className="text-primary hover:text-error p-1 transition-colors"
                        title="Remove bookmark"
                      >
                        <span className="material-symbols-outlined text-[20px]">bookmark_remove</span>
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="font-bold text-primary">{job.salary}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewJobDetails(job)}
                      className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
                    >
                      View Notice
                    </button>
                    <button
                      onClick={() => onApplyJob(job)}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACADEMIC PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-lg">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-on-surface">Polytechnic Academic Credentials</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Your profile is directly auto-filled when you apply with 1-Click Quick Apply to industrial plants.
            </p>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">WhatsApp / Calling Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Diploma Branch / Trade</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                  >
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Automobile Engineering">Automobile Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical / Plastic Technology">Chemical / Plastic Technology</option>
                    <option value="Computer Technology / IT">Computer Technology / IT</option>
                    <option value="Mechatronics & Automation">Mechatronics & Automation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">State Technical Examination Board</label>
                  <input
                    type="text"
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    placeholder="e.g. MSBTE, BTEUP, DTE Karnataka, GTU"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Polytechnic College Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Diploma Passing Year</label>
                  <select
                    value={passoutYear}
                    onChange={(e) => setPassoutYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                  >
                    <option value="2025 (Final Sem Appearing)">2025 (Final Sem Appearing)</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Aggregate Diploma Percentage (%)</label>
                  <input
                    type="text"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="e.g. 78.4%"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    NATS 2.0 Student Enrollment Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={natsId}
                      onChange={(e) => setNatsId(e.target.value)}
                      placeholder="e.g. WMH20240981245"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-xs font-semibold focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={onOpenNatsEligibility}
                      className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary text-xs font-bold rounded-xl border border-secondary/40 whitespace-nowrap"
                    >
                      Check Eligibility
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Required for Central Government direct DBT monthly stipend credit.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      Save Dossier
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCES & NATS TOOLS */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">Industrial Resume Builder</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Generate an ATS-ready polytechnic resume highlighting your CNC machining, AutoCAD, 5S, and workshop projects.
              </p>
            </div>
            <button
              onClick={() => onNavigate('resume-builder')}
              className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
            >
              Open Resume Builder
            </button>
          </div>

          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">NATS Stipend Checker</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Verify minimum statutory stipend (₹8,000 to ₹18,500/mo) under the Apprenticeship Act 1961.
              </p>
            </div>
            <button
              onClick={onOpenNatsEligibility}
              className="mt-4 px-4 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-xl"
            >
              Check Stipend Rates
            </button>
          </div>

          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">Report Fake Fee Extortion</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Zero fees policy: If any recruiter demands money for training or interviews, report them instantly.
              </p>
            </div>
            <button
              onClick={onOpenReportFraud}
              className="mt-4 px-4 py-2 bg-error text-white text-xs font-bold rounded-xl"
            >
              File Vigilance Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
