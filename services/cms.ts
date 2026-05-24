export interface StatMetric {
  label: string;
  value: string;
  change?: string;
  description: string;
}

export interface YearStats {
  year: number;
  totalOffers: number;
  placedPercentage: number;
  highestPackage: number; // in LPA
  averagePackage: number; // in LPA
  companiesVisited: number;
  departments: {
    dept: string;
    placedCount: number;
    totalEligible: number;
    avgPackage: number;
  }[];
}

export interface Recruiter {
  id: string;
  name: string;
  logo: string; // will be dynamic text/SVG style or path
  sector: "IT & Software" | "Core Engineering" | "Consulting & Analytics" | "Finance & Banking";
  rolesOffered: string[];
  packageRange: string;
  topRecruiter: boolean;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  department: string;
  companyName: string;
  role: string;
  salaryPackage: string; // e.g. "24 LPA"
  testimonial: string;
  linkedinUrl: string;
  avatarUrl?: string;
  year: number;
}

export interface PlacementReport {
  id: string;
  title: string;
  year: string;
  downloadUrl: string;
  fileSize: string;
  description: string;
}

export interface TrainingActivity {
  id: string;
  title: string;
  date: string;
  category: "Workshops" | "Coding Sessions" | "Industry Talks" | "Hackathons" | "Skill Development";
  description: string;
  trainer: string;
  status: "Upcoming" | "Completed";
  duration: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  type: "Full-Time" | "Internship" | "Dual Offer";
  eligibility: string;
  salary: string; // e.g. "14 LPA"
  deadline: string;
  status: "Active" | "Closed" | "Upcoming";
  description: string;
  applyUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  category: "Faculty" | "Student Representative";
  avatar: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: "Placement Drive" | "Training" | "General Notice";
  important: boolean;
}

export interface PlacementHighlight {
  id: string;
  studentName: string;
  department: string;
  role: string;
  salaryPackage: string;
  avatarUrl?: string;
}

export interface PlacementPoster {
  id: string;
  slug: string;
  companyName: string;
  companyLogo: string;
  title: string;
  posterImage: string;
  placementCount: number;
  packageValue: string;
  roleName: string;
  date: string;
  year: number;
  description: string;
  highlights: PlacementHighlight[];
  companyDetails?: {
    description: string;
    websiteUrl: string;
    sector: string;
  };
}

// ----------------------------------------------------
// Mock Data Store (easily pluggable with Strapi APIs)
// ----------------------------------------------------

const mockStats: YearStats[] = [
  {
    year: 2025,
    totalOffers: 624,
    placedPercentage: 94.2,
    highestPackage: 45.0,
    averagePackage: 8.4,
    companiesVisited: 142,
    departments: [
      { dept: "Computer Science & Eng (CSE)", placedCount: 160, totalEligible: 170, avgPackage: 10.2 },
      { dept: "Electronics & Comm (ECE)", placedCount: 135, totalEligible: 145, avgPackage: 8.1 },
      { dept: "Mechanical (Automobile) (MA)", placedCount: 75, totalEligible: 90, avgPackage: 6.8 },
      { dept: "Mechanical (Production) (MP)", placedCount: 78, totalEligible: 95, avgPackage: 6.7 },
      { dept: "Mechanical Engineering (ME)", placedCount: 88, totalEligible: 105, avgPackage: 6.8 },
      { dept: "Biotech & Chemical (BT & CH)", placedCount: 88, totalEligible: 119, avgPackage: 6.5 },
    ]
  },
  {
    year: 2024,
    totalOffers: 580,
    placedPercentage: 92.8,
    highestPackage: 38.5,
    averagePackage: 7.9,
    companiesVisited: 128,
    departments: [
      { dept: "Computer Science & Eng (CSE)", placedCount: 150, totalEligible: 160, avgPackage: 9.8 },
      { dept: "Electronics & Comm (ECE)", placedCount: 125, totalEligible: 140, avgPackage: 7.8 },
      { dept: "Mechanical (Automobile) (MA)", placedCount: 70, totalEligible: 85, avgPackage: 6.3 },
      { dept: "Mechanical (Production) (MP)", placedCount: 72, totalEligible: 90, avgPackage: 6.2 },
      { dept: "Mechanical Engineering (ME)", placedCount: 82, totalEligible: 100, avgPackage: 6.4 },
      { dept: "Biotech & Chemical (BT & CH)", placedCount: 81, totalEligible: 105, avgPackage: 6.1 },
    ]
  },
  {
    year: 2023,
    totalOffers: 512,
    placedPercentage: 91.5,
    highestPackage: 32.0,
    averagePackage: 7.2,
    companiesVisited: 115,
    departments: [
      { dept: "Computer Science & Eng (CSE)", placedCount: 130, totalEligible: 145, avgPackage: 9.0 },
      { dept: "Electronics & Comm (ECE)", placedCount: 110, totalEligible: 130, avgPackage: 7.2 },
      { dept: "Mechanical (Automobile) (MA)", placedCount: 60, totalEligible: 80, avgPackage: 5.8 },
      { dept: "Mechanical (Production) (MP)", placedCount: 64, totalEligible: 85, avgPackage: 5.8 },
      { dept: "Mechanical Engineering (ME)", placedCount: 75, totalEligible: 95, avgPackage: 6.0 },
      { dept: "Biotech & Chemical (BT & CH)", placedCount: 73, totalEligible: 95, avgPackage: 5.6 },
    ]
  }
];

