export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  industrialBelt: string;
  salary: string;
  salaryNumeric: number;
  experience: string;
  branch: string;
  branchSlug: string;
  isVerified: boolean;
  postedAgo: string;
  description: string;
  type: 'job' | 'internship' | 'apprentice';
  natsApproved?: boolean;
  perks: string[];
  skills: string[];
  responsibilities: string[];
  minPercentage: number;
  openings: number;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  icon: string;
  openings: number;
  description: string;
  fresherPackage: string;
  badgeBg: string;
  badgeText: string;
  topSkills: string[];
  popularRoles: string[];
}

export interface Company {
  id: string;
  name: string;
  initials: string;
  color: string;
  openings: number;
  category: string;
  headquarters: string;
  locations: string[];
  description: string;
  hiringBranches: string[];
  benefits: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  college: string;
  branch: string;
  company: string;
  quote: string;
  image: string;
  stars: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'DET Interview' | 'PSU Syllabus' | 'NATS Guide' | 'MSBTE / BTEUP Papers';
  branch: string;
  readsOrDownloads: string;
  description: string;
  dateAdded: string;
}

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    icon: 'settings',
    openings: 5120,
    description: 'CAD/SolidWorks, CNC Milling, QA/QC, Production Line Supervision & Maintenance.',
    fresherPackage: '₹2.4L - ₹4.2L / yr',
    badgeBg: 'bg-primary-fixed',
    badgeText: 'text-on-primary-fixed',
    topSkills: ['AutoCAD', 'SolidWorks', 'CNC G-Code', 'GD&T', '5S & Kaizen', 'Pneumatics'],
    popularRoles: ['Production Supervisor', 'Quality Control Inspector', 'CNC Machine Programmer', 'Assembly Line Trainee']
  },
  {
    id: 'comp',
    name: 'Computer Engineering & IT',
    slug: 'computer',
    icon: 'devices',
    openings: 4210,
    description: 'Frontend Web, React, Python Scripting, Database Admin, Manual/Automation QA & Support.',
    fresherPackage: '₹3.0L - ₹5.2L / yr',
    badgeBg: 'bg-primary-fixed',
    badgeText: 'text-on-primary-fixed',
    topSkills: ['React.js', 'JavaScript / TypeScript', 'Python', 'MySQL', 'Git / GitHub', 'Manual Testing'],
    popularRoles: ['Junior Frontend Developer', 'Technical Support Executive', 'Junior QA Analyst', 'Network Administrator']
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    slug: 'civil',
    icon: 'foundation',
    openings: 2890,
    description: 'Site Supervision, Highrise Construction, Estimation, Surveying, AutoCAD Draftsman.',
    fresherPackage: '₹2.2L - ₹3.8L / yr',
    badgeBg: 'bg-tertiary-fixed',
    badgeText: 'text-on-tertiary-fixed-variant',
    topSkills: ['AutoCAD Civil', 'Total Station Surveying', 'Bar Bending Schedules (BBS)', 'Concrete Slump Testing', 'Site Billing'],
    popularRoles: ['Junior Site Engineer', 'AutoCAD Draftsman', 'Surveyor', 'Quantity Estimation Trainee']
  },
  {
    id: 'elec',
    name: 'Electrical Engineering',
    slug: 'electrical',
    icon: 'bolt',
    openings: 3450,
    description: 'Substation Operations, Control Panels, PLC/SCADA Automation, Transformers & Wiring.',
    fresherPackage: '₹2.5L - ₹4.0L / yr',
    badgeBg: 'bg-secondary-fixed',
    badgeText: 'text-on-secondary-fixed',
    topSkills: ['PLC / SCADA', 'Single Line Diagrams (SLD)', 'Control Panel Wiring', 'Transformer Testing', 'Switchgear'],
    popularRoles: ['Substation Operator', 'Panel Wiring Technician', 'Maintenance Electrician', 'Solar PV Installer']
  },
  {
    id: 'entc',
    name: 'Electronics & TC',
    slug: 'entc',
    icon: 'memory',
    openings: 1980,
    description: 'Embedded Firmware, PCB Layout Soldering, Telecom 5G Towers, IoT Device Assembly.',
    fresherPackage: '₹2.8L - ₹4.5L / yr',
    badgeBg: 'bg-surface-container-highest',
    badgeText: 'text-primary',
    topSkills: ['Embedded C', 'PCB Design (KiCad/Eagle)', 'Microcontrollers (Arduino/STM32)', 'Telecom RF Testing', 'Soldering'],
    popularRoles: ['Junior Firmware Engineer', 'PCB Assembly Inspector', 'Telecom Field Engineer', 'IoT Hardware Trainee']
  },
  {
    id: 'auto',
    name: 'Automobile Engineering',
    slug: 'automobile',
    icon: 'electric_car',
    openings: 1420,
    description: 'EV Battery Pack Line, Chassis Welding, Vehicle Testing, Service Workshop Lead.',
    fresherPackage: '₹2.4L - ₹3.9L / yr',
    badgeBg: 'bg-secondary-fixed/50',
    badgeText: 'text-secondary',
    topSkills: ['EV Powertrain Basics', 'Chassis Alignment', 'Automotive Diagnostics (OBD-II)', 'Welding Standards', 'BMS Testing'],
    popularRoles: ['EV Assembly Technician', 'Workshop Service Advisor', 'Chassis Quality Inspector', 'Battery Pack Tester']
  },
  {
    id: 'chem',
    name: 'Chemical Engineering',
    slug: 'chemical',
    icon: 'science',
    openings: 890,
    description: 'Process Plant Operation, Quality Control Lab Chemist, Industrial Safety & Effluent.',
    fresherPackage: '₹2.6L - ₹4.1L / yr',
    badgeBg: 'bg-tertiary-fixed/60',
    badgeText: 'text-tertiary',
    topSkills: ['Distillation Column Operation', 'Titration & pH Analysis', 'ETP / STP Safety', 'Process Flow Diagrams (PFD)'],
    popularRoles: ['Process Plant Operator', 'QC Lab Chemist', 'Safety Assistant', 'Water Treatment Technician']
  },
  {
    id: 'allied',
    name: 'Allied Polytechnic',
    slug: 'allied',
    icon: 'hub',
    openings: 540,
    description: 'Printing Technology, Metallurgy, Mining Engineering, Textile Plant Operations.',
    fresherPackage: '₹2.2L - ₹3.6L / yr',
    badgeBg: 'bg-surface-container-high',
    badgeText: 'text-on-surface-variant',
    topSkills: ['Offset Printing', 'Heat Treatment & Metallography', 'Textile Spinning QA', 'Mining Safety'],
    popularRoles: ['Press Technician', 'Metallurgical Lab Assistant', 'Spinning Shift Trainee', 'Mine Supervisor']
  }
];

