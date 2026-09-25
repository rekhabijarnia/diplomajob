import React, { useState, useEffect } from 'react';
import { auth, firebaseSignOut, User } from '../firebase';

export type ScreenType =
  | 'home'
  | 'find-jobs'
  | 'internships'
  | 'apprenticeships'
  | 'companies'
  | 'resume-builder'
  | 'career-resources'
  | 'post-a-job';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenReportFraud: () => void;
  onOpenAuth: () => void;
  onOpenPostJob: () => void;
  onOpenNotifications: () => void;
  onOpenChatbot: () => void;
  onOpenSearchRadar: () => void;
  onOpenPlantLocator: () => void;
  unreadCount: number;
  userRole: 'student' | 'employer' | 'admin';
  onChangeRole: (role: 'student' | 'employer' | 'admin') => void;
  savedJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenReportFraud,
  onOpenAuth,
  onOpenPostJob,
  onOpenNotifications,
  onOpenChatbot,
  onOpenSearchRadar,
  onOpenPlantLocator,
  unreadCount,
  userRole,
  onChangeRole,
  savedJobsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const navLinks: { id: ScreenType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'find-jobs', label: 'Find Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'apprenticeships', label: 'Apprenticeships' },
    { id: 'companies', label: 'Companies' },
    { id: 'resume-builder', label: 'Resume Builder' },
    { id: 'career-resources', label: 'Career Resources' },
  ];

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setProfileDropdownOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-b border-outline-variant/30">
      {/* Top utility ticker strip in Dark Theme */}
      <div className="bg-surface-dim px-4 py-1.5 border-b border-outline-variant/20 hidden sm:flex items-center justify-between text-[11px] text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-secondary font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            MSBTE • BTEUP • DTE • GTU
          </span>
          <span className="hidden md:inline text-on-surface-variant/80">
            Official NATS Apprentice Portals & Zero-Placement-Fee Direct Plant Walk-Ins
          </span>
        </div>

        {/* Real-time Tools Quick Triggers */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenChatbot}
            className="flex items-center gap-1 text-primary hover:text-primary-fixed font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
            <span>AI Mentor Copilot</span>
          </button>
          <span className="text-outline-variant/50">|</span>
          <button
            type="button"
            onClick={onOpenSearchRadar}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">travel_explore</span>
            <span>Live Circulars Radar</span>
          </button>
          <span className="text-outline-variant/50">|</span>
          <button
            type="button"
            onClick={onOpenPlantLocator}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">pin_drop</span>
            <span>Plant Corridor Locator</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="DiplomaJob - Go to Home"
          >
            <img
              alt="DiplomaJob Brand Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XQk2nvUCgt9SMz_yfGP9u_XgZhcaTs051AWkxdNRnDHX7_Yhy0UGP_MspYCYaBP6i-eg3R4SkX_TAsyiPrgrjHpFqNoa_krOtAzvWdcdPk4OQFZyetNmT1KxaIBy1soTJKMOd5j3fgChRgLU4B9jHSaaRnf20-qke4aaey0Fk6njBXtL3s47huI6m1oh5hVGQE_6ANyiKagyR_EMzYIkcWUrjCAWMe7ywN2ihA4A7rG42GhrVjun_p3OzL"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-primary tracking-tight leading-none">
                DiplomaJob
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 hidden sm:inline-block">
                Polytechnic & Diploma Career Portal
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentScreen === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Mentor Button */}
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-bold transition-all hover:scale-102"
            title="Ask AI Mentor viva questions, G-codes, NATS rules"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* Search Radar Button */}
          <button
            onClick={onOpenSearchRadar}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-blue-400 border border-outline-variant/30 transition-colors"
            title="Google Search Grounded Circulars Radar"
          >
            <span className="material-symbols-outlined text-[19px]">travel_explore</span>
          </button>

          {/* Maps Locator Button */}
          <button
            onClick={onOpenPlantLocator}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-emerald-400 border border-outline-variant/30 transition-colors"
            title="Google Maps Grounded Industrial Plant Locator"
          >
            <span className="material-symbols-outlined text-[19px]">pin_drop</span>
          </button>

          {/* Post a Job Button */}
          <button
            onClick={onOpenPostJob}
            className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-bold text-on-surface bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors border border-outline-variant/40"
          >
            Post a Job
          </button>

          {/* Portal Switcher Dropdown */}
          <div className="relative hidden lg:inline-block">
            <select
              value={userRole}
              onChange={(e) => onChangeRole(e.target.value as any)}
              className="text-xs font-semibold bg-surface-container-low text-on-surface hover:text-primary px-2.5 py-1.5 rounded-xl border border-outline-variant/40 outline-none cursor-pointer"
            >
              <option value="student">Student Portal</option>
              <option value="employer">Employer Dashboard</option>
              <option value="admin">Admin Panel</option>
            </select>
          </div>

          {/* Saved Jobs Bookmark */}
          {savedJobsCount > 0 && (
            <button
              onClick={() => onNavigate('find-jobs')}
              className="relative p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors hidden sm:flex items-center"
              title={`${savedJobsCount} Saved Jobs`}
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {savedJobsCount}
              </span>
            </button>
          )}

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1 focus:outline-none rounded-xl p-1 hover:bg-surface-container transition-colors"
              >
                {currentUser.photoURL ? (
                  <img
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40"
                    src={currentUser.photoURL}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary/40">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden 2xl:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-on-surface truncate max-w-[130px]">
                    {currentUser.displayName || 'Candidate'}
                  </span>
                  <span className="text-[10px] text-secondary font-bold">Firebase Auth</span>
                </div>
              </button>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/40 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-outline-variant/30">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {currentUser.displayName || 'Diploma Engineer'}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold border border-secondary/30">
                      Verified Identity
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('resume-builder');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                      My Polytechnic Resume
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">badge</span>
                      Edit Polytechnic Dossier
                    </button>
                    <button
                      onClick={() => {
                        onOpenReportFraud();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      Report Fee Extortion
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error/10 flex items-center gap-2 border-t border-outline-variant/30 mt-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-low border-b border-outline-variant/30 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-outline-variant/20">
            <button
              type="button"
              onClick={() => {
                onOpenChatbot();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-primary/15 text-primary border border-primary/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>AI Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenSearchRadar();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>Live Circulars</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenPlantLocator();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 col-span-2"
            >
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>Industrial Corridor & Plant Locator</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentScreen === link.id
                    ? 'bg-primary text-white font-bold'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
