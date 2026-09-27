import React, { useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  User 
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, role: 'student' | 'employer') => void;
  initialRole?: 'student' | 'employer';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialRole = 'student'
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'student' | 'employer'>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [board, setBoard] = useState('MSBTE (Maharashtra)');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('Mechanical Engineering');
  const [companyName, setCompanyName] = useState('');
  const [natsId, setNatsId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        setFullName(user.displayName || 'Diploma Candidate');
        setEmail(user.email || '');
        // Fetch saved profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) setRole(data.role);
            if (data.displayName) setFullName(data.displayName);
            if (data.phone) setPhone(data.phone);
            if (data.board) setBoard(data.board);
            if (data.rollNo) setRollNo(data.rollNo);
            if (data.branch) setBranch(data.branch);
            if (data.companyName) setCompanyName(data.companyName);
            if (data.natsEnrollmentNumber) setNatsId(data.natsEnrollmentNumber);
          }
        } catch (e) {
          console.warn('Could not read user profile from Firestore:', e);
        }
      }
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if profile exists, otherwise create new profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const existingData = userSnap.exists() ? userSnap.data() : {};
      const assignedRole = existingData.role || role;

      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Diploma Engineer',
        photoURL: user.photoURL || '',
        role: assignedRole,
        phone: existingData.phone || phone,
        board: existingData.board || board,
        rollNo: existingData.rollNo || rollNo,
        branch: existingData.branch || branch,
        companyName: assignedRole === 'employer' ? (existingData.companyName || companyName || 'Engineering Partner') : '',
        natsEnrollmentNumber: existingData.natsEnrollmentNumber || natsId,
        lastLoginAt: new Date().toISOString(),
        createdAt: existingData.createdAt || new Date().toISOString(),
      };

      await setDoc(userRef, profileData, { merge: true });

      onLoginSuccess(user.displayName || 'Candidate', assignedRole);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled. Please click "Continue with Google" again.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Please ensure this URL is added in Firebase Console > Authentication > Settings > Authorized Domains.');
      } else {
        setError(err?.message || 'Failed to sign in with Google. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save profile updates to Firestore
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setProfileSaved(false);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        uid: currentUser.uid,
        email: currentUser.email || email,
        displayName: fullName || currentUser.displayName,
        role,
        phone,
        board,
        rollNo,
        branch,
        companyName: role === 'employer' ? companyName : '',
        natsEnrollmentNumber: natsId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setProfileSaved(true);
      onLoginSuccess(role === 'student' ? (fullName || currentUser.displayName || 'Candidate') : (companyName || 'Recruiter'), role);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setProfileSaved(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">
                {currentUser ? 'Your Google Account Profile' : 'Sign in to DiplomaJob'}
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Fast & Secure Google Authentication for Polytechnic Careers
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-error/15 border border-error/30 text-error text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {profileSaved && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span className="font-bold">Profile synchronized successfully with Firestore!</span>
          </div>
        )}

        {!currentUser ? (
          /* NOT LOGGED IN: DIRECT GOOGLE LOGIN EXPERIENCE */
          <div className="p-6 space-y-5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                I am signing in as:
              </label>
              <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    role === 'student'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Diploma Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    role === 'employer'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">factory</span>
                  <span>Plant Recruiter</span>
                </button>
              </div>
            </div>

            {/* Main Google Sign-In Action */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg border border-slate-300 disabled:opacity-50 active:scale-[0.99]"
              >
                {/* Official Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>
                  {loading ? 'Connecting with Google...' : 'Continue with Google'}
                </span>
              </button>

              <p className="text-center text-[11px] text-on-surface-variant leading-relaxed">
                By continuing, your verified Google account will be used to log in securely. Zero passwords to remember.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="p-3.5 bg-surface-container rounded-xl border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>Instant 1-Click Application for 18,500+ jobs</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>Real-time NATS Apprenticeship eligibility sync</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                <span>Saved bookmarks & application status tracking</span>
              </div>
            </div>
          </div>
        ) : (
          /* LOGGED IN: SHOW GOOGLE USER CARD & PROFILE EDIT */
          <div className="p-5 space-y-4">
            {/* User Profile Card */}
            <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">
                    {currentUser.displayName || 'Google User'}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {currentUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-secondary font-bold mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Google Account Verified
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 text-xs font-bold text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors shrink-0 ml-2"
              >
                Sign Out
              </button>
            </div>

            {/* Role Switcher for Logged In User */}
            <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  role === 'student'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>Diploma Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  role === 'employer'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">factory</span>
                <span>Plant Recruiter</span>
              </button>
            </div>

            {/* Polytechnic / Employer Details */}
            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              {role === 'student' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-on-surface mb-1">State Technical Board</label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                      >
                        <option value="MSBTE (Maharashtra)">MSBTE (Maharashtra)</option>
                        <option value="BTEUP (Uttar Pradesh)">BTEUP (Uttar Pradesh)</option>
                        <option value="DTE Karnataka">DTE Karnataka</option>
                        <option value="DOTE Tamil Nadu">DOTE Tamil Nadu</option>
                        <option value="GTU Gujarat">GTU Diploma Gujarat</option>
                        <option value="WBSCTE (West Bengal)">WBSCTE (West Bengal)</option>
                        <option value="SBTET Andhra/Telangana">SBTET Andhra / Telangana</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-on-surface mb-1">Diploma Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                      >
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Computer Engineering & IT">Computer Engineering & IT</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Electronics & TC">Electronics & TC</option>
                        <option value="Automobile Engineering">Automobile Engineering</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-on-surface mb-1">Board Roll / Seat No.</label>
                      <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="e.g. 210089456"
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-on-surface mb-1">WhatsApp Mobile</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-on-surface mb-1">NATS 16-Digit Enrollment Number (Optional)</label>
                    <input
                      type="text"
                      value={natsId}
                      onChange={(e) => setNatsId(e.target.value)}
                      placeholder="e.g. WMH20240981245"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Company / Plant Name</label>
                    <input
                      required
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Tata Motors Ltd / Bosch India"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Recruiter Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Save Polytechnic Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
