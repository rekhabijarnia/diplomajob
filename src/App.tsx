/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ScreenType } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { FindJobsScreen } from './components/FindJobsScreen';
import { InternshipsScreen } from './components/InternshipsScreen';
import { ApprenticeshipsScreen } from './components/ApprenticeshipsScreen';
import { CompaniesScreen } from './components/CompaniesScreen';
import { ResumeBuilderScreen } from './components/ResumeBuilderScreen';
import { CareerResourcesScreen } from './components/CareerResourcesScreen';

import { QuickApplyModal } from './components/QuickApplyModal';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ReportFraudModal } from './components/ReportFraudModal';
import { AuthModal } from './components/AuthModal';
import { PostJobModal } from './components/PostJobModal';
import { NotificationsModal } from './components/NotificationsModal';
import { NatsEligibilityModal } from './components/NatsEligibilityModal';

// AI Intelligence & Grounding Modals
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { SearchGroundingModal } from './components/SearchGroundingModal';
import { MapsGroundingModal } from './components/MapsGroundingModal';

import { JOBS_DATA, Job } from './data/portalData';
import { db, collection, onSnapshot, auth } from './firebase';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('');

  // Data State
  const [jobs, setJobs] = useState<Job[]>(JOBS_DATA);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-3']);
  const [activeJobDetails, setActiveJobDetails] = useState<Job | null>(null);
  const [activeApplyJob, setActiveApplyJob] = useState<Job | null>(null);

  // Modals Visibility
  const [isReportFraudOpen, setIsReportFraudOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNatsEligibilityOpen, setIsNatsEligibilityOpen] = useState(false);

  // New AI Modals
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSearchRadarOpen, setIsSearchRadarOpen] = useState(false);
  const [isPlantLocatorOpen, setIsPlantLocatorOpen] = useState(false);

  // User & Portal State
  const [userRole, setUserRole] = useState<'student' | 'employer' | 'admin'>('student');
  const [userName, setUserName] = useState('Rahul Shinde (Diploma CS)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Firestore sync for recruiter jobs
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'postedJobs'), (snapshot) => {
        const firestoreJobs: Job[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          firestoreJobs.push({
            id: docSnap.id,
            title: d.title || 'Diploma Trainee',
            company: d.company || 'Engineering Plant',
            companyInitials: (d.company || 'EP').slice(0, 2).toUpperCase(),
            companyColor: 'text-primary',
            location: d.location || 'MIDC Industrial Estate',
            industrialBelt: d.industrialBelt || 'Industrial Hub',
            salary: d.salary || '₹3.00 LPA',
            salaryNumeric: d.salaryNumeric || 300000,
            experience: d.experience || 'Fresher',
            branch: d.branch || 'Mechanical',
            branchSlug: d.branchSlug || 'mech',
            isVerified: true,
            postedAgo: 'Posted recently',
            description: d.description || '',
            type: d.type || 'job',
            perks: d.perks || ['Subsidized Canteen', 'Bus Facility'],
            skills: d.skills || ['Safety 5S', 'Measurement Tools'],
            responsibilities: d.responsibilities || ['Follow engineering SOPs and inspect production parts.'],
            minPercentage: d.minPercentage || 60,
            openings: d.openings || 5,
          });
        });

        if (firestoreJobs.length > 0) {
          // Merge unique jobs
          const existingIds = new Set(firestoreJobs.map((j) => j.id));
          const baseJobs = JOBS_DATA.filter((j) => !existingIds.has(j.id));
          setJobs([...firestoreJobs, ...baseJobs]);
        }
      });

      return () => unsub();
    } catch (e) {
      console.warn('Firestore real-time sync skipped in offline mode:', e);
    }
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Tata Motors Mega Walk-In Drive',
      message: 'Exclusive campus drive for Diploma Mechanical & Auto at Chakan Plant this Saturday 9:00 AM.',
      time: '10m ago',
      type: 'drive' as const,
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'NATS DBT Central Stipend Hike',
      message: 'Ministry of Education increased polytechnic DBT stipend ceiling to ₹18,500/month.',
      time: '2h ago',
      type: 'gov' as const,
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Application Shortlisted: Bosch India',
      message: 'Your profile has been forwarded to the Chakan R&D plant manager for interview scheduling.',
      time: '1d ago',
      type: 'shortlist' as const,
      unread: false,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBranch = (branchSlug: string) => {
    setSelectedBranchFilter(branchSlug);
    setSelectedCompanyFilter('');
    setCurrentScreen('find-jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyFilter(companyId);
    setSelectedBranchFilter('all');
    setCurrentScreen('find-jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveJob = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
      showToast('Job removed from saved bookmarks');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showToast('Job saved to your bookmarks!');
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    showToast(`Verified job "${newJob.title}" posted successfully!`);
    setCurrentScreen('find-jobs');
  };

  const handleApplySuccess = (jobTitle: string, company: string) => {
    showToast(`Applied successfully to ${company} for ${jobTitle}!`);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans antialiased selection:bg-primary-fixed selection:text-primary">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container-high text-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-outline-variant/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenReportFraud={() => setIsReportFraudOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenSearchRadar={() => setIsSearchRadarOpen(true)}
        onOpenPlantLocator={() => setIsPlantLocatorOpen(true)}
        unreadCount={unreadCount}
        userRole={userRole}
        onChangeRole={(newRole) => {
          setUserRole(newRole);
          showToast(`Switched view to ${newRole === 'student' ? 'Student Portal' : newRole === 'employer' ? 'Employer Dashboard' : 'Admin Panel'}`);
        }}
        savedJobsCount={savedJobIds.length}
      />

      {/* Main Screen Content Body */}
      <main className="flex-1 pt-24 sm:pt-28">
        {/* Role Banner if employer or admin */}
        {userRole !== 'student' && (
          <div className="bg-primary/20 border-b border-primary/30 text-on-surface px-4 py-2.5 text-xs font-semibold">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">domain</span>
                <span>Active Mode: <strong>{userRole === 'employer' ? 'Recruiter & Employer Dashboard' : 'State Technical Board / Admin Panel'}</strong></span>
              </span>
              <button
                onClick={() => setUserRole('student')}
                className="text-primary hover:underline font-bold"
              >
                Switch back to Student Mode
              </button>
            </div>
          </div>
        )}

        {/* AI Copilot & Grounding Floating Banner in dark theme */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1">
          <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest p-3 sm:p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
                  <span>Polytechnic AI Career Suite</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 font-bold">
                    Gemini 3.5 & 3.1 Pro
                  </span>
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Shopfloor technical mentor, live official gazette circulars radar, and industrial plant corridor locator.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsChatbotOpen(true)}
                className="flex-1 md:flex-initial px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Ask AI Mentor</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSearchRadarOpen(true)}
                className="flex-1 md:flex-initial px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-blue-400 border border-outline-variant/40 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                <span>Live Circulars</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPlantLocatorOpen(true)}
                className="flex-1 md:flex-initial px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-emerald-400 border border-outline-variant/40 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                <span>Plant Locator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Screen Routing */}
        {currentScreen === 'home' && (
          <HomeScreen
            onSelectBranch={handleSelectBranch}
            onSelectCompany={handleSelectCompany}
            onApplyJob={(job) => setActiveApplyJob(job)}
            onViewJobDetails={(job) => setActiveJobDetails(job)}
            onNavigate={handleNavigate}
            onOpenReportFraud={() => setIsReportFraudOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenNatsEligibility={() => setIsNatsEligibilityOpen(true)}
          />
        )}

        {currentScreen === 'find-jobs' && (
          <FindJobsScreen
            jobs={jobs}
            initialBranch={selectedBranchFilter}
            initialCompany={selectedCompanyFilter}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onApplyJob={(job) => setActiveApplyJob(job)}
            onViewJobDetails={(job) => setActiveJobDetails(job)}
          />
        )}

        {currentScreen === 'internships' && (
          <InternshipsScreen
            onApplyJob={(job) => setActiveApplyJob(job)}
            onViewJobDetails={(job) => setActiveJobDetails(job)}
          />
        )}

        {currentScreen === 'apprenticeships' && (
          <ApprenticeshipsScreen
            onApplyJob={(job) => setActiveApplyJob(job)}
            onViewJobDetails={(job) => setActiveJobDetails(job)}
            onCheckEligibility={() => setIsNatsEligibilityOpen(true)}
          />
        )}

        {currentScreen === 'companies' && (
          <CompaniesScreen
            onSelectCompany={handleSelectCompany}
            onViewCompanyJobs={(companyName) => {
              setSelectedCompanyFilter(companyName);
              setCurrentScreen('find-jobs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'resume-builder' && <ResumeBuilderScreen />}

        {currentScreen === 'career-resources' && <CareerResourcesScreen />}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReportFraud={() => setIsReportFraudOpen(true)}
        onSelectBranch={handleSelectBranch}
      />

      {/* Persistent Floating AI Copilot Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsChatbotOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ring-4 ring-primary/20"
          aria-label="Open AI Mentor"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-primary"></span>
          </div>
          <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
            Polytechnic AI Mentor
          </span>
        </button>
      </div>

      {/* Modals */}
      <QuickApplyModal
        job={activeApplyJob}
        onClose={() => setActiveApplyJob(null)}
        onSuccess={handleApplySuccess}
      />

      <JobDetailsModal
        job={activeJobDetails}
        onClose={() => setActiveJobDetails(null)}
        onApply={(job) => setActiveApplyJob(job)}
        isSaved={activeJobDetails ? savedJobIds.includes(activeJobDetails.id) : false}
        onToggleSave={handleToggleSaveJob}
      />

      <ReportFraudModal
        isOpen={isReportFraudOpen}
        onClose={() => setIsReportFraudOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(name, role) => {
          setUserName(name);
          setUserRole(role);
          showToast(`Welcome, ${name}! Signed in via Firebase.`);
        }}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={handleJobCreated}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, unread: false })));
          showToast('All notifications marked as read.');
        }}
        onSelectAction={(type) => {
          if (type === 'drive' || type === 'shortlist') {
            setCurrentScreen('find-jobs');
          } else if (type === 'gov') {
            setCurrentScreen('apprenticeships');
          }
        }}
      />

      <NatsEligibilityModal
        isOpen={isNatsEligibilityOpen}
        onClose={() => setIsNatsEligibilityOpen(false)}
        onApplyNats={() => setCurrentScreen('apprenticeships')}
      />

      {/* Gemini Chatbot Modal */}
      <GeminiChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        userEmail={auth.currentUser?.email || undefined}
      />

      {/* Search Grounding Modal */}
      <SearchGroundingModal
        isOpen={isSearchRadarOpen}
        onClose={() => setIsSearchRadarOpen(false)}
      />

      {/* Maps Grounding Modal */}
      <MapsGroundingModal
        isOpen={isPlantLocatorOpen}
        onClose={() => setIsPlantLocatorOpen(false)}
      />
    </div>
  );
}