export const JOBS_DATA: Job[] = [
  {
    id: 'job-1',
    title: 'Junior Embedded Firmware Engineer',
    company: 'Bosch India',
    companyInitials: 'B',
    companyColor: 'text-primary',
    location: 'Chakan MIDC, Pune',
    industrialBelt: 'Pune Industrial Belt',
    salary: '₹3.60 LPA',
    salaryNumeric: 360000,
    experience: '0-1 Year Exp',
    branch: 'Diploma E&TC / Electrical',
    branchSlug: 'entc',
    isVerified: true,
    postedAgo: 'Posted 2 hours ago',
    description: 'Assisting R&D engineering leads with micro-controller pin configurations, C++ unit test executions on test benches, and CAN bus signal debugging.',
    type: 'job',
    perks: ['Subsidized Canteen', 'Company Bus Route (Pune/Pimpri)', 'Medical Insurance (₹3 Lakhs)'],
    skills: ['Embedded C', 'CAN Protocol', 'Microcontrollers', 'Oscilloscope'],
    responsibilities: [
      'Flash firmware builds onto target automotive ECU hardware test benches.',
      'Execute automated Python test scripts and document bug tickets in Jira.',
      'Assist senior engineers in CANoe log analysis and pin diagram tracing.'
    ],
    minPercentage: 60,
    openings: 12
  },
  {
    id: 'job-2',
    title: 'Junior Site Engineer - Highrise',
    company: 'Larsen & Toubro Construction',
    companyInitials: 'L&T',
    companyColor: 'text-tertiary',
    location: 'Navi Mumbai, MH',
    industrialBelt: 'Mumbai MMR Infra',
    salary: '₹3.20 LPA + Accommodation',
    salaryNumeric: 320000,
    experience: 'Fresher (2024 Passout)',
    branch: 'Diploma Civil',
    branchSlug: 'civil',
    isVerified: true,
    postedAgo: 'Posted 4 hours ago',
    description: 'Daily rebar inspection, RMC slump tests, contractor team coordination, bar bending schedule verification, and daily work progress ledger update.',
    type: 'job',
    perks: ['Free Bachelor Accommodation', 'Safety Gear Provided', 'Project Completion Bonus'],
    skills: ['AutoCAD Civil', 'Slump Cone Test', 'BBS Checking', 'Leveling Instrument'],
    responsibilities: [
      'Supervise pouring of ready-mix concrete and conduct mandatory cube sampling.',
      'Verify steel reinforcement placement against structural engineering drawings.',
      'Maintain daily muster and worker safety compliance on floor levels.'
    ],
    minPercentage: 65,
    openings: 18
  },
  {
    id: 'job-3',
    title: 'Diploma Graduate Trainee (DGT)',
    company: 'Tata Motors Passenger Vehicles',
    companyInitials: 'TM',
    companyColor: 'text-primary',
    location: 'Pimpri, Pune',
    industrialBelt: 'PCMC Auto Hub',
    salary: '₹2.85 LPA + Canteen',
    salaryNumeric: 285000,
    experience: 'Fresher 0-1 Yr',
    branch: 'Diploma Mechanical / Auto',
    branchSlug: 'mech',
    isVerified: true,
    postedAgo: 'Posted today',
    description: 'Automated assembly line operations, robotic cell monitoring, 5S compliance, torque audit logs, and component zero-defect quality validation.',
    type: 'job',
    natsApproved: true,
    perks: ['Free Canteen Meals', 'Uniform & Safety Shoes', 'Overtime Allowance'],
    skills: ['Torque Wrenches', '5S Audit', 'Pneumatic Tools', 'Assembly Line SOP'],
    responsibilities: [
      'Operate automated torque tightening stations on the Curvv/Nexon EV chassis line.',
      'Perform hourly quality checklists and escalate assembly variance to shift lead.',
      'Participate in Kaizen safety circles and cycle-time reduction initiatives.'
    ],
    minPercentage: 58,
    openings: 35
  },
  {
    id: 'job-4',
    title: 'Frontend Web Developer (Junior)',
    company: 'Infosys Springboard Partner',
    companyInitials: 'INF',
    companyColor: 'text-secondary',
    location: 'Hinjawadi, Pune / Blr',
    industrialBelt: 'Rajiv Gandhi Infotech Park',
    salary: '₹4.20 LPA',
    salaryNumeric: 420000,
    experience: 'Fresh Graduate',
    branch: 'Diploma CS / IT',
    branchSlug: 'comp',
    isVerified: true,
    postedAgo: 'Posted yesterday',
    description: 'Building modular UI components in HTML5, CSS3, Tailwind, and ReactJS. REST API integrations and unit testing with standard modern Git workflows.',
    type: 'job',
    perks: ['Hybrid Work (2 days WFH)', 'Annual Learning Allowance', 'Laptop Provided'],
    skills: ['HTML5 & CSS3', 'JavaScript / TypeScript', 'React', 'Git', 'Tailwind CSS'],
    responsibilities: [
      'Translate Figma wireframes into responsive, mobile-first web components.',
      'Integrate REST APIs and manage client state using modern React hooks.',
      'Participate in daily standups and weekly peer code review sessions.'
    ],
    minPercentage: 65,
    openings: 8
  },
  {
    id: 'job-5',
    title: 'NATS Apprenticeship - Heavy Forging Division',
    company: 'Bharat Forge Limited',
    companyInitials: 'BF',
    companyColor: 'text-primary',
    location: 'Mundhwa, Pune',
    industrialBelt: 'Pune Eastern Industrial Belt',
    salary: '₹16,500 / month (DBT Govt Stipend)',
    salaryNumeric: 198000,
    experience: 'Fresher (2023/2024 Passout)',
    branch: 'Diploma Mechanical / Metallurgy',
    branchSlug: 'mech',
    isVerified: true,
    postedAgo: 'Posted 1 day ago',
    description: '1-year Ministry of Education certified apprenticeship. Experience high-tonnage hydraulic forge presses, heat treatment furnaces, and metallurgical crack testing.',
    type: 'apprentice',
    natsApproved: true,
    perks: ['Govt NATS Certificate', 'Subsidized Transport', 'Free Canteen Breakfast & Lunch'],
    skills: ['Hydraulic Press Operations', 'Pyrometer Reading', 'Visual Inspection', 'Safety SOP'],
    responsibilities: [
      'Assist furnace operators with billet temperature monitoring.',
      'Conduct visual and magnetic particle testing (MPT) on forged crankshafts.',
      'Log daily batch numbers and furnace heat cycle records in the ERP.'
    ],
    minPercentage: 55,
    openings: 40
  },
  {
    id: 'job-6',
    title: 'EV Two-Wheeler Battery Assembly Technician',
    company: 'Bajaj Auto Limited',
    companyInitials: 'BA',
    companyColor: 'text-primary',
    location: 'Waluj MIDC, Chhatrapati Sambhajinagar',
    industrialBelt: 'Waluj Industrial Corridor',
    salary: '₹3.10 LPA',
    salaryNumeric: 310000,
    experience: 'Fresher 0-1 Yr',
    branch: 'Diploma Electrical / Automobile',
    branchSlug: 'elec',
    isVerified: true,
    postedAgo: 'Posted 2 days ago',
    description: 'Chetak EV battery module spot welding, cell impedance testing, wiring harness routing, and high-voltage safety isolation protocol execution.',
    type: 'job',
    perks: ['Free Medical Insurance', 'Plant Transport Facility', 'Annual Festival Bonus'],
    skills: ['Spot Welding', 'Multimeter & Megger', 'High Voltage Safety', 'Wiring Harness'],
    responsibilities: [
      'Assemble lithium-ion cells into battery modules with precision spot welders.',
      'Conduct insulation resistance tests using calibrated megohmmeter testers.',
      'Ensure strict electrostatic discharge (ESD) safe practices in the battery clean room.'
    ],
    minPercentage: 60,
    openings: 24
  },
  {
    id: 'job-7',
    title: 'Diesel Generator Maintenance Trainee',
    company: 'Cummins India',
    companyInitials: 'CU',
    companyColor: 'text-primary',
    location: 'Kothrud, Pune / Phaltan Plant',
    industrialBelt: 'Phaltan Megasite',
    salary: '₹3.35 LPA',
    salaryNumeric: 335000,
    experience: 'Fresher (2024)',
    branch: 'Diploma Mechanical / Electrical',
    branchSlug: 'mech',
    isVerified: true,
    postedAgo: 'Posted 3 days ago',
    description: 'Testing high-horsepower diesel generators, governor setting calibration, fuel injection pump overhauling, and dyno test bench logging.',
    type: 'job',
    perks: ['Uniform & Laundry Service', 'Subsidized Canteen', 'Provident Fund + ESI'],
    skills: ['Engine Overhaul', 'Dynamometer Testing', 'Governor Tuning', 'Fuel Injectors'],
    responsibilities: [
      'Connect engines to water brake dynamometers for endurance test runs.',
      'Record oil pressure, coolant temperature, and smoke emissions at full load.',
      'Replace consumable filters, gaskets, and check injector nozzle spray patterns.'
    ],
    minPercentage: 60,
    openings: 15
  },
  {
    id: 'job-8',
    title: 'Boiler & Steam System Trainee Engineer',
    company: 'Thermax Limited',
    companyInitials: 'TH',
    companyColor: 'text-primary',
    location: 'Bhosari MIDC, Pune',
    industrialBelt: 'PCMC Industrial Area',
    salary: '₹3.40 LPA',
    salaryNumeric: 340000,
    experience: 'Fresher (0-1 Yr)',
    branch: 'Diploma Chemical / Mechanical',
    branchSlug: 'chem',
    isVerified: true,
    postedAgo: 'Posted 3 days ago',
    description: 'Industrial steam boiler commissioning, water softening softener plant analysis, flue gas oxygen analyzer calibration, and boiler refractory audit.',
    type: 'job',
    perks: ['Travel Allowances for Site Visits', 'Full Medical Cover', 'Safety Certified Kit'],
    skills: ['Boiler Operations', 'Water Chemistry pH/TDS', 'Piping & Instrumentation Diagram (P&ID)'],
    responsibilities: [
      'Test feed water hardness and dissolved solids (TDS) levels daily.',
      'Assist senior commissioning engineers during industrial steam trial runs.',
      'Verify boiler safety valves and pressure gauges calibration dates.'
    ],
    minPercentage: 62,
    openings: 10
  },
  {
    id: 'job-9',
    title: 'Polytechnic Summer Technical Internship (45 Days)',
    company: 'Schneider Electric',
    companyInitials: 'SE',
    companyColor: 'text-secondary',
    location: 'Peenya Industrial Area, Bengaluru',
    industrialBelt: 'Bengaluru Core Industrial Corridor',
    salary: '₹14,000 / month Stipend',
    salaryNumeric: 168000,
    experience: 'Final Year Diploma (4th / 6th Sem)',
    branch: 'Diploma Electrical / E&TC',
    branchSlug: 'elec',
    isVerified: true,
    postedAgo: 'Posted 4 hours ago',
    description: 'Practical training on low voltage switchboards, motor control centers (MCC), and EcoStruxure IoT cloud connected circuit breakers.',
    type: 'internship',
    perks: ['Internship Completion Certificate', 'PPO Offer to Top 20%', 'Free Canteen Lunch'],
    skills: ['Circuit Breakers', 'MCC Panels', 'Wiring Diagrams', 'Electrical Safety'],
    responsibilities: [
      'Shadow experienced panel assemblers during high-current busbar bending.',
      'Run continuity and insulation resistance tests on finished motor starter panels.',
      'Present a 10-page final industrial internship project report to plant management.'
    ],
    minPercentage: 65,
    openings: 20
  },
  {
    id: 'job-10',
    title: 'NATS Apprentice - Petrochemical Refinery Operations',
    company: 'Reliance Industries Limited',
    companyInitials: 'RIL',
    companyColor: 'text-primary',
    location: 'Jamnagar, Gujarat / Dahej',
    industrialBelt: 'Jamnagar Petrochemical Complex',
    salary: '₹17,800 / month (Govt Direct DBT)',
    salaryNumeric: 213600,
    experience: 'Fresher (2024 Passout)',
    branch: 'Diploma Chemical / Instrumentation',
    branchSlug: 'chem',
    isVerified: true,
    postedAgo: 'Posted 2 days ago',
    description: 'World-scale oil refinery crude distillation and polypropylene polymer unit apprentice training. Hands-on DCS control room and field transmitter experience.',
    type: 'apprentice',
    natsApproved: true,
    perks: ['Single Room Bachelor Accommodation', 'Free Transport in Complex', '100% Govt DBT Certificate'],
    skills: ['DCS Operations', 'Centrifugal Pumps', 'Heat Exchangers', 'Hazardous Area Safety'],
    responsibilities: [
      'Conduct 2-hourly plant field rounds checking pump mechanical seals and bearing vibration.',
      'Sample hydrocarbon product streams for distillation boiling point laboratory tests.',
      'Execute strictly permits-to-work (PTW) for hot work and confined space entry.'
    ],
    minPercentage: 60,
    openings: 50
  },
  {
    id: 'job-11',
    title: 'Junior Hydraulic Cylinder Assembly Specialist',
    company: 'Wipro Infrastructure Engineering',
    companyInitials: 'WP',
    companyColor: 'text-primary',
    location: 'Sriperumbudur, Chennai',
    industrialBelt: 'Sriperumbudur Auto Hub',
    salary: '₹2.90 LPA',
    salaryNumeric: 290000,
    experience: 'Fresher 0-1 Yr',
    branch: 'Diploma Mechanical / Mechatronics',
    branchSlug: 'mech',
    isVerified: true,
    postedAgo: 'Posted 3 days ago',
    description: 'Precision hydraulic cylinder piston rod assembly, high-pressure oil leak testing, honing machine parameter setup, and seal kit installation.',
    type: 'job',
    perks: ['Subsidized Canteen', 'Free Transport from Kanchipuram/Tambaram', 'Attendance Bonus'],
    skills: ['Hydraulic Schematics', 'Pressure Gauge Reading', 'Micrometer & Vernier Calipers', 'Clean Assembly'],
    responsibilities: [
      'Assemble chrome-plated piston rods into cylinder barrels using hydraulic torque presses.',
      'Pressurize cylinders up to 350 bar to verify zero external and internal bypass leakage.',
      'Inspect bore roughness and surface finish with digital profilometer.'
    ],
    minPercentage: 58,
    openings: 16
  },
  {
    id: 'job-12',
    title: 'Python / Flask Junior Automation Associate',
    company: 'Tech Mahindra Engineering Services',
    companyInitials: 'TM',
    companyColor: 'text-primary',
    location: 'Navi Mumbai / Pune',
    industrialBelt: 'Airoli Mindspace Tech Park',
    salary: '₹3.80 LPA',
    salaryNumeric: 380000,
    experience: 'Fresh Graduate (2024)',
    branch: 'Diploma Computer / IT',
    branchSlug: 'comp',
    isVerified: true,
    postedAgo: 'Posted 1 day ago',
    description: 'Write Python automation scripts for manufacturing telemetry parsing, automated PDF report generation, and database updates for shopfloor dashboards.',
    type: 'job',
    perks: ['Flexible Timings', 'Medical Insurance', 'Skill Certification Reimbursement'],
    skills: ['Python 3', 'Pandas', 'Flask / FastAPI', 'PostgreSQL', 'Linux CLI'],
    responsibilities: [
      'Develop scheduled batch scripts to clean machine vibration CSV log files.',
      'Maintain REST API endpoints that feed real-time factory line data to browser displays.',
      'Fix data anomalies and write unit test cases for core calculations.'
    ],
    minPercentage: 65,
    openings: 10
  }
];

