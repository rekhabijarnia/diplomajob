import React, { useState } from 'react';

export const ResumeBuilderScreen: React.FC = () => {
  const [fullName, setFullName] = useState('Rahul Shinde');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rahul.shinde.diploma@gmail.com');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [board, setBoard] = useState('MSBTE (Maharashtra State Board of Technical Education)');
  const [college, setCollege] = useState('Government Polytechnic, Pune');
  const [branch, setBranch] = useState('Diploma in Mechanical Engineering');
  const [rollNo, setRollNo] = useState('210089456');
  const [aggregateMarks, setAggregateMarks] = useState('78.4%');
  const [passoutYear, setPassoutYear] = useState('2024');

  // Mandatory 6-Week Summer Industrial Training
  const [trainingCompany, setTrainingCompany] = useState('Bharat Forge Limited, Mundhwa');
  const [trainingDuration, setTrainingDuration] = useState('6 Weeks (June - July 2023)');
  const [trainingRole, setTrainingRole] = useState('Trainee - Heavy Hydraulic Forging Division');
  const [trainingSummary, setTrainingSummary] = useState(
    'Observed operation of 4,000-ton hydraulic press. Assisted in pyrometer temperature readings and visual crack inspection on crankshaft forgings.'
  );

  // Final Year Capstone Project
  const [projectTitle, setProjectTitle] = useState('Design & Fabrication of Pneumatic Can Crusher');
  const [projectDescription, setProjectDescription] = useState(
    'Fabricated a pneumatic cylinder driven scrap metal compaction mechanism. Utilized 5/2 hand lever DC valve with 8 bar compressor pressure, reducing scrap volume by 65%.'
  );

  // Key Technical Skills
  const [technicalSkills, setTechnicalSkills] = useState(
    'AutoCAD 2D/3D, SolidWorks Basics, CNC Milling G-Codes, GD&T Tolerances, 5S & Kaizen, Vernier Caliper & Micrometer Metrology, Pneumatic Schematics'
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">description</span>
            Tailored for MSBTE, BTEUP & Polytechnic Freshers
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
            Polytechnic ATS Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">
            Designed specifically for diploma engineers with dedicated sections for your 6-week summer plant training, capstone fabrication project, and workshop tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className="md:hidden px-4 py-2 bg-surface-container text-on-surface font-bold text-xs rounded-xl"
          >
            {activeTab === 'editor' ? 'Show Live Preview' : 'Edit Details'}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Form Editor */}
        <div
          className={`lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 space-y-5 text-xs ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
            Student Personal & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">WhatsApp Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Current City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pt-3 border-t border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[20px]">school</span>
            Diploma Education & Board Info
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Polytechnic Institute Name</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Diploma Branch / Stream</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-on-surface mb-1">Seat / Roll No</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Aggregate %</label>
                <input
                  type="text"
                  value={aggregateMarks}
                  onChange={(e) => setAggregateMarks(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Passout Year</label>
                <input
                  type="text"
                  value={passoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pt-3 border-t border-surface-container">
            <span className="material-symbols-outlined text-tertiary text-[20px]">precision_manufacturing</span>
            6-Week Summer Industrial In-Plant Training
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-on-surface mb-1">Plant / Company Name</label>
                <input
                  type="text"
                  value={trainingCompany}
                  onChange={(e) => setTrainingCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Duration & Dates</label>
                <input
                  type="text"
                  value={trainingDuration}
                  onChange={(e) => setTrainingDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Training Duties & Learnings</label>
              <textarea
                rows={2}
                value={trainingSummary}
                onChange={(e) => setTrainingSummary(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pt-3 border-t border-surface-container">
            <span className="material-symbols-outlined text-primary text-[20px]">build_circle</span>
            Final Year Capstone Project
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-on-surface mb-1">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Technical Summary</label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          <h2 className="text-base font-bold text-on-surface flex items-center gap-2 pt-3 border-t border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[20px]">construction</span>
            Workshop Tools & Software Skills
          </h2>

          <div>
            <textarea
              rows={2}
              value={technicalSkills}
              onChange={(e) => setTechnicalSkills(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] text-on-surface-variant mt-1">
              Tip: Include metrology tools (Vernier, Micrometer), CAD software, and safety protocols (5S).
            </p>
          </div>
        </div>

        {/* Right: Live A4 Visual Preview */}
        <div
          className={`lg:col-span-6 bg-white text-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 print:m-0 print:p-0 print:border-none print:shadow-none ${
            activeTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Resume Header */}
          <div className="border-b-2 border-primary pb-4 mb-4">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight uppercase">
              {fullName}
            </h1>
            <p className="text-xs font-bold text-gray-700 mt-0.5">{branch}</p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 mt-2">
              <span>{phone}</span>
              <span>•</span>
              <span>{email}</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>

          {/* Education */}
          <div className="mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">
              Polytechnic Diploma Education
            </h2>
            <div className="flex justify-between items-start text-xs">
              <div>
                <p className="font-bold text-gray-900">{college}</p>
                <p className="text-[11px] text-gray-600">{board}</p>
                <p className="text-[11px] text-gray-600">Roll/Seat No: {rollNo}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary text-xs">Aggregate: {aggregateMarks}</p>
                <p className="text-[11px] text-gray-500">Passing: {passoutYear}</p>
              </div>
            </div>
          </div>

          {/* Industrial Training */}
          <div className="mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">
              6-Week Mandatory Summer In-Plant Training
            </h2>
            <div className="text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900">{trainingCompany}</span>
                <span className="text-[11px] text-gray-500">{trainingDuration}</span>
              </div>
              <p className="text-[11px] font-semibold text-gray-700">{trainingRole}</p>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-1">{trainingSummary}</p>
            </div>
          </div>

          {/* Capstone Project */}
          <div className="mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">
              Final Year Capstone Project
            </h2>
            <div className="text-xs">
              <p className="font-bold text-gray-900">{projectTitle}</p>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-1">{projectDescription}</p>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-2">
              Technical & Workshop Competencies
            </h2>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {technicalSkills.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-medium border border-gray-200"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Declaration */}
          <div className="pt-3 border-t border-gray-200 text-[10px] text-gray-500">
            <p>
              I hereby declare that the details provided above, including my board marks and roll number, are true and authentic.
            </p>
            <div className="flex justify-between items-center mt-2 font-bold text-gray-700">
              <span>{fullName}</span>
              <span>Place: {location.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