const mockRecruiters: Recruiter[] = [
  { id: "1", name: "Google", logo: "GOOG", sector: "IT & Software", rolesOffered: ["Software Engineer", "Site Reliability Engineer"], packageRange: "28 - 45 LPA", topRecruiter: true },
  { id: "2", name: "Microsoft", logo: "MSFT", sector: "IT & Software", rolesOffered: ["SWE Analyst", "Data Engineer"], packageRange: "22 - 38 LPA", topRecruiter: true },
  { id: "3", name: "NVIDIA", logo: "NVDA", sector: "IT & Software", rolesOffered: ["ASIC Design Engineer", "System Software Dev"], packageRange: "24 - 36 LPA", topRecruiter: true },
  { id: "4", name: "Amazon", logo: "AMZN", sector: "IT & Software", rolesOffered: ["Cloud Architect", "Software Dev Engineer"], packageRange: "18 - 32 LPA", topRecruiter: true },
  { id: "5", name: "Deloitte", logo: "DELT", sector: "Consulting & Analytics", rolesOffered: ["Technology Analyst", "Strategy Consultant"], packageRange: "8 - 14 LPA", topRecruiter: false },
  { id: "6", name: "Goldman Sachs", logo: "GS", sector: "Finance & Banking", rolesOffered: ["Financial Analyst", "Operations Engineer"], packageRange: "16 - 28 LPA", topRecruiter: true },
  { id: "7", name: "Tata Motors", logo: "TATA", sector: "Core Engineering", rolesOffered: ["Graduate Engineer Trainee", "R&D Specialist"], packageRange: "7 - 11 LPA", topRecruiter: true },
  { id: "8", name: "L&T Construction", logo: "L&T", sector: "Core Engineering", rolesOffered: ["Post Graduate Trainee", "Project Engineer"], packageRange: "6 - 9 LPA", topRecruiter: false },
  { id: "9", name: "JP Morgan Chase", logo: "JPMC", sector: "Finance & Banking", rolesOffered: ["Associate Software Engineer", "Risk Analyst"], packageRange: "14 - 20 LPA", topRecruiter: true },
  { id: "10", name: "Siemens", logo: "SIEM", sector: "Core Engineering", rolesOffered: ["Systems Design Engineer", "Automation Engineer"], packageRange: "8 - 13 LPA", topRecruiter: false },
  { id: "11", name: "Adobe", logo: "ADBE", sector: "IT & Software", rolesOffered: ["Product Engineer", "UI Researcher"], packageRange: "22 - 35 LPA", topRecruiter: false },
  { id: "12", name: "Accenture", logo: "ACCN", sector: "Consulting & Analytics", rolesOffered: ["Packaged App Developer", "Data Analyst"], packageRange: "5 - 9 LPA", topRecruiter: false },
];