export const COMPANIES_DATA: Company[] = [
  {
    id: 'tata-motors',
    name: 'Tata Motors',
    initials: 'TM',
    color: 'text-primary',
    openings: 142,
    category: 'Automotive & Commercial Vehicles',
    headquarters: 'Mumbai, Maharashtra',
    locations: ['Pimpri (Pune)', 'Sanand (Gujarat)', 'Jamshedpur', 'Pantnagar'],
    description: 'India’s pioneer automaker leading the Electric Vehicle revolution with Nexon EV and Tiago EV. Employs over 8,000 polytechnic diploma engineers across vehicle assembly, chassis lines, and testing.',
    hiringBranches: ['Mechanical', 'Automobile', 'Electrical', 'Electronics & TC'],
    benefits: ['Subsidized Canteen', 'Plant Bus Network', 'Fast-Track Promotion to Junior Engineer', 'Annual Performance Bonus']
  },
  {
    id: 'larsen-toubro',
    name: 'Larsen & Toubro',
    initials: 'L&T',
    color: 'text-tertiary',
    openings: 88,
    category: 'Heavy Infrastructure & EPC',
    headquarters: 'Mumbai, Maharashtra',
    locations: ['Navi Mumbai', 'Chennai', 'Ahmedabad', 'Delhi NCR', 'Bengaluru'],
    description: 'Global engineering and construction conglomerate behind landmark high-speed rail, metro corridors, expressway bridges, and mega smart city projects across India.',
    hiringBranches: ['Civil', 'Mechanical', 'Electrical'],
    benefits: ['Free Site Accommodation', 'Safety First Culture', 'Full Medical Cover', 'Technical Masterclass Training']
  },
  {
    id: 'bharat-forge',
    name: 'Bharat Forge',
    initials: 'BF',
    color: 'text-primary',
    openings: 64,
    category: 'Metallurgy & Precision Forging',
    headquarters: 'Pune, Maharashtra',
    locations: ['Mundhwa (Pune)', 'Baramati', 'Satara', 'Jalgaon'],
    description: 'World’s largest forging company manufacturing critical safety parts for global automotive, aerospace, and defense applications. Highly active NATS apprentice recruiter.',
    hiringBranches: ['Mechanical', 'Metallurgy', 'Production', 'Electrical'],
    benefits: ['Govt NATS Stipend + Plant Incentive', 'Free Canteen Meals', 'Hands-on Heavy Hydraulic Training']
  },
  {
    id: 'bajaj-auto',
    name: 'Bajaj Auto',
    initials: 'BA',
    color: 'text-primary',
    openings: 95,
    category: 'Two & Three Wheeler Automakers',
    headquarters: 'Pune, Maharashtra',
    locations: ['Chakan (Pune)', 'Waluj (Chhatrapati Sambhajinagar)', 'Pantnagar'],
    description: 'Global leader in 2-wheelers and 3-wheelers exported to 79+ countries. Famous for Pulsar, Chetak EV, and world-class automated robotics assembly lines.',
    hiringBranches: ['Mechanical', 'Automobile', 'Electrical', 'Electronics'],
    benefits: ['Modern Clean Room Workplaces', 'Comprehensive Health Plan', 'Plant Bus Network', 'Continuous Skills Growth']
  },
  {
    id: 'mahindra-group',
    name: 'Mahindra Group',
    initials: 'M&M',
    color: 'text-primary',
    openings: 110,
    category: 'Automotive, Farm & Aerospace',
    headquarters: 'Mumbai, Maharashtra',
    locations: ['Chakan (Pune)', 'Nashik', 'Kandivali (Mumbai)', 'Zaheerabad', 'Nagpur'],
    description: 'Leader in robust SUVs (Scorpio-N, XUV700, Thar) and world’s largest tractor manufacturer by volume. Recruits diploma engineers directly for assembly, painting, and test track QA.',
    hiringBranches: ['Automobile', 'Mechanical', 'Agricultural Engg', 'Electrical'],
    benefits: ['On-campus Sports Complex & Canteen', 'Subsidized Vehicle Lease Scheme', 'Overtime Compensation']
  },
  {
    id: 'cummins-india',
    name: 'Cummins India',
    initials: 'CU',
    color: 'text-primary',
    openings: 42,
    category: 'Power Generation & Diesel Engines',
    headquarters: 'Pune, Maharashtra',
    locations: ['Kothrud (Pune)', 'Phaltan Megasite', 'Jamshedpur'],
    description: 'Global power technology leader manufacturing diesel and natural gas engines, generator sets, and emission control solutions for mining, marine, and datacenters.',
    hiringBranches: ['Mechanical', 'Electrical', 'Mechatronics'],
    benefits: ['Best-in-class Workplace Safety', 'Higher Education Sponsorship', 'Equal Opportunity Employer']
  },
  {
    id: 'thermax-limited',
    name: 'Thermax Limited',
    initials: 'TH',
    color: 'text-primary',
    openings: 31,
    category: 'Energy & Environmental Solutions',
    headquarters: 'Pune, Maharashtra',
    locations: ['Bhosari (Pune)', 'Chinchwad', 'Savli (Gujarat)', 'Shirwal'],
    description: 'Providing sustainable energy and environment solutions: industrial boilers, solar thermal systems, absorption chillers, water and wastewater treatment plants.',
    hiringBranches: ['Chemical', 'Mechanical', 'Environmental Engg', 'Instrumentation'],
    benefits: ['Domestic Travel Allowances', 'Subsidized Medical Hospitalization', 'Zero-Harm Safety Protocol']
  },
  {
    id: 'reliance-industries',
    name: 'Reliance Industries',
    initials: 'RIL',
    color: 'text-primary',
    openings: 180,
    category: 'Energy, Petrochemicals & Telecom',
    headquarters: 'Mumbai, Maharashtra',
    locations: ['Jamnagar', 'Dahej', 'Hazira', 'Nagothane', 'Patalganga', 'Navi Mumbai'],
    description: 'Fortune 500 powerhouse operating the world’s largest single-site petroleum refinery complex in Jamnagar and nationwide Jio 5G infrastructure.',
    hiringBranches: ['Chemical', 'Instrumentation', 'Mechanical', 'Electrical', 'E&TC'],
    benefits: ['Township Housing with Recreation Clubs', 'Comprehensive Family Mediclaim', 'World-Class Mega Plant Exposure']
  },
  {
    id: 'wipro-infrastructure',
    name: 'Wipro Infrastructure',
    initials: 'WP',
    color: 'text-primary',
    openings: 53,
    category: 'Precision Hydraulics & Aerospace',
    headquarters: 'Bengaluru, Karnataka',
    locations: ['Peenya (Bengaluru)', 'Sriperumbudur (Chennai)', 'Hindupur'],
    description: 'Independent hydraulic cylinder manufacturer supplying global OEMs like Caterpillar, JCB, Volvo, and John Deere with high-precision motion control components.',
    hiringBranches: ['Mechanical', 'Mechatronics', 'Production'],
    benefits: ['Skill Incentive Allowance', 'Subsidized Transport', 'Provident Fund & Gratuity']
  },
  {
    id: 'bosch-india',
    name: 'Bosch India',
    initials: 'B',
    color: 'text-primary',
    openings: 92,
    category: 'Automotive Tech & Industrial IoT',
    headquarters: 'Bengaluru, Karnataka',
    locations: ['Adugodi (Bengaluru)', 'Chakan (Pune)', 'Naganathapura', 'Jaipur', 'Nashik'],
    description: 'Leading global supplier of automotive mobility solutions, ABS braking sensors, Common Rail Diesel systems, power tools, and industrial drives.',
    hiringBranches: ['Electronics & TC', 'Electrical', 'Computer/IT', 'Mechanical'],
    benefits: ['German Standard Engineering Training', 'Health Insurance', 'Modern Cafeteria', 'Clean Room Labs']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'Akash Gaikwad',
    role: 'DET at Bosch India',
    college: 'Govt Polytechnic Pune',
    branch: 'Mechanical Engineering',
    company: 'Bosch India',
    quote: '“Normal job boards always requested 4-year B.Tech degrees for design roles. DiplomaJob gave me immediate access to Bosch’s Chakan plant apprentice pool. I joined as a DET in 2 weeks!”',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArKuV1aPCGdv4Su6_hjixFgdaMowGaeZ9XiF2wH6JQkn9nK1JsbFDRvqKVR6yhVYWZkOa8J4s9_ndYp_W7YAYU_aJpj9iCeq_L12WmtdPClh0dl_hbYXiJcyunVHqvPrvsQ_rJgOPLKwjSV-Nhkuwq7ODa14gJmgeNXy3ddSpPhpAHE3-XziXcDl6V1J81t-VUjUIN4ffqC3No_RVSotrnColHSLZbTTyiE8DjeiUSELqyFJk63Hl6eg',
    stars: 5
  },
  {
    name: 'Sneha Deshmukh',
    role: 'Junior Site Engg at L&T',
    college: 'VJTI Mumbai',
    branch: 'Civil Engineering',
    company: 'Larsen & Toubro',
    quote: '“The NATS stipend calculator showed me exact payout estimates for Navi Mumbai infrastructure sites. I got selected by L&T Construction right from the portal without paying a single rupee.”',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyyjTpKnl9MnIwiose2vJz_plrgDfgTAVOqy8EqafiHk1P04fArlRB8GFrdct74xowKJyVMM1hP8A0l3hpq0TryFp6lFJkeBeYUWMNqMk-UKUMATEh94l5Dth9fPYLVpa1B9L3YYiMWmX2xXqotFbrIGJJeeLIXMYs8M3Iw8cSZG0kNGX2BtgFDvXEsGL0YsaX9bQE4O_F0bnq5m-uG2DXqVhajhkBFv4V0EVm6VWLQsRoixJl0a_TJw',
    stars: 5
  },
  {
    name: 'Karthik Murthy',
    role: 'Junior UI Dev',
    college: 'Govt Polytechnic Bangalore',
    branch: 'Computer Science',
    company: 'Infosys Springboard Partner',
    quote: '“Completing my 3-year CS diploma from Bengaluru, most IT platforms ignored non-graduates. DiplomaJob had tailored junior React developer roles where practical code tests actually mattered.”',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAfsyfIsC5eoT5fFWwOtReMfhTjMJ5BO-ebPv5sUEtxWRqqIQPzHOVEr63VQaRzr5oj8rl5Y2C_A2AWF4bc6YMywUs-56seHyO3CEKPYCNtzRGVd9UIlHvuPQjSYBB-gsvn9Xh8HF7o6IAjnt6jjmETLnRIrK4ARGhcy2sObHUjLVaSwbKWGQZoKUZxGAwNQqfy7dgf7aj_3BOS88qPeamlrgyVu-MUu0t_S0Y26366ShBQkIdEaEECQ',
    stars: 5
  }
];

