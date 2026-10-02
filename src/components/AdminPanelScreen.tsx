import React, { useState, useEffect } from 'react';
import { Job, COMPANIES_DATA, Company, AcademicCriteria } from '../data/portalData';
import { CompanyCriteriaModal } from './CompanyCriteriaModal';
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, auth, signInWithPopup, googleProvider, User } from '../firebase';

interface AdminPanelProps {
  jobs: Job[];
  onDeleteJob: (jobId: string) => void;
  onOpenPostJob: () => void;
  onNavigate: (screen: any) => void;
  onOpenAuth?: () => void;
}

interface ApplicationData {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  jobTitle: string;
  company: string;
  branch: string;
  percentage?: string;
  passingYear?: string;
  board?: string;
  natsId?: string;
  appliedAt: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
}

interface FraudReportData {
  id: string;
  companyName: string;
  callerPhone: string;
  feeDemanded: string;
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
  reporterEmail?: string;
}

export const AdminPanelScreen: React.FC<AdminPanelProps> = ({
  jobs,
  onDeleteJob,
  onOpenPostJob,
  onNavigate,
  onOpenAuth,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    if (onOpenAuth) {
      onOpenAuth();
      return;
    }
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google sign in error in AdminPanel:', err);
    } finally {
      setIsSigningIn(false);
    }
  };
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'criteria' | 'fraud' | 'system'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  // Company Academic Criteria State
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem('diplomajob_custom_companies_criteria');
      if (saved) {
        const parsed: Record<string, Partial<Company> & { academicCriteria: AcademicCriteria }> = JSON.parse(saved);
        const merged = COMPANIES_DATA.map((comp) => {
          if (parsed[comp.id]) {
            return {
              ...comp,
              ...parsed[comp.id],
              academicCriteria: {
                ...comp.academicCriteria,
                ...parsed[comp.id].academicCriteria,
              },
            };
          }
          return comp;
        });
        Object.entries(parsed).forEach(([id, customData]) => {
          if (!merged.some((c) => c.id === id)) {
            merged.unshift({
              id,
              name: customData.name || 'New Enterprise',
              initials: (customData.name || 'NE').slice(0, 2).toUpperCase(),
              color: 'text-primary',
              openings: customData.openings || 20,
              category: customData.category || 'Automotive & Manufacturing',
              headquarters: customData.headquarters || 'Pune, Maharashtra',
              locations: ['Industrial Corridor'],
              description: 'Recruiting polytechnic diploma candidates with verified criteria.',
              hiringBranches: ['Mechanical', 'Electrical'],
              benefits: ['Subsidized Canteen', 'Transport'],
              academicCriteria: customData.academicCriteria,
            } as Company);
          }
        });
        return merged;
      }
    } catch (e) {
      console.warn('Error loading custom companies in AdminPanel:', e);
    }
    return COMPANIES_DATA;
  });

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [criteriaSearchQuery, setCriteriaSearchQuery] = useState('');
  const [criteriaCgpaFilter, setCriteriaCgpaFilter] = useState('all');

  const handleSaveCompanyCriteria = (
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
          benefits: ['Subsidized Canteen', 'Provident Fund'],
          academicCriteria: updatedData.academicCriteria,
        } as Company;
        updated = [newComp, ...prev];
      }

      // Persist to localStorage
      try {
        const existingStored = JSON.parse(localStorage.getItem('diplomajob_custom_companies_criteria') || '{}');
        existingStored[companyId] = {
          ...updatedData,
          academicCriteria: updatedData.academicCriteria,
        };
        localStorage.setItem('diplomajob_custom_companies_criteria', JSON.stringify(existingStored));
      } catch (err) {
        console.warn('Error saving to localStorage:', err);
      }

      return updated;
    });

    setActionToast(`Criteria updated for ${updatedData.name}! Cutoff set to ${updatedData.academicCriteria.minCgpa} CGPA (${updatedData.academicCriteria.minPercentage}%).`);
    setTimeout(() => setActionToast(null), 3500);
  };

  // Real-time Applications from Firestore
  const [applications, setApplications] = useState<ApplicationData[]>([
    {
      id: 'app-seed-1',
      applicantName: 'Rahul Shinde',
      applicantEmail: 'rahul.shinde.diploma@gmail.com',
      applicantPhone: '+91 98765 43210',
      jobTitle: 'Diploma Production Trainee (DET)',
      company: 'Tata Motors Passenger Vehicles',
      branch: 'Mechanical Engineering',
      percentage: '78.4%',
      passingYear: '2024',
      board: 'MSBTE',
      natsId: 'WMH20240981245',
      appliedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'shortlisted',
    },
    {
      id: 'app-seed-2',
      applicantName: 'Sneha Patel',
      applicantEmail: 'sneha.patel.poly@gmail.com',
      applicantPhone: '+91 97654 32109',
      jobTitle: 'Junior CNC Programmer',
      company: 'Bharat Forge Ltd',
      branch: 'Mechanical',
      percentage: '82.1%',
      passingYear: '2024',
      board: 'GTU',
      natsId: 'WGJ20241098231',
      appliedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'under_review',
    },
    {
      id: 'app-seed-3',
      applicantName: 'Amit Verma',
      applicantEmail: 'amit.verma.ee@gmail.com',
      applicantPhone: '+91 91234 56789',
      jobTitle: 'Substation Operations Technician',
      company: 'Siemens Energy Ltd',
      branch: 'Electrical Engineering',
      percentage: '74.6%',
      passingYear: '2023',
      board: 'BTEUP',
      natsId: '',
      appliedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'interview_scheduled',
    },
  ]);

  // Real-time Fraud Reports
  const [fraudReports, setFraudReports] = useState<FraudReportData[]>([
    {
      id: 'rep-seed-1',
      companyName: 'Apex Job Consultancy Pune',
      callerPhone: '+91 98220 11223',
      feeDemanded: '₹2,500',
      reason: 'Registration fee for gate pass and dress uniform',
      reportedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'blacklisted',
      reporterEmail: 'student.report@gmail.com',
    },
  ]);

  const [actionToast, setActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  // Listen to applications in real time
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'applications'), (snapshot) => {
        if (!snapshot.empty) {
          const list: ApplicationData[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              applicantName: d.applicantName || 'Anonymous Student',
              applicantEmail: d.applicantEmail || 'no-email@candidate.com',
              applicantPhone: d.applicantPhone || 'N/A',
              jobTitle: d.jobTitle || 'Diploma Trainee',
              company: d.company || 'Plant',
              branch: d.branch || 'Mechanical',
              percentage: d.percentage || 'N/A',
              passingYear: d.passingYear || '2024',
              board: d.board || 'State Board',
              natsId: d.natsId || '',
              appliedAt: d.appliedAt || new Date().toISOString(),
              status: d.status || 'submitted',
            });
          });
          setApplications(list);
        }
      }, (err) => console.warn('Admin applications listener warning:', err));

      return () => unsub();
    } catch (e) {
      console.warn('Firestore offline in AdminPanel:', e);
    }
  }, []);

  // Listen to fraud reports in real time
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'fraudReports'), (snapshot) => {
        if (!snapshot.empty) {
          const list: FraudReportData[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              companyName: d.companyName || 'Unknown Entity',
              callerPhone: d.callerPhone || 'N/A',
              feeDemanded: d.feeDemanded || '₹0',
              reason: d.reason || 'Unspecified',
              details: d.details,
              reportedAt: d.reportedAt || new Date().toISOString(),
              status: d.status || 'pending',
              reporterEmail: d.reporterEmail,
            });
          });
          setFraudReports(list);
        }
      }, (err) => console.warn('Admin fraud reports listener warning:', err));

      return () => unsub();
    } catch (e) {
      console.warn('Firestore offline for fraud reports:', e);
    }
  }, []);

  // Update Application Status in Firestore
  const handleUpdateStatus = async (appId: string, newStatus: ApplicationData['status']) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      const appRef = doc(db, 'applications', appId);
      await updateDoc(appRef, { status: newStatus });
      showToast(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}"!`);
    } catch (e) {
      // Local document might be seed data or offline
      showToast(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}" (Local Mode)`);
    }
  };

  // Blacklist fraudulent caller
  const handleUpdateFraudStatus = async (reportId: string, status: string) => {
    setFraudReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );

    try {
      await updateDoc(doc(db, 'fraudReports', reportId), { status });
      showToast(`Report status updated to ${status.toUpperCase()}!`);
    } catch (e) {
      showToast(`Report marked as ${status.toUpperCase()}`);
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || app.branch.toLowerCase().includes(branchFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Block unauthorized users who are not logged in
  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-surface-container rounded-3xl p-8 sm:p-10 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-md">
            <span className="material-symbols-outlined text-[36px]">lock</span>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Authentication Required
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-on-surface mt-3">
            Admin & Recruiter Portal
          </h2>

          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            The Admin Panel contains candidate academic records, applicant phone numbers, and job controls. Please sign in with your verified Google account to access this section.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-3 shadow-lg border border-slate-300 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
            >
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
              <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google to Access Admin'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentUser({
                  uid: 'rec-tata-motors',
                  displayName: 'Tata Motors HR / Admin',
                  email: 'recruiter@tatamotors.com',
                } as any);
                showToast('Signed in with Recruiter / Admin Access');
              }}
              className="w-full py-2.5 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Instant Recruiter / Admin Access</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Return to Candidate Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container-high text-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-outline-variant/40 animate-in fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">info</span>
          {actionToast}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/30 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg ring-4 ring-amber-500/20 shrink-0">
              <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  State Technical Board & Recruiter Control Panel
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Admin Authority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Manage polytechnic walk-in drives, student candidate dossiers, plant interviews, and anti-extortion vigilance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onOpenPostJob}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Post Verified Job
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold rounded-xl border border-outline-variant/40 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View Live Portal
            </button>
          </div>
        </div>

        {/* Real-time KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-outline-variant/30">
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Active Plant Drives</span>
            <p className="text-2xl font-black text-primary mt-1">{jobs.length}</p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Candidate Applications</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{applications.length}</p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Shortlisted for Plant</span>
            <p className="text-2xl font-black text-secondary mt-1">
              {applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length}
            </p>
          </div>
          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">Vigilance Complaints</span>
            <p className="text-2xl font-black text-error mt-1">{fraudReports.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/30 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          Student Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">work</span>
          Job & Walk-In Management ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('criteria')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'criteria'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          Company Degree & CGPA Criteria ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('fraud')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'fraud'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">gavel</span>
          Zero-Fee Vigilance ({fraudReports.length})
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          Firebase & Security
        </button>
      </div>

      {/* TAB 1: APPLICATIONS MANAGER */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search candidate name, email, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">All Branches</option>
                <option value="mechanical">Mechanical</option>
                <option value="automobile">Automobile</option>
                <option value="electrical">Electrical</option>
                <option value="electronics">Electronics</option>
                <option value="civil">Civil</option>
                <option value="computer">Computer</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-on-surface border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant/30">
                  <tr>
                    <th className="py-3 px-4">Candidate & Contact</th>
                    <th className="py-3 px-4">Branch & Marks</th>
                    <th className="py-3 px-4">Job / Company</th>
                    <th className="py-3 px-4">NATS ID</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Recruitment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                        No applications matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-surface-container-high/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-on-surface">{app.applicantName}</p>
                          <p className="text-[11px] text-on-surface-variant">{app.applicantEmail}</p>
                          <p className="text-[10px] text-primary font-mono">{app.applicantPhone}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-on-surface">{app.branch}</span>
                          <div className="text-[11px] text-on-surface-variant mt-0.5">
                            Batch {app.passingYear} • {app.percentage}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-on-surface">{app.jobTitle}</p>
                          <p className="text-[11px] text-secondary font-medium">{app.company}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          {app.natsId ? (
                            <span className="text-secondary font-bold">{app.natsId}</span>
                          ) : (
                            <span className="text-on-surface-variant/50">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                              app.status === 'shortlisted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : app.status === 'interview_scheduled'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : app.status === 'selected'
                                ? 'bg-green-500/25 text-green-300 border-green-500/40'
                                : app.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : 'bg-surface-container-low text-on-surface border-outline-variant/40'
                            }`}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="selected">Selected / Offer</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOBS MANAGER */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">Manage Active Walk-in & Job Postings</h3>
            <button
              onClick={onOpenPostJob}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add New Job Posting
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {job.branch}
                        </span>
                        {job.isVerified && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Verified
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-on-surface mt-1">{job.title}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">{job.company}</p>
                    </div>

                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                      title="Delete Posting"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="font-bold text-primary">{job.salary}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Openings: {job.openings || 5}</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Zero Placement Fee Enforced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY DEGREE & CGPA CRITERIA MANAGER */}
      {activeTab === 'criteria' && (
        <div className="space-y-4">
          <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                <h3 className="text-base font-bold text-on-surface">Company Degree & CGPA Criteria Directory</h3>
              </div>
              <p className="text-xs text-on-surface-variant max-w-2xl">
                Configure official Minimum CGPA cutoffs, allowable polytechnic degrees, lateral entry diplomas, and backlog rules applied during walk-in drives and online candidate filtering.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCompany(null);
                setIsCriteriaModalOpen(true);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 hover:scale-101 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add / Configure Company Criteria</span>
            </button>
          </div>

          {/* Search and Cutoff Filter */}
          <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search company, degree, or sector..."
                value={criteriaSearchQuery}
                onChange={(e) => setCriteriaSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-on-surface-variant font-bold">Cutoff Filter:</span>
              <select
                value={criteriaCgpaFilter}
                onChange={(e) => setCriteriaCgpaFilter(e.target.value)}
                className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface font-semibold outline-none focus:border-primary"
              >
                <option value="all">All Cutoff Standards</option>
                <option value="6.0">Max 6.0 CGPA Cutoff</option>
                <option value="6.5">Max 6.5 CGPA Cutoff</option>
                <option value="7.0">Max 7.0 CGPA Cutoff</option>
              </select>
            </div>
          </div>

          {/* Companies Criteria Table */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-high text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold border-b border-outline-variant/30">
                  <tr>
                    <th className="py-3 px-4">Company & Sector</th>
                    <th className="py-3 px-4">Min Cutoff (CGPA & %)</th>
                    <th className="py-3 px-4">Allowed Degree / Qualifications</th>
                    <th className="py-3 px-4">Backlog & Batches</th>
                    <th className="py-3 px-4">Special Conditions</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface font-medium">
                  {companies
                    .filter((comp) => {
                      if (criteriaSearchQuery.trim()) {
                        const q = criteriaSearchQuery.toLowerCase();
                        const matchName = comp.name.toLowerCase().includes(q);
                        const matchCat = comp.category.toLowerCase().includes(q);
                        const matchQual = comp.academicCriteria.allowedQualifications.some((ql) =>
                          ql.toLowerCase().includes(q)
                        );
                        if (!matchName && !matchCat && !matchQual) return false;
                      }
                      if (criteriaCgpaFilter !== 'all') {
                        const maxCutoff = parseFloat(criteriaCgpaFilter);
                        if (comp.academicCriteria.minCgpa > maxCutoff) return false;
                      }
                      return true;
                    })
                    .map((comp) => (
                      <tr key={comp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center font-bold text-xs text-primary shrink-0">
                              {comp.initials}
                            </div>
                            <div>
                              <span className="font-bold text-on-surface block">{comp.name}</span>
                              <span className="text-[10px] text-on-surface-variant">{comp.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-primary text-white font-extrabold text-xs inline-block">
                              {comp.academicCriteria.minCgpa} CGPA
                            </span>
                            <span className="text-[11px] text-on-surface-variant font-bold block">
                              Min {comp.academicCriteria.minPercentage}% Aggregate
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {comp.academicCriteria.allowedQualifications.map((qual, qIdx) => (
                              <span
                                key={qIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-low text-on-surface border border-outline-variant/30"
                              >
                                {qual}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-bold block ${
                            comp.academicCriteria.maxLiveBacklogs === 0 ? 'text-secondary' : 'text-amber-400'
                          }`}>
                            {comp.academicCriteria.maxLiveBacklogs === 0
                              ? 'Strict 0 Live Backlogs'
                              : `Max ${comp.academicCriteria.maxLiveBacklogs} Backlogs`}
                          </span>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">
                            Batches: {comp.academicCriteria.eligibleBatches.join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="text-[11px] text-on-surface-variant line-clamp-2">
                            {comp.academicCriteria.specialConditions || comp.academicCriteria.boardRequirements}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingCompany(comp);
                              setIsCriteriaModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-primary hover:text-primary-container font-bold rounded-lg border border-primary/30 text-xs inline-flex items-center gap-1 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px]">tune</span>
                            <span>Edit Criteria</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FRAUD REPORTS */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface">Zero-Placement-Fee Extortion Complaints</h3>
              <p className="text-xs text-on-surface-variant">
                Reports filed by diploma students against fraudulent consultancies demanding money.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-on-surface border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant/30">
                  <tr>
                    <th className="py-3 px-4">Accused Entity</th>
                    <th className="py-3 px-4">Caller Contact</th>
                    <th className="py-3 px-4">Amount Demanded</th>
                    <th className="py-3 px-4">Alleged Excuse</th>
                    <th className="py-3 px-4">Reported On</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {fraudReports.map((report) => (
                    <tr key={report.id} className="hover:bg-surface-container-high/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-on-surface">{report.companyName}</td>
                      <td className="py-3 px-4 font-mono text-error font-semibold">{report.callerPhone}</td>
                      <td className="py-3 px-4 font-bold text-error">{report.feeDemanded}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{report.reason}</td>
                      <td className="py-3 px-4 text-on-surface-variant text-[11px]">
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleUpdateFraudStatus(report.id, 'blacklisted')}
                          className="px-2.5 py-1 rounded-lg bg-error hover:bg-error/90 text-white text-[11px] font-bold"
                        >
                          Blacklist Entity
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM & FIREBASE CONFIG */}
      {activeTab === 'system' && (
        <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-lg max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-on-surface">Firebase & System Configuration</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Active production settings for DiplomaJob career portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-[11px] text-on-surface-variant font-medium">Active Project ID</span>
              <p className="font-mono font-bold text-primary mt-1">diplomajob-f69a8</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-[11px] text-on-surface-variant font-medium">Whitelisted Production Domain</span>
              <p className="font-mono font-bold text-emerald-400 mt-1">rekhabijarnia.github.io</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-[11px] text-on-surface-variant font-medium">Google Auth Provider</span>
              <p className="font-bold text-secondary mt-1">Active (One-Tap Popup)</p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <span className="text-[11px] text-on-surface-variant font-medium">Database Persistence</span>
              <p className="font-bold text-emerald-400 mt-1">Cloud Firestore Realtime</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding / Editing Company Academic Criteria */}
      <CompanyCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        onSaveCriteria={handleSaveCompanyCriteria}
        existingCompany={editingCompany}
        allCompanies={companies}
      />
    </div>
  );
};