const mockSuccessStories: SuccessStory[] = [
  {
    id: "1",
    studentName: "Lorem Ipsum",
    department: "Computer Science & Eng (CSE)",
    companyName: "Google",
    role: "Associate Software Engineer",
    salaryPackage: "42.5 LPA",
    testimonial: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    linkedinUrl: "https://linkedin.com/in/dummy-lorem",
    year: 2025
  },
  {
    id: "2",
    studentName: "Dolor Sit",
    department: "Electronics & Comm (ECE)",
    companyName: "NVIDIA",
    role: "Hardware Design Engineer",
    salaryPackage: "31.2 LPA",
    testimonial: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
    linkedinUrl: "https://linkedin.com/in/dummy-dolor",
    year: 2025
  },
  {
    id: "3",
    studentName: "Amet Consectetur",
    department: "Mechanical Engineering (ME)",
    companyName: "Tata Motors",
    role: "Product Design Engineer",
    salaryPackage: "10.8 LPA",
    testimonial: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    linkedinUrl: "https://linkedin.com/in/dummy-amet",
    year: 2024
  },
  {
    id: "4",
    studentName: "Adipiscing Elit",
    department: "Biotech & Chemical (BT & CH)",
    companyName: "Goldman Sachs",
    role: "Systems Analyst",
    salaryPackage: "22.0 LPA",
    testimonial: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur.",
    linkedinUrl: "https://linkedin.com/in/dummy-adipiscing",
    year: 2025
  }
];

const mockReports: PlacementReport[] = [
  { id: "1", title: "Annual Placement Report 2024-25", year: "2025", downloadUrl: "#", fileSize: "2.4 MB", description: "Comprehensive breakdown of the 2025 graduation placements, recruiters, packages, and key demographic trends." },
  { id: "2", title: "Annual Placement Report 2023-24", year: "2024", downloadUrl: "#", fileSize: "2.1 MB", description: "Detailed statistics of the 2024 placement season, highlighting peak recruiters and department metrics." },
  { id: "3", title: "Annual Placement Report 2022-23", year: "2023", downloadUrl: "#", fileSize: "1.9 MB", description: "Archived overview of the 2023 placement recruitment campaign, student offers, and salary distributions." }
];

const mockTraining: TrainingActivity[] = [
  { id: "1", title: "Advanced Data Structures & Algorithms", date: "June 10 - June 25, 2026", category: "Coding Sessions", description: "Intense daily bootcamps focusing on graph theory, dynamic programming, and systems design logic commonly asked by tier-1 recruiters.", trainer: "CodeCraft Academy & Tech Leads", status: "Upcoming", duration: "30 Hours" },
  { id: "2", title: "VLSI Design & Hardware Architecture", date: "June 28 - July 5, 2026", category: "Workshops", description: "Specialized design training targeting silicon engineers, hardware description languages, and layout designs.", trainer: "Senior Hardware Architect, Intel", status: "Upcoming", duration: "16 Hours" },
  { id: "3", title: "Cracking the Product Manager Interview", date: "May 18, 2026", category: "Industry Talks", description: "Interactive session on mock case studies, product metrics, and business logic structures.", trainer: "Principal PM, Microsoft", status: "Completed", duration: "3 Hours" },
  { id: "4", title: "Summer Hackathon: Resilient Engineering Systems", date: "May 2-3, 2026", category: "Hackathons", description: "A 36-hour sprint where students build real-world software & IoT prototypes for immediate industrial challenges.", trainer: "CGPU Tech Board", status: "Completed", duration: "36 Hours" },
  { id: "5", title: "Resume Construction & Mock Behavioral Panels", date: "Ongoing weekly", category: "Skill Development", description: "One-on-one resume critique sessions and group discussion simulation panels led by expert HR executives.", trainer: "Global HR Consultants", status: "Upcoming", duration: "Continuous" }
];

