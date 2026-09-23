import React from 'react';
import { ScreenType } from './Header';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenReportFraud: () => void;
  onSelectBranch: (branchSlug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenReportFraud,
  onSelectBranch,
}) => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant pt-12 sm:pt-16 pb-8 border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                alt="DiplomaJob Brand Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XQk2nvUCgt9SMz_yfGP9u_XgZhcaTs051AWkxdNRnDHX7_Yhy0UGP_MspYCYaBP6i-eg3R4SkX_TAsyiPrgrjHpFqNoa_krOtAzvWdcdPk4OQFZyetNmT1KxaIBy1soTJKMOd5j3fgChRgLU4B9jHSaaRnf20-qke4aaey0Fk6njBXtL3s47huI6m1oh5hVGQE_6ANyiKagyR_EMzYIkcWUrjCAWMe7ywN2ihA4A7rG42GhrVjun_p3OzL"
              />
              <span className="text-xl font-bold text-primary">DiplomaJob</span>
            </div>
            <p className="text-xs leading-relaxed mb-4 text-on-surface-variant">
              Dedicated mission to connect India's 1.5M+ polytechnic & diploma engineers with verified MSME, Tata, L&T, Ashok Leyland, Bajaj, IT & PSU apprentice positions.
            </p>
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-xs font-bold">AICTE & NATS Compliant Gateway</span>
            </div>
          </div>

          {/* Col 2: Popular Branches */}
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3">Popular Diploma Branches</h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectBranch('computer')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Computer Engineering & IT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('mechanical')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Mechanical Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('civil')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Civil Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('electrical')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Electrical Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('entc')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Electronics & Telecomm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('automobile')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Automobile Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectBranch('chemical')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Chemical Engineering
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Opportunities by State */}
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3">Opportunities by State</h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Maharashtra (Pune, Mumbai, Nashik)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Karnataka (Bengaluru, Hubballi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Tamil Nadu (Chennai, Coimbatore)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Gujarat (Ahmedabad, Vadodara)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-jobs')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Delhi NCR Industrial Belts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Support */}
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3">Trust, Safety & Support</h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('apprenticeships')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Govt Apprenticeship Guidelines (NATS/BOAT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('companies')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Verified Employer Seal Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('career-resources')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Student Helpdesk (+91 Toll-Free Support)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReportFraud}
                  className="text-error hover:text-on-error-container font-semibold transition-colors text-left flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>Scam Alert & Fraud Reporting</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('career-resources')}
                  className="hover:text-primary transition-colors text-left"
                >
                  Terms of Service & Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-on-surface-variant">
            © 2024 DiplomaJob. Made with pride for India's Polytechnic Community | All listings strictly verified.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-secondary font-bold">100% Free for Jobseekers</span>
            <span className="text-outline-variant">•</span>
            <span>MSBTE / DTE Registered Partner Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