export const CAREER_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Top 50 Technical Interview Questions for Diploma Mechanical Engineers (DET)',
    category: 'DET Interview',
    branch: 'Mechanical',
    readsOrDownloads: '14,250 Downloads',
    description: 'Comprehensive guide covering GD&T symbols, lathe vs CNC milling, heat treatment cycles, 5S implementation, and hydraulic valve schematics asked in Tata Motors, Bharat Forge & Cummins interviews.',
    dateAdded: 'Updated for 2024/2025'
  },
  {
    id: 'res-2',
    title: 'NATS / BOAT Portal Registration & DBT Bank Seeding Step-by-Step Manual',
    category: 'NATS Guide',
    branch: 'All Branches',
    readsOrDownloads: '28,900 Downloads',
    description: 'Official checklist for national apprenticeship registration: 16-digit student enrollment ID, Aadhaar NPCI bank account mapping, contract generation, and direct monthly stipend transfer rules.',
    dateAdded: 'Govt Gazette Aligned'
  },
  {
    id: 'res-3',
    title: 'RRB JE (Junior Engineer) Polytechnic Syllabus & Exam Pattern Breakdown',
    category: 'PSU Syllabus',
    branch: 'Civil / Mech / Elec',
    readsOrDownloads: '32,100 Downloads',
    description: 'Detailed analysis of CBT 1 and CBT 2 exam weightage, recommended standard textbooks, previous 5-year cutoff marks, and technical subject-wise preparation schedules for railway jobs.',
    dateAdded: 'Latest 2024 Edition'
  },
  {
    id: 'res-4',
    title: 'MSBTE K-Scheme 5th & 6th Sem Model Answer Papers & Lab Viva Cheatsheets',
    category: 'MSBTE / BTEUP Papers',
    branch: 'All Branches',
    readsOrDownloads: '41,800 Downloads',
    description: 'Direct PDF archive of Maharashtra State Board of Technical Education model question papers with step-by-step marking schemes, circuit diagrams, and capstone project documentation samples.',
    dateAdded: 'Winter & Summer Sessions'
  },
  {
    id: 'res-5',
    title: 'Junior Electrical & Control Panel Interview Handbook',
    category: 'DET Interview',
    branch: 'Electrical',
    readsOrDownloads: '11,400 Downloads',
    description: 'PLC ladder programming basics, single-line diagrams, relay logic troubleshooting, transformer losses calculation, and earthing pit resistance measurement practices.',
    dateAdded: 'Siemens & Schneider Aligned'
  },
  {
    id: 'res-6',
    title: 'Frontend & Full-Stack Practical Code Test Kit for Diploma IT Graduates',
    category: 'DET Interview',
    branch: 'Computer / IT',
    readsOrDownloads: '19,600 Downloads',
    description: 'Hands-on React code challenges, REST API fetch queries, responsive CSS layout exercises, Git conflict resolution steps, and SQL query test sets designed specifically for entry-level tech roles.',
    dateAdded: 'Interactive Code Kit'
  }
];
