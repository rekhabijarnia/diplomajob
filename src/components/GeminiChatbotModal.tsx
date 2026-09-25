import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isOfflineKnowledge?: boolean;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

// Comprehensive Diploma & Polytechnic Knowledge Base Engine for GitHub Pages & Offline
function generateDiplomaKnowledgeResponse(query: string, modelType: string): string {
  const q = query.toLowerCase();

  // 1. Tata Motors & Automotive DET Technical Interview
  if (q.includes('tata') || (q.includes('det') && (q.includes('interview') || q.includes('technical') || q.includes('crack') || q.includes('test')))) {
    return `### 🚗 How to Crack Tata Motors Diploma Engineer Trainee (DET) Technical Interview

Tata Motors selects DETs across Pune, Sanand, Pantnagar, and Jamshedpur manufacturing divisions. The typical compensation package is **₹3.2 LPA – ₹4.5 LPA** plus subsidized canteen, transport, and medical benefits.

#### 1. Selection Process Stages:
* **Stage 1: Online Technical & Aptitude Test** (60–90 mins)
  * Mechanical/Electrical domain core questions (40%)
  * Quantitative aptitude, reasoning, and basic verbal ability (40%)
  * Spatial & diagrammatic reasoning (20%)
* **Stage 2: Technical Interview (Shopfloor & Theory Drill)**
* **Stage 3: HR & Cultural Fitment Discussion**

---

#### 2. Top Technical Questions Asked to Diploma Candidates:
1. **Four-Stroke vs Two-Stroke Cycles:**
   * Explain P-V and T-s diagrams for Otto vs Diesel cycles.
   * Why do heavy commercial vehicles strictly use Diesel (compression ignition) over Petrol?
2. **Steering & Chassis Geometry:**
   * Define **Ackermann steering mechanism**, **Camber angle**, **Caster angle**, and **Toe-in / Toe-out**.
   * What causes uneven tire tread wear on assembly lines?
3. **Transmission & Clutch:**
   * Single-plate vs multi-plate friction clutch differences and why diaphragm springs are preferred.
   * Gear ratios in synchromesh gearboxes and differential gear operation when turning.
4. **Shopfloor Practices & Quality Systems:**
   * **5S Methodology:** *Seiri* (Sort), *Seiton* (Set in order), *Seiso* (Shine), *Seiketsu* (Standardize), *Shitsuke* (Sustain).
   * **Poka-Yoke** (Mistake-proofing) examples on an automotive assembly line.
   * Difference between Quality Assurance (QA) and Quality Control (QC).

---

#### 3. High-Impact Preparation Tips:
* **Know your 6-week summer plant training thoroughly:** Interviewers will ask about the specific machine tools, press tonnage, or paint shop lines you observed.
* **Master your Final Year Capstone Project:** Be prepared to draw schematics, block diagrams, or CAD assembly layouts on paper.
* **Basic GD&T:** Be ready to draw datum symbols, runout, perpendicularity, and true position tolerance frames.`;
  }

  // 2. NATS Apprenticeship vs Regular Job
  if (q.includes('nats') || q.includes('boat') || q.includes('apprentice') || q.includes('16-digit') || q.includes('stipend')) {
    return `### 🏭 NATS 1-Year Apprenticeship vs. Regular Employment for Diploma Engineers

The **National Apprenticeship Training Scheme (NATS 2.0)** is governed by the Ministry of Education (MoE) through Regional Boards of Apprenticeship Training (BOAT Mumbai, Kolkata, Kanpur, Chennai).

| Feature | NATS 1-Year Apprenticeship | Regular / Permanent Job |
| :--- | :--- | :--- |
| **Legal Basis** | Apprentices Act, 1961 | Industrial Disputes Act & State Labor Laws |
| **Duration** | Strictly 12 Months (non-extendable) | Probation (6–12 months) followed by permanent role |
| **Monthly Stipend** | ₹8,000 – ₹14,000/month (Mandatory Direct Benefit Transfer DBT) | ₹18,000 – ₹35,000+ per month CTC |
| **Deductions** | **Zero PF / ESI deductions** (stipend is tax-free training grant) | Standard EPF (12%), ESIC, Professional Tax |
| **Certification** | **Certificate of Proficiency (COP)** from Govt. of India | Work Experience Certificate & Relieving Letter |
| **PSU Eligibility** | **Mandatory requirement** for exams like IOCL, ONGC, SAIL, NPCIL | Accepted for general experienced job posts |

---

#### Key Steps for NATS 2.0 Enrollment:
1. Register on the official portal: **\`nats.education.gov.in\`**.
2. Upload your 10th marksheet, final diploma pass certificate/provisional, and Aadhaar-seeded active bank account.
3. Obtain your unique **16-digit Student Enrollment Number** (e.g., \`WMH... / NUP...\`).
4. Search establishing vacancies (e.g., Tata Motors, BHEL, Larsen & Toubro, Indian Railways workshops) and apply online.

> **💡 Pro Tip:** If you want PSU jobs (Indian Oil, DRDO, ISRO, BEL), doing a 1-year NATS training gives you 5 to 15 bonus marks or makes you directly eligible for Junior Technical Assistant examinations!`;
  }

  // 3. CNC G-codes & M-codes
  if (q.includes('cnc') || q.includes('g02') || q.includes('g03') || q.includes('g-code') || q.includes('m-code') || q.includes('milling') || q.includes('lathe')) {
    return `### ⚙️ CNC Milling: G02 vs G03 Circular Interpolation & Standard G/M Codes

In CNC machining, **G02** and **G03** are preparatory motion commands used to mill circular arcs or helical paths at a controlled cutting feed rate (\`F\`).

---

#### 1. Difference Between G02 and G03:
* **G02 (Clockwise Circular Interpolation - CW):**
  * Cuts an arc in the clockwise direction viewed from the positive Z-axis looking toward the workpiece.
  * *Standard Format (Radius method):*
    \`G02 X50.0 Y30.0 R15.0 F120;\`
  * *Standard Format (Center vector method):*
    \`G02 X50.0 Y30.0 I10.0 J0.0 F120;\`
    *(Where \`I\` and \`J\` are incremental X and Y distances from arc start point to center).*

* **G03 (Counter-Clockwise Circular Interpolation - CCW):**
  * Cuts an arc in the counter-clockwise direction.
  * *Standard Format:*
    \`G03 X30.0 Y50.0 R15.0 F120;\`

---

#### 2. Essential G-Codes Every Diploma Engineer Must Know:
* **\`G00\`**: Rapid transverse positioning (no cutting, max machine speed).
* **\`G01\`**: Linear feed interpolation (straight line cutting with specified \`F\`).
* **\`G28\`**: Automatic return to machine home/reference position.
* **\`G71\`**: Rough turning canned cycle (Fanuc Lathe).
* **\`G72\`**: Facing canned cycle.
* **\`G81\`**: Simple drilling canned cycle (Z feed, rapid retract).
* **\`G90 / G91\`**: Absolute coordinate programming / Incremental coordinate programming.

#### 3. Standard M-Codes (Miscellaneous Functions):
* **\`M03\`**: Spindle rotation clockwise (CW).
* **\`M04\`**: Spindle rotation counter-clockwise (CCW).
* **\`M05\`**: Spindle stop.
* **\`M08\`**: Cutting fluid (coolant) pump ON.
* **\`M09\`**: Cutting fluid pump OFF.
* **\`M30\`**: Program end and reset to top line.`;
  }

  // 4. Summer Training / Internship Report
  if (q.includes('summer') || q.includes('report') || q.includes('training report') || q.includes('plant training') || q.includes('internship report')) {
    return `### 📑 Standard 6-Week Summer Plant Training Report Format (AICTE / MSBTE / BTEUP)

Here is the officially accepted chapter breakdown for polytechnic summer industrial training reports:

---

#### Front Matter:
1. **Title Page** (Project Title, Student Name, Roll No., Branch, College Name & Logo).
2. **Company Certificate** (Original signed copy on company letterhead with supervisor stamp).
3. **Institute Certificate** (Signed by Head of Department and Training & Placement Officer).
4. **Declaration by Student** & **Acknowledgements** (Thanking company mentors, HR, and college faculty).
5. **Table of Contents, List of Figures & List of Tables**.

---

#### Main Chapters:
* **Chapter 1: Company Profile & Plant Layout**
  * History, product lines, global turnover, and ISO certifications (ISO 9001, IATF 16949).
  * Overall plant layout diagram (Raw Material Yard → Machine Shop → Press Shop → Assembly → Testing → Dispatch).
* **Chapter 2: Department Workflow & Manufacturing Processes**
  * Detailed description of departments visited (e.g., Heat Treatment, Quality Assurance, Tool Room, CNC Cell).
* **Chapter 3: Detailed Machinery & Tooling Study**
  * Specifications of major machines studied (e.g., 500-ton Hydraulic Press, VMC 4-Axis CNC, MIG/TIG welding robots).
  * Workholding fixtures, cutting tools (carbide inserts), cutting fluids used.
* **Chapter 4: Industrial Safety, PPE & 5S Implementation**
  * Shopfloor safety norms, Fire extinguisher classes, Hazard identification, Lockout-Tagout (LOTO).
* **Chapter 5: Case Study / Problem Identified & Solution**
  * A specific productivity improvement or cycle time reduction observed (e.g., Kaizen implemented on packaging line).
* **Chapter 6: Conclusion & Skill Learnings**
  * Practical insights gained compared to college textbook theory.
* **References & Appendix**: Plant brochures, equipment manuals, data sheets.`;
  }

  // 5. RRB JE / SSC JE / PSU Government Exams
  if (q.includes('rrb') || q.includes('je') || q.includes('ssc') || q.includes('syllabus') || q.includes('railway') || q.includes('age limit') || q.includes('psu') || q.includes('drdo')) {
    return `### 🚆 RRB Junior Engineer (JE) Recruitment Guide for Diploma Engineers

Railway Recruitment Control Board (RRB) recruits diploma holders directly for Junior Engineer posts (Mechanical, Electrical, Civil, Signal & Telecommunication) under **Pay Level 6 (Basic Pay ₹35,400 + DA + HRA + Transport Allowance ≈ ₹55,000+ Gross)**.

---

#### 1. Eligibility Criteria:
* **Educational Qualification:** 3-Year State Board / AICTE Approved Diploma in Mechanical, Electrical, Civil, Electronics, or CS/IT (or B.Tech degree).
* **Age Limit:** 18 to 33 Years (Relaxation: +3 years for OBC, +5 years for SC/ST, +10 years for PwD).

---

#### 2. Examination Pattern (Two-Stage Computer Based Test):

##### **Stage 1: CBT-1 (Screening Test - 100 Marks / 90 Minutes)**
* Mathematics: **30 Questions** (Algebra, Geometry, Trigonometry, Profit-Loss, Time & Work).
* General Intelligence & Reasoning: **25 Questions** (Analogies, Coding-Decoding, Series).
* General Science (Class 10th Physics, Chemistry, Biology): **30 Questions**.
* General Awareness (Current affairs, Indian Polity, Economy): **15 Questions**.
* *Negative Marking:* 1/3rd mark deducted per wrong answer.

##### **Stage 2: CBT-2 (Merit Selection - 150 Marks / 120 Minutes)**
* General Awareness: **15 Marks**
* Physics & Chemistry: **15 Marks**
* Basics of Computers & Applications: **10 Marks**
* Basics of Environment & Pollution Control: **10 Marks**
* **Technical Engineering Subject Paper: 100 Marks** (Core diploma syllabus of your branch).

---

#### 3. Top PSUs Recruiting Diploma Holders Directly (No GATE Required):
* **DRDO CEPTAM** (Senior Technical Assistant 'B' - STA-B)
* **ISRO** (Technical Assistant)
* **SAIL** (Operator-cum-Technician Trainee - OCTT)
* **IOCL** (Junior Engineering Assistant - JEA)
* **BARC / NPCIL** (Scientific Assistant 'B' / Stipendiary Trainee Cat-1)`;
  }

  // 6. Resume / CV for Freshers
  if (q.includes('resume') || q.includes('cv') || q.includes('fresher') || q.includes('portfolio') || q.includes('bio')) {
    return `### 📄 Resume Checklist for Polytechnic Diploma Freshers

When companies like Tata Motors, Maruti Suzuki, L&T, or Foxconn screen diploma resumes, they look for hands-on technical skills rather than lengthy paragraphs.

---

#### Winning 1-Page Resume Structure:
1. **Header:** Full Name, Diploma Specialization (e.g., *Diploma in Mechanical Engineering - MSBTE*), Mobile Number, Professional Email, LinkedIn / GitHub Profile, Location.
2. **Career Objective (2 lines):** Focused on shopfloor operations, quality assurance, CAD modeling, or site execution.
3. **Education Section:**
   * 3-Year Diploma in Engineering with Aggregate % / CGPA (mention Institute name & Board).
   * 10th Standard (SSC) with School name & Board %.
4. **Core Technical Skills:**
   * *CAD/Software:* AutoCAD, SolidWorks, CATIA, MATLAB, Siemens NX.
   * *Shopfloor Competencies:* CNC programming, 5S, Vernier Caliper & Micrometer inspection, GD&T, PLC ladder logic.
5. **Industrial Training / Internship (Crucial):**
   * Company Name & Duration (e.g., *6 Weeks Summer Training at Larsen & Toubro*).
   * 3 bullet points with metrics (e.g., *Monitored CNC turning cell with 0.02mm tolerance; assisted in quality rejection audits*).
6. **Final Year Capstone Project:**
   * Title, objective, sensors/components used, and practical industry application.
7. **Certifications:** NPTEL, MSME Skill Certification, AutoDesk AutoCAD certification.`;
  }

  // 7. Electrical & Electronics Topics
  if (q.includes('transformer') || q.includes('motor') || q.includes('plc') || q.includes('electrical') || q.includes('power factor') || q.includes('scada')) {
    return `### ⚡ Core Electrical Engineering Fundamentals for Technical Interviews

#### 1. Transformer Operation:
* Operates on **Faraday's Law of Electromagnetic Induction** via mutual induction.
* Transformation Ratio: \`V1 / V2 = N1 / N2 = I2 / I1 = K\`.
* Why is transformer rating in **kVA** instead of kW? Because copper losses depend on Current (\`I\`) and iron/core losses depend on Voltage (\`V\`), independent of load power factor.

#### 2. Induction Motor Formulas:
* Synchronous Speed: \`Ns = (120 * f) / P\` (where \`f\` is frequency in Hz, \`P\` is number of poles).
* Slip: \`s = (Ns - N) / Ns * 100%\`. At standstill, slip \`s = 1\`; at synchronous speed, \`s = 0\`.
* Why Star-Delta Starter is used: To limit initial high starting current (drawn is 1/3rd of Direct-on-Line starter current).

#### 3. Programmable Logic Controllers (PLC):
* **Ladder Logic Basics:**
  * **Normally Open (NO - \`--| |--\`):** Closes when energized.
  * **Normally Closed (NC - \`--|/|--\`):** Opens when energized.
  * **Coil Output (\`--( )--\`):** Powers actuator, relay, or motor contactor.
  * **Timers:** On-Delay Timer (\`TON\`) and Off-Delay Timer (\`TOF\`).`;
  }

  // 8. Civil Engineering Topics
  if (q.includes('concrete') || q.includes('civil') || q.includes('slump') || q.includes('surveying') || q.includes('cement') || q.includes('m20')) {
    return `### 🏗️ Civil Engineering Shopfloor & Site Knowledge for Diploma Engineers

#### 1. Concrete Nominal Mix Ratios:
* **M15:** 1 : 2 : 4 (1 part cement : 2 parts sand/fine aggregate : 4 parts coarse aggregate).
* **M20:** 1 : 1.5 : 3 (Characteristic compressive strength 20 N/mm² at 28 days).
* **M25:** 1 : 1 : 2 (Used for standard reinforced cement concrete beams and columns).

#### 2. Slump Cone Test (Workability of Fresh Concrete):
* Dimensions of Slump Cone: Top diameter = **10 cm**, Bottom diameter = **20 cm**, Height = **30 cm**.
* Tamped in 4 equal layers, **25 strokes per layer** with a 16mm bullet-pointed tamping rod.
* **True Slump:** Desired uniform subsidence.
* **Shear Slump:** Indicates harsh mix lacking cohesion.
* **Collapse Slump:** High water-cement ratio, prone to segregation.

#### 3. Modern Surveying Equipment:
* **Total Station:** Combines electronic theodolite, electronic distance measurement (EDM), and microprocessor to record 3D coordinates (Easting, Northing, Elevation) instantaneously.`;
  }

  // 9. Default / General Engineering Advice
  return `### 🎓 Polytechnic Engineering Guidance

Thank you for your question on **"${query}"**! Here are the core technical principles and career recommendations:

#### Key Takeaways:
1. **Curriculum Alignment:** Ensure your answers conform to standard state technical boards (**MSBTE, BTEUP, DTE Karnataka, GTU, SBTET**).
2. **Shopfloor Practicality:** In technical interviews and exams, always connect theoretical formulas to real industrial equipment (e.g., machine tools, tolerances, safety PPE, 5S standards).
3. **Core Documentation:** For any industrial work, maintain your training logbook, project synopsis, and pass certificates ready with duplicate attested copies.

---
> 💡 *Need specific details on interview questions, G-codes, NATS stipend DBT, RRB JE syllabus, or resume formatting? Select any quick suggestion below or ask away!*`;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [modelType, setModelType] = useState<'general' | 'complex' | 'fast'>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom API key management (stored in localStorage)
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('diploma_gemini_api_key') || '';
  });
  const [keyInputTemp, setKeyInputTemp] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'Namaste! I am your **DiplomaJob AI Mentor & Shopfloor Advisor**.\n\nI specialize in Indian polytechnic curricula (MSBTE, BTEUP, DTE, SBTET, GTU), Diploma Engineer Trainee (DET) recruitment, NATS apprenticeships, factory machine operations (CNC, PLC, hydraulic presses), capstone projects, and PSU junior engineer examinations.\n\nHow can I help power your engineering career today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I crack the Tata Motors DET technical interview?',
    'What is the difference between NATS 1-year training and regular employment?',
    'Explain CNC milling G02 circular interpolation vs G03 with examples.',
    'What is the standard format for a 6-week summer plant training report?',
    'What are the RRB JE syllabus and age limits for diploma engineers?',
  ];

  const handleSaveApiKey = () => {
    const trimmed = keyInputTemp.trim();
    setCustomApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('diploma_gemini_api_key', trimmed);
    } else {
      localStorage.removeItem('diploma_gemini_api_key');
    }
    setShowKeyModal(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    let reply = '';
    let usedModel: string = modelType;
    let isKnowledgeFallback = false;

    try {
      // 1. First attempt: call local/server API endpoint (/api/chat)
      let serverSuccess = false;
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            modelType,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            reply = data.reply;
            usedModel = data.modelUsed || modelType;
            serverSuccess = true;
          }
        }
      } catch {
        serverSuccess = false;
      }

      // 2. Second attempt: If user configured a valid Gemini API Key (e.g. AIzaSy...)
      if (!serverSuccess) {
        const activeKey = customApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;

        if (activeKey && typeof activeKey === 'string' && activeKey.startsWith('AIzaSy')) {
          try {
            const userStartedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
            let foundFirstUser = false;
            for (const m of newHistory) {
              if (m.role === 'user') foundFirstUser = true;
              if (foundFirstUser) {
                userStartedContents.push({
                  role: m.role === 'user' ? 'user' : 'model',
                  parts: [{ text: m.content }],
                });
              }
            }

            const modelEndpoint = modelType === 'complex' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
            const directRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${activeKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: userStartedContents }),
              }
            );

            if (directRes.ok) {
              const data = await directRes.json();
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                reply = text;
                usedModel = modelEndpoint;
                serverSuccess = true;
              }
            }
          } catch {
            serverSuccess = false;
          }
        }
      }

      // 3. Third attempt: Built-in Polytechnic & Shopfloor Knowledge Base (100% Reliable on GitHub Pages)
      if (!serverSuccess || !reply) {
        reply = generateDiplomaKnowledgeResponse(queryText, modelType);
        usedModel = 'Diploma Knowledge Engine (Offline/GitHub Pages)';
        isKnowledgeFallback = true;
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: usedModel,
        isOfflineKnowledge: isKnowledgeFallback,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save conversation log to Firestore asynchronously if online
      try {
        await addDoc(collection(db, 'chatConversations'), {
          userEmail: userEmail || 'anonymous',
          modelType,
          userPrompt: queryText,
          replyPreview: reply.slice(0, 150),
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Continue even if logging fails
      }
    } catch {
      // In case of any unexpected exception, deliver knowledge response without ever breaking UI
      const safeReply = generateDiplomaKnowledgeResponse(queryText, modelType);
      const safeBotMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: safeReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'Diploma Knowledge Engine (Offline Mode)',
        isOfflineKnowledge: true,
      };
      setMessages((prev) => [...prev, safeBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[780px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-4 sm:px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">Polytechnic AI Mentor</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-on-surface-variant truncate max-w-[200px] sm:max-w-none">
                MSBTE • BTEUP • DET technical interview • NATS guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Custom Gemini Key Settings Button */}
            <button
              type="button"
              onClick={() => {
                setKeyInputTemp(customApiKey);
                setShowKeyModal(true);
              }}
              title="Configure Custom Gemini API Key"
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                customApiKey
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">key</span>
              <span className="hidden md:inline text-[11px] font-semibold">
                {customApiKey ? 'API Key Active' : 'API Key'}
              </span>
            </button>

            {/* Model Selector Tabs */}
            <div className="hidden sm:flex items-center bg-surface-container p-0.5 rounded-xl border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setModelType('fast')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  modelType === 'fast'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Fast response"
              >
                ⚡ Fast
              </button>
              <button
                type="button"
                onClick={() => setModelType('general')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  modelType === 'general'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Balanced general reasoning"
              >
                🧠 General
              </button>
              <button
                type="button"
                onClick={() => setModelType('complex')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  modelType === 'complex'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Deep technical reasoning & viva drills"
              >
                🔬 Deep Tech
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* API Key Modal Popup */}
        {showKeyModal && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-2xl border border-outline-variant/40 p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">vpn_key</span>
                  <h4 className="font-bold text-sm text-on-surface">Gemini API Key Settings</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                When deployed on static hosts like <strong>GitHub Pages</strong>, you can paste your free personal Gemini API key to enable live generative AI responses.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5">
                  Google Gemini API Key (starts with <code className="text-primary">AIzaSy...</code>)
                </label>
                <input
                  type="password"
                  value={keyInputTemp}
                  onChange={(e) => setKeyInputTemp(e.target.value)}
                  placeholder="Paste your AIzaSy... key here"
                  className="w-full px-3.5 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-xs text-on-surface outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="text-[11px] bg-primary/10 border border-primary/20 rounded-xl p-3 text-primary-fixed flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
                <span>
                  Don't have a key? Get one in 30 seconds for free at{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-primary hover:text-primary-container"
                  >
                    Google AI Studio (aistudio.google.com)
                  </a>. Keys are stored locally in your browser.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setKeyInputTemp('');
                    setCustomApiKey('');
                    localStorage.removeItem('diploma_gemini_api_key');
                    setShowKeyModal(false);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  Clear Key
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary text-white rounded-br-none shadow-sm'
                      : 'bg-surface-container-low text-on-surface rounded-bl-none border border-outline-variant/30'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2 font-normal">
                    {msg.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        {paragraph.split('**').map((chunk, ci) =>
                          ci % 2 === 1 ? <strong key={ci} className="font-bold text-primary-fixed">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-outline-variant/20 text-[10px] text-on-surface-variant">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span className="opacity-80">
                          • {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-on-surface flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {copiedId === msg.id ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    Me
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-on-surface-variant">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <div className="bg-surface-container-low px-4 py-2.5 rounded-2xl border border-outline-variant/30 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-semibold ml-1">Analyzing shopfloor syllabus & career records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 sm:px-4 py-2 bg-surface-container-low/60 border-t border-outline-variant/20 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors border border-outline-variant/20"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything (e.g. Tata Motors DET, NATS stipend, CNC G02 vs G03, RRB JE syllabus)..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:border-primary placeholder:text-on-surface-variant/60"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