const mockDrives: PlacementDrive[] = [
  { id: "1", companyName: "Microsoft", role: "Software Engineering Intern", type: "Internship", eligibility: "B.Tech CSE/ECE (Graduating 2027), CGPA >= 8.0, No active backlogs", salary: "1.2 Lakhs/month stipend", deadline: "June 15, 2026", status: "Active", description: "Summer internship opening with pre-placement interview (PPI) opportunity for outstanding performers.", applyUrl: "#" },
  { id: "2", companyName: "Tata Elxsi", role: "Embedded Systems Engineer", type: "Full-Time", eligibility: "B.Tech ECE/EEE/ME (Graduating 2026), CGPA >= 7.0", salary: "8.5 LPA", deadline: "June 18, 2026", status: "Active", description: "Full-time recruitment drive for core systems engineering, electronics hardware development, and IoT programming.", applyUrl: "#" },
  { id: "3", companyName: "Amazon", role: "Cloud Support Engineer", type: "Full-Time", eligibility: "B.Tech/M.Tech (All Streams), CGPA >= 7.5", salary: "16.0 LPA", deadline: "June 10, 2026", status: "Upcoming", description: "Direct hiring drive for Cloud Computing Operations division. Online coding test scheduled for mid-June.", applyUrl: "#" },
  { id: "4", companyName: "Deloitte", role: "Business Technology Analyst", type: "Full-Time", eligibility: "B.Tech (All Streams), CGPA >= 6.5", salary: "7.6 LPA", deadline: "May 20, 2026", status: "Closed", description: "Consulting recruitment drive focusing on enterprise technology implementation and business logic systems.", applyUrl: "#" }
];

const mockTeam: TeamMember[] = [
  { id: "1", name: "Prof. Lorem Ipsum", role: "Head of Placements (Placement Officer)", email: "lorem.ipsum@sctce.ac.in", phone: "+91-471-2490572", category: "Faculty", avatar: "LI" },
  { id: "2", name: "Dr. Dolor Sit", role: "Assistant Placement Coordinator (ECE)", email: "dolor.sit@sctce.ac.in", category: "Faculty", avatar: "DS" },
  { id: "3", name: "Prof. Amet Consectetur", role: "Assistant Placement Coordinator (ME)", email: "amet.consectetur@sctce.ac.in", category: "Faculty", avatar: "AC" },
  { id: "4", name: "Dolor Adipiscing", role: "Chief Student Coordinator", email: "dolor.adipiscing@student.sctce.ac.in", phone: "+91 98950 12345", category: "Student Representative", avatar: "DA" },
  { id: "5", name: "Elit Consequat", role: "Deputy Student Coordinator", email: "elit.consequat@student.sctce.ac.in", category: "Student Representative", avatar: "EC" }
];

const mockAnnouncements: Announcement[] = [
  { id: "1", title: "Microsoft Internships Registration Open", date: "May 24, 2026", content: "Microsoft registration link for Summer Internships is active. Eligible B.Tech 2027 batch CSE & ECE students must fill the profile data sheet before June 15.", category: "Placement Drive", important: true },
  { id: "2", title: "Compulsory Mock Placement Exam", date: "May 22, 2026", content: "A comprehensive mock online placement assessment (Quant, Aptitude & Coding) will be held on May 30 from 10:00 AM to 1:00 PM for all pre-final year students.", category: "Training", important: true },
  { id: "3", title: "VLSI Boot Camp Details", date: "May 19, 2026", content: "The schedule for VLSI Boot Camp in association with Intel is finalized. Registered students check training portal for lab allocations.", category: "Training", important: false }
];

