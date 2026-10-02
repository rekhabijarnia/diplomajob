import React, { useState, useEffect } from 'react';
import { Company, AcademicCriteria } from '../data/portalData';

export interface CompanyCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCriteria: (companyId: string, updatedCompany: Partial<Company> & { academicCriteria: AcademicCriteria }) => void;
  existingCompany?: Company | null;
  allCompanies: Company[];
}

const DEFAULT_QUALIFICATIONS = [
  '3-Year Regular Polytechnic Diploma',
  '2-Year Lateral Entry Diploma (after 12th Sci / ITI)',
  'Lateral Entry B.Tech / B.E.',
  'Dual ITI + Polytechnic Diploma',
  'B.Voc in Industrial Technology / Production',
  'NATS / BOAT Registered Trainees',
];

const DEFAULT_BATCHES = ['2023', '2024', '2025 (Appearing)', '2026'];

export const CompanyCriteriaModal: React.FC<CompanyCriteriaModalProps> = ({
  isOpen,
  onClose,
  onSaveCriteria,
  existingCompany,
  allCompanies,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(existingCompany ? existingCompany.id : 'new');
  const [companyName, setCompanyName] = useState(existingCompany ? existingCompany.name : '');
  const [category, setCategory] = useState(existingCompany ? existingCompany.category : 'Automotive & Manufacturing');
  const [headquarters, setHeadquarters] = useState(existingCompany ? existingCompany.headquarters : 'Pune, Maharashtra');

  // Academic Criteria States
  const [minCgpa, setMinCgpa] = useState<number>(existingCompany ? existingCompany.academicCriteria.minCgpa : 6.5);
  const [minPercentage, setMinPercentage] = useState<number>(existingCompany ? existingCompany.academicCriteria.minPercentage : 60);
  const [allowedQualifications, setAllowedQualifications] = useState<string[]>(
    existingCompany
      ? existingCompany.academicCriteria.allowedQualifications
      : ['3-Year Regular Polytechnic Diploma', 'Lateral Entry B.Tech / B.E.']
  );
  const [customQualInput, setCustomQualInput] = useState('');
  const [maxLiveBacklogs, setMaxLiveBacklogs] = useState<number>(existingCompany ? existingCompany.academicCriteria.maxLiveBacklogs : 0);
  const [eligibleBatches, setEligibleBatches] = useState<string[]>(
    existingCompany ? existingCompany.academicCriteria.eligibleBatches : ['2024', '2025 (Appearing)']
  );
  const [customBatchInput, setCustomBatchInput] = useState('');
  const [boardRequirements, setBoardRequirements] = useState<string>(
    existingCompany
      ? existingCompany.academicCriteria.boardRequirements
      : 'AICTE / State Technical Board (MSBTE, BTEUP, DTE, GTU) Regular Full-time'
  );
  const [specialConditions, setSpecialConditions] = useState<string>(
    existingCompany?.academicCriteria.specialConditions || 'Minimum 60% in 10th (SSC) & Diploma aggregate across all semesters'
  );

  // Sync when existingCompany changes
  useEffect(() => {
    if (existingCompany) {
      setSelectedCompanyId(existingCompany.id);
      setCompanyName(existingCompany.name);
      setCategory(existingCompany.category);
      setHeadquarters(existingCompany.headquarters);
      setMinCgpa(existingCompany.academicCriteria.minCgpa);
      setMinPercentage(existingCompany.academicCriteria.minPercentage);
      setAllowedQualifications(existingCompany.academicCriteria.allowedQualifications);
      setMaxLiveBacklogs(existingCompany.academicCriteria.maxLiveBacklogs);
      setEligibleBatches(existingCompany.academicCriteria.eligibleBatches);
      setBoardRequirements(existingCompany.academicCriteria.boardRequirements);
      setSpecialConditions(existingCompany.academicCriteria.specialConditions || '');
    } else {
      setSelectedCompanyId('new');
      setCompanyName('');
      setCategory('Automotive & Commercial Vehicles');
      setHeadquarters('Pune, Maharashtra');
      setMinCgpa(6.5);
      setMinPercentage(60);
      setAllowedQualifications(['3-Year Regular Polytechnic Diploma', 'Lateral Entry B.Tech / B.E.']);
      setMaxLiveBacklogs(0);
      setEligibleBatches(['2024', '2025 (Appearing)']);
      setBoardRequirements('AICTE / State Technical Board Approved Regular Full-time');
      setSpecialConditions('Minimum 60% aggregate across all semesters; zero live backlogs at joining');
    }
  }, [existingCompany, isOpen]);

  // When user switches company in dropdown (if creating or picking another company)
  const handleSelectCompanyChange = (compId: string) => {
    setSelectedCompanyId(compId);
    if (compId === 'new') {
      setCompanyName('');
      setCategory('Automotive & Manufacturing');
      setMinCgpa(6.5);
      setMinPercentage(60);
      setAllowedQualifications(['3-Year Regular Polytechnic Diploma']);
      setMaxLiveBacklogs(0);
      setEligibleBatches(['2024', '2025']);
    } else {
      const match = allCompanies.find((c) => c.id === compId);
      if (match) {
        setCompanyName(match.name);
        setCategory(match.category);
        setHeadquarters(match.headquarters);
        setMinCgpa(match.academicCriteria.minCgpa);
        setMinPercentage(match.academicCriteria.minPercentage);
        setAllowedQualifications(match.academicCriteria.allowedQualifications);
        setMaxLiveBacklogs(match.academicCriteria.maxLiveBacklogs);
        setEligibleBatches(match.academicCriteria.eligibleBatches);
        setBoardRequirements(match.academicCriteria.boardRequirements);
        setSpecialConditions(match.academicCriteria.specialConditions || '');
      }
    }
  };

  const handleCgpaChange = (cgpaVal: number) => {
    setMinCgpa(cgpaVal);
    // Standard AICTE / MSBTE formula: % = (CGPA * 9.5) or approx (CGPA - 0.5) * 10
    const calcPct = Math.round(cgpaVal * 9.5);
    setMinPercentage(Math.min(100, Math.max(40, calcPct)));
  };

  const toggleQualification = (qual: string) => {
    if (allowedQualifications.includes(qual)) {
      if (allowedQualifications.length > 1) {
        setAllowedQualifications(allowedQualifications.filter((q) => q !== qual));
      }
    } else {
      setAllowedQualifications([...allowedQualifications, qual]);
    }
  };

  const handleAddCustomQual = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customQualInput.trim() && !allowedQualifications.includes(customQualInput.trim())) {
      setAllowedQualifications([...allowedQualifications, customQualInput.trim()]);
      setCustomQualInput('');
    }
  };

  const toggleBatch = (batch: string) => {
    if (eligibleBatches.includes(batch)) {
      if (eligibleBatches.length > 1) {
        setEligibleBatches(eligibleBatches.filter((b) => b !== batch));
      }
    } else {
      setEligibleBatches([...eligibleBatches, batch]);
    }
  };

  const handleAddCustomBatch = () => {
    if (customBatchInput.trim() && !eligibleBatches.includes(customBatchInput.trim())) {
      setEligibleBatches([...eligibleBatches, customBatchInput.trim()]);
      setCustomBatchInput('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCompanyId = selectedCompanyId === 'new' 
      ? companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `comp-${Date.now()}`
      : selectedCompanyId;

    const newAcademicCriteria: AcademicCriteria = {
      minCgpa: Number(minCgpa),
      minPercentage: Number(minPercentage),
      allowedQualifications,
      maxLiveBacklogs: Number(maxLiveBacklogs),
      eligibleBatches,
      boardRequirements,
      specialConditions: specialConditions.trim() || undefined,
    };

    onSaveCriteria(finalCompanyId, {
      id: finalCompanyId,
      name: companyName,
      category,
      headquarters,
      academicCriteria: newAcademicCriteria,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-container text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h3 className="text-base font-bold">
                {existingCompany ? `Edit Academic & Degree Criteria for ${existingCompany.name}` : 'Add Criteria to Company'}
              </h3>
              <p className="text-xs text-white/80">
                Configure CGPA cutoffs, accepted polytechnic diplomas, degree requirements, and backlog policies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-on-surface">
          {/* Company Selection or Creation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <div>
              <label className="block text-[11px] font-bold text-on-surface mb-1">
                Select Company
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => handleSelectCompanyChange(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface font-semibold focus:border-primary outline-none"
              >
                <option value="new">+ Add New Company / Plant</option>
                {allCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.academicCriteria.minCgpa} CGPA cutoff)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface mb-1">
                Company / Enterprise Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Tata Motors Passenger Vehicles"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface font-bold focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface mb-1">
                Industry Sector / Category
              </label>
              <input
                type="text"
                placeholder="e.g. Automotive & Commercial Vehicles"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface mb-1">
                Plant Headquarters
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Section 1: CGPA & Minimum Percentage Cutoff */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-primary/25 space-y-3.5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">grade</span>
                1. Minimum CGPA & Percentage Cutoff
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                Min {minCgpa} CGPA ({minPercentage}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Minimum Candidate CGPA (Scale 10.0)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => handleCgpaChange(parseFloat(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    value={minCgpa}
                    onChange={(e) => handleCgpaChange(parseFloat(e.target.value) || 6.0)}
                    className="w-18 px-2.5 py-1.5 text-center font-extrabold text-sm bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-primary outline-none"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-medium">
                  <span>5.0 (Pass Class)</span>
                  <span>6.0 (Second Class)</span>
                  <span>6.5 (First Class)</span>
                  <span>7.5+ (Distinction)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Equivalent Minimum Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={minPercentage}
                    onChange={(e) => setMinPercentage(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-bold bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface outline-none focus:border-primary"
                  />
                  <span className="text-xs font-bold text-on-surface-variant">%</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Auto-calculated using official AICTE standard conversion: Percentage ≈ CGPA × 9.5
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[10px] font-bold text-on-surface-variant">Quick Cutoff Presets:</span>
              {[
                { label: '5.5 CGPA (52%)', cgpa: 5.5, pct: 52 },
                { label: '6.0 CGPA (57%)', cgpa: 6.0, pct: 57 },
                { label: '6.5 CGPA (60%)', cgpa: 6.5, pct: 60 },
                { label: '6.8 CGPA (65%)', cgpa: 6.8, pct: 65 },
                { label: '7.0 CGPA (67%)', cgpa: 7.0, pct: 67 },
                { label: '7.5 CGPA (72%)', cgpa: 7.5, pct: 72 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setMinCgpa(preset.cgpa);
                    setMinPercentage(preset.pct);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                    minCgpa === preset.cgpa
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Degree & Qualification Requirements */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-secondary/25 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                2. Degree & Qualification Requirements
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant">
                {allowedQualifications.length} selected
              </span>
            </div>

            <div>
              <p className="text-[11px] text-on-surface-variant mb-2">
                Select which educational degrees or polytechnic diploma streams this company accepts for its roles:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_QUALIFICATIONS.map((qual) => {
                  const isSelected = allowedQualifications.includes(qual);
                  return (
                    <button
                      key={qual}
                      type="button"
                      onClick={() => toggleQualification(qual)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-secondary text-white font-bold shadow-xs'
                          : 'bg-surface-container-lowest text-on-surface border border-outline-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isSelected ? 'check' : 'add'}
                      </span>
                      <span>{qual}</span>
                    </button>
                  );
                })}
                {/* Any custom qualification chips */}
                {allowedQualifications
                  .filter((q) => !DEFAULT_QUALIFICATIONS.includes(q))
                  .map((customQual) => (
                    <span
                      key={customQual}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary-fixed text-on-secondary-fixed flex items-center gap-1.5 border border-secondary/40"
                    >
                      <span>{customQual}</span>
                      <button
                        type="button"
                        onClick={() => toggleQualification(customQual)}
                        className="hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Add Custom Qualification */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add other degree requirement (e.g. Diploma Mechatronics, B.Sc Tech)..."
                value={customQualInput}
                onChange={(e) => setCustomQualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomQual(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface text-xs focus:border-secondary outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomQual}
                className="px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add Degree
              </button>
            </div>
          </div>

          {/* Section 3: Live Backlogs & Eligible Batches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Backlog Policy */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
              <label className="block font-bold text-on-surface">
                Backlog Policy
              </label>
              <select
                value={maxLiveBacklogs}
                onChange={(e) => setMaxLiveBacklogs(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface font-semibold focus:border-primary outline-none"
              >
                <option value={0}>Strict 0 Live / Active Backlogs at Joining</option>
                <option value={1}>Allows up to 1 Cleared Backlog</option>
                <option value={2}>Allows up to 2 Backlogs (Subject to clearance)</option>
              </select>
              <p className="text-[10px] text-on-surface-variant">
                Tier-1 automakers and EPC giants strictly enforce 0 live backlogs before onboarding.
              </p>
            </div>

            {/* Passing Batches */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
              <label className="block font-bold text-on-surface">
                Eligible Passing Batches
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_BATCHES.map((batch) => {
                  const isSelected = eligibleBatches.includes(batch);
                  return (
                    <button
                      key={batch}
                      type="button"
                      onClick={() => toggleBatch(batch)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface-container-lowest text-on-surface border border-outline-variant/40'
                      }`}
                    >
                      {batch}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="e.g. 2027"
                  value={customBatchInput}
                  onChange={(e) => setCustomBatchInput(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-surface-container-lowest border border-outline-variant/40 rounded text-on-surface outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomBatch}
                  className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded border border-outline-variant/40"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Technical Board & Special Degree Conditions */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              Technical Board Accreditation & Special Degree Terms
            </span>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                Approved Technical Board(s)
              </label>
              <input
                type="text"
                value={boardRequirements}
                onChange={(e) => setBoardRequirements(e.target.value)}
                placeholder="e.g. AICTE / State Technical Board (MSBTE, BTEUP, DTE, GTU) Regular Full-time"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface text-xs focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                Special Conditions & Degree Notes (e.g. 10th Marks, Gaps, Semesters)
              </label>
              <textarea
                rows={2}
                value={specialConditions}
                onChange={(e) => setSpecialConditions(e.target.value)}
                placeholder="e.g. Minimum 60% in 10th (SSC) & Diploma aggregate across all semesters, no gap greater than 1 year..."
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface text-xs focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-101 active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Company Criteria</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
