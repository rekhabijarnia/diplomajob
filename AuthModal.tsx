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
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [fullName, setFullName] = useState('Rahul Shinde');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [board, setBoard] = useState('MSBTE (Maharashtra)');
  const [rollNo, setRollNo] = useState('210089456');
  const [branch, setBranch] = useState('Mechanical Engineering');
  const [companyName, setCompanyName] = useState('Tata Motors Ltd');
  const [cinNumber, setCinNumber] = useState('L28920MH1945PLC004520');
  const [natsEnrolled, setNatsEnrolled] = useState(true);
  const [natsId, setNatsId] = useState('WMH20240981245');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        setFullName(user.displayName || 'Diploma Engineer');
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
          console.error('Error loading user profile:', e);
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

      // Save user profile to Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || fullName,
        photoURL: user.photoURL,
        role,
        phone,
        board,
        rollNo,
        branch,
        companyName: role === 'employer' ? companyName : '',
        natsEnrolled,
        natsEnrollmentNumber: natsEnrolled ? natsId : '',
        lastLoginAt: new Date().toISOString(),
        createdAt: userSnap.exists() ? (userSnap.data()?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      };

      await setDoc(userRef, profileData, { merge: true });

      onLoginSuccess(user.displayName || fullName, role);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Manual Profile Save & Mock Sign-In
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (currentUser) {
        // Update profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email || email,
          displayName: fullName,
          role,
          phone,
          board,
          rollNo,
          branch,
          companyName: role === 'employer' ? companyName : '',
          natsEnrolled,
          natsEnrollmentNumber: natsId,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      onLoginSuccess(role === 'student' ? fullName : companyName, role);
      onClose();
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
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden">
        {/* Modal Top */}
        <div className="p-5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                {currentUser ? 'Polytechnic Dossier & Auth' : 'Candidate & Recruiter Access'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Firebase Authentication & Firestore Data Persistence
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-error/20 border border-error/40 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tab Controls: Student vs Employer */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl mb-3">
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
              <span>Diploma Engineer</span>
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
        </div>

        {/* Google Sign-in Section */}
        <div className="px-5 pb-3">
          {currentUser ? (
            <div className="p-3.5 bg-surface-container rounded-xl border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">
                    {currentUser.displayName || 'Logged In Candidate'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {currentUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-secondary font-bold">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Google Auth Verified
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-2.5 py-1 text-[11px] font-bold text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/40 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm group hover:border-primary"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google Sign-In</span>
            </button>
          )}
        </div>

        <div className="relative flex py-1 items-center px-5">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            {currentUser ? 'Synchronized Profile Details' : 'Or Complete Manual Setup'}
          </span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        <form onSubmit={handleSaveProfile} className="p-5 pt-2 space-y-3 text-xs">
          {role === 'student' ? (
            <>
              <div>
                <label className="block font-bold text-on-surface mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Board Roll / Seat No.</label>
                  <input
                    required
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
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                  />
                </div>
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

              <div>
                <label className="block font-bold text-on-surface mb-1">NATS 16-Digit Enrollment Number</label>
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
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Corporate CIN / GST Number</label>
                <input
                  required
                  type="text"
                  value={cinNumber}
                  onChange={(e) => setCinNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg outline-none focus:border-primary text-on-surface"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Save Profile to Firestore</span>
                  <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