const mockPlacementPosters: PlacementPoster[] = [
  {
    id: "poster-1",
    slug: "microsoft-swe-2025",
    companyName: "Microsoft",
    companyLogo: "MSFT",
    title: "Microsoft SWE Recruitment Drive",
    posterImage: "/posters/microsoft.png",
    placementCount: 12,
    packageValue: "45.0 LPA",
    roleName: "Software Engineering Intern / FTE",
    date: "October 2024",
    year: 2025,
    description: "Microsoft's campus engagement saw an extraordinary performance from the graduating batch of 2025, resulting in multiple software engineering internship and full-time placement offers.",
    highlights: [
      { id: "h1-1", studentName: "Lorem Ipsum A", department: "Computer Science & Eng (CSE)", role: "Software Engineer Intern", salaryPackage: "45.0 LPA" },
      { id: "h1-2", studentName: "Lorem Ipsum B", department: "Computer Science & Eng (CSE)", role: "Software Engineer Intern", salaryPackage: "45.0 LPA" },
      { id: "h1-3", studentName: "Lorem Ipsum C", department: "Electronics & Comm (ECE)", role: "Software Engineer Intern", salaryPackage: "45.0 LPA" },
      { id: "h1-4", studentName: "Lorem Ipsum D", department: "Computer Science & Eng (CSE)", role: "Software Engineer Intern", salaryPackage: "45.0 LPA" },
      { id: "h1-5", studentName: "Lorem Ipsum E", department: "Computer Science & Eng (CSE)", role: "Associate Software Engineer", salaryPackage: "28.0 LPA" },
      { id: "h1-6", studentName: "Lorem Ipsum F", department: "Electronics & Comm (ECE)", role: "Associate Software Engineer", salaryPackage: "28.0 LPA" }
    ],
    companyDetails: {
      description: "Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and services.",
      websiteUrl: "https://microsoft.com",
      sector: "IT & Software"
    }
  },
  {
    id: "poster-2",
    slug: "google-swe-2025",
    companyName: "Google",
    companyLogo: "GOOG",
    title: "Google Associate SWE Selection",
    posterImage: "/posters/google.png",
    placementCount: 4,
    packageValue: "42.5 LPA",
    roleName: "Associate Software Engineer",
    date: "September 2024",
    year: 2025,
    description: "Google's direct selection round for graduating engineers. Four students demonstrated exceptional programming and software design aptitude to secure engineering roles.",
    highlights: [
      { id: "h2-1", studentName: "Dolor Sit A", department: "Computer Science & Eng (CSE)", role: "Associate Software Engineer", salaryPackage: "42.5 LPA" },
      { id: "h2-2", studentName: "Dolor Sit B", department: "Computer Science & Eng (CSE)", role: "Associate Software Engineer", salaryPackage: "42.5 LPA" },
      { id: "h2-3", studentName: "Dolor Sit C", department: "Computer Science & Eng (CSE)", role: "Associate Software Engineer", salaryPackage: "42.5 LPA" },
      { id: "h2-4", studentName: "Dolor Sit D", department: "Electronics & Comm (ECE)", role: "Associate Software Engineer", salaryPackage: "42.5 LPA" }
    ],
    companyDetails: {
      description: "Google LLC is an American multinational technology company focusing on artificial intelligence, search engine, online advertising, cloud computing, and computer software.",
      websiteUrl: "https://google.com",
      sector: "IT & Software"
    }
  },
  {
    id: "poster-3",
    slug: "nvidia-hw-2025",
    companyName: "NVIDIA",
    companyLogo: "NVDA",
    title: "NVIDIA Core Engineering Drive",
    posterImage: "/posters/nvidia.png",
    placementCount: 6,
    packageValue: "36.0 LPA",
    roleName: "ASIC Design / System Software Engineer",
    date: "November 2024",
    year: 2025,
    description: "Nvidia hired multiple students for core hardware engineering and systems level programming. This reflects the deep technical foundation and labs at SCTCE.",
    highlights: [
      { id: "h3-1", studentName: "Amet Consectetur A", department: "Electronics & Comm (ECE)", role: "ASIC Design Engineer", salaryPackage: "36.0 LPA" },
      { id: "h3-2", studentName: "Amet Consectetur B", department: "Electronics & Comm (ECE)", role: "ASIC Design Engineer", salaryPackage: "36.0 LPA" },
      { id: "h3-3", studentName: "Amet Consectetur C", department: "Computer Science & Eng (CSE)", role: "System Software Developer", salaryPackage: "24.0 LPA" },
      { id: "h3-4", studentName: "Amet Consectetur D", department: "Electronics & Comm (ECE)", role: "System Software Developer", salaryPackage: "24.0 LPA" },
      { id: "h3-5", studentName: "Amet Consectetur E", department: "Electronics & Comm (ECE)", role: "Hardware QA Engineer", salaryPackage: "24.0 LPA" },
      { id: "h3-6", studentName: "Amet Consectetur F", department: "Computer Science & Eng (CSE)", role: "System Software Developer", salaryPackage: "24.0 LPA" }
    ],
    companyDetails: {
      description: "Nvidia Corporation is an American multinational technology company incorporated in Delaware and based in Santa Clara, California. It designs graphics processing units (GPUs) and application programming interfaces (APIs).",
      websiteUrl: "https://nvidia.com",
      sector: "IT & Software"
    }
  },
  {
    id: "poster-4",
    slug: "oracle-fesco-2025",
    companyName: "Oracle",
    companyLogo: "ORCL",
    title: "Oracle Financial Services Software Drive",
    posterImage: "/posters/oracle.png",
    placementCount: 15,
    packageValue: "18.0 LPA",
    roleName: "Associate Member of Technical Staff",
    date: "August 2024",
    year: 2025,
    description: "Oracle recruited 15 graduating students for their core technical staff roles, with package offerings highlighting the industry readiness of SCTCE engineering graduates.",
    highlights: [
      { id: "h4-1", studentName: "Lorem Ipsum 1", department: "Computer Science & Eng (CSE)", role: "Associate MTS", salaryPackage: "18.0 LPA" },
      { id: "h4-2", studentName: "Lorem Ipsum 2", department: "Computer Science & Eng (CSE)", role: "Associate MTS", salaryPackage: "18.0 LPA" },
      { id: "h4-3", studentName: "Lorem Ipsum 3", department: "Computer Science & Eng (CSE)", role: "Associate MTS", salaryPackage: "18.0 LPA" },
      { id: "h4-4", studentName: "Lorem Ipsum 4", department: "Electronics & Comm (ECE)", role: "Associate MTS", salaryPackage: "18.0 LPA" },
      { id: "h4-5", studentName: "Lorem Ipsum 5", department: "Computer Science & Eng (CSE)", role: "Associate MTS", salaryPackage: "18.0 LPA" }
    ],
    companyDetails: {
      description: "Oracle Corporation is an American multinational computer technology corporation headquartered in Austin, Texas. The company sells database software and technology, cloud engineered systems, and enterprise software products.",
      websiteUrl: "https://oracle.com",
      sector: "IT & Software"
    }
  }
];

// ----------------------------------------------------
// CMS Service Layer Functions
// ----------------------------------------------------

export const cmsService = {
  getStatistics: async (): Promise<YearStats[]> => {
    // Mimic API latency
    return new Promise((resolve) => setTimeout(() => resolve(mockStats), 100));
  },
  
  getRecruiters: async (): Promise<Recruiter[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockRecruiters), 100));
  },
  
  getSuccessStories: async (): Promise<SuccessStory[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockSuccessStories), 100));
  },
  
  getReports: async (): Promise<PlacementReport[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockReports), 100));
  },
  
  getTrainingSessions: async (): Promise<TrainingActivity[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockTraining), 100));
  },
  
  getDrives: async (): Promise<PlacementDrive[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockDrives), 100));
  },
  
  getTeamMembers: async (): Promise<TeamMember[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockTeam), 100));
  },
  
  getAnnouncements: async (): Promise<Announcement[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockAnnouncements), 100));
  },

  getPlacementPosters: async (): Promise<PlacementPoster[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockPlacementPosters), 100));
  },

  getPlacementPosterBySlug: async (slug: string): Promise<PlacementPoster | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockPlacementPosters.find(p => p.slug === slug)), 100));
  }
};
