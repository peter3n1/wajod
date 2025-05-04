import { 
  users, type User, type InsertUser,
  jobs, type Job, type InsertJob,
  applications, type Application, type InsertApplication
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Job methods
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private userId: number;
  private jobId: number;
  private applicationId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.userId = 1;
    this.jobId = 1;
    this.applicationId = 1;
    
    // Initialize with sample job listings
    const sampleJobs: InsertJob[] = [
      {
        title: "Social Media Manager",
        location: "Global",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 90000,
        maxSalary: 110000,
        responsibilities: "Develop and execute social media strategy across all WhatsApp platforms\nCreate engaging content that resonates with our global audience\nAnalyze performance metrics and optimize campaigns based on data insights\nStay current with social media trends and best practices\nCollaborate with marketing, product, and design teams to ensure consistent messaging",
        requirements: "3+ years of experience in social media management\nExcellent writing and communication skills\nExperience with social media analytics tools\nKnowledge of best practices across major social platforms\nBachelor's degree in Marketing, Communications, or related field",
        benefits: "Competitive salary and equity package\nComprehensive health, dental, and vision insurance\nGenerous paid time off and parental leave\nFlexible work arrangements\nProfessional development budget\nWellness programs and fitness reimbursements",
        isRemote: false
      },
      {
        title: "Social Media Coordinator",
        location: "US",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 65000,
        maxSalary: 80000,
        responsibilities: "Assist with day-to-day social media operations\nCreate and schedule content across platforms\nMonitor social media channels and engage with audience\nTrack social media metrics and prepare reports\nSupport social media campaigns and initiatives",
        requirements: "1-2 years of experience in social media management\nStrong writing and editing skills\nFamiliarity with social media scheduling tools\nKnowledge of social media best practices\nBachelor's degree in Marketing or related field",
        benefits: "Competitive salary package\nComprehensive health insurance\nPaid time off\nRemote work options\nProfessional development opportunities",
        isRemote: false
      },
      {
        title: "Social Media Specialist",
        location: "Remote",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 75000,
        maxSalary: 95000,
        responsibilities: "Execute platform-specific social media strategies\nCreate and publish engaging content\nCommunity management across all platforms\nAnalyze social media performance metrics\nCollaborate on campaign planning and execution",
        requirements: "2-3 years of social media marketing experience\nStrong knowledge of social media platforms and best practices\nExperience with content creation tools\nExcellent communication skills\nAnalytical mindset with attention to detail",
        benefits: "Competitive salary\nHealth, dental, and vision insurance\nFlexible work arrangements\nProfessional development budget\nHome office stipend\nWellness programs",
        isRemote: true
      },
      {
        title: "Social Media Analyst",
        location: "US",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 80000,
        maxSalary: 100000,
        responsibilities: "Analyze social media performance metrics and trends\nProduce regular reports on key performance indicators\nProvide data-driven recommendations to improve social media strategy\nMonitor competitor social media activities\nWork with marketing teams to optimize campaign performance",
        requirements: "2+ years of experience in social media analytics\nStrong data analysis skills\nProficiency with social media analytics tools\nExperience with data visualization\nBachelor's degree in Marketing, Analytics, or related field",
        benefits: "Competitive compensation package\nComprehensive benefits coverage\nFlexible work schedule\nLearning and development opportunities\nEmployee wellness programs\nTeam events and activities",
        isRemote: false
      },
      {
        title: "Content Creator",
        location: "Global",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 85000,
        maxSalary: 105000,
        responsibilities: "Create compelling content for WhatsApp's brand channels\nDevelop creative concepts for campaigns\nCollaborate with design and marketing teams\nEnsure content aligns with brand voice and strategy\nAnalyze content performance and optimize accordingly",
        requirements: "2+ years of content creation experience\nExcellent storytelling abilities\nStrong portfolio of previous work\nFamiliarity with content management systems\nBachelor's degree in Communications, Journalism, or related field",
        benefits: "Competitive salary and benefits\nFlexible work schedule\nHealth and wellness programs\nEducation reimbursement\nPaid volunteer time\nCompany social events",
        isRemote: false
      },
      {
        title: "Influencer Marketing Manager",
        location: "Remote",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 95000,
        maxSalary: 115000,
        responsibilities: "Develop and implement influencer marketing strategies\nIdentify and build relationships with relevant influencers\nManage influencer campaigns from conception to execution\nTrack campaign performance and ROI\nCollaborate with social media and brand teams on integrated campaigns",
        requirements: "3+ years of experience in influencer marketing\nStrong network of industry contacts\nExcellent relationship management skills\nAnalytical approach to campaign measurement\nCreative problem-solving abilities",
        benefits: "Competitive salary with performance bonuses\nComprehensive benefits package\nFlexible remote work policy\nProfessional development opportunities\nQuarterly team retreats\nWellness stipend",
        isRemote: true
      },
      {
        title: "Social Media Strategist",
        location: "Global",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 100000,
        maxSalary: 120000,
        responsibilities: "Develop comprehensive social media strategies aligned with business goals\nLead the planning and execution of large-scale social campaigns\nAnalyze industry trends and provide strategic recommendations\nCollaborate with cross-functional teams to ensure consistent messaging\nEstablish KPIs and evaluate performance against benchmarks",
        requirements: "5+ years of experience in social media marketing\nProven track record of successful campaign development\nStrong analytical and strategic thinking skills\nExcellent communication and presentation abilities\nExperience with budget management and ROI analysis",
        benefits: "Competitive salary and equity package\nComprehensive health benefits\nGenerous paid time off\nFlexible work arrangements\nContinuing education allowance\nWellness programs and gym membership",
        isRemote: false
      },
      {
        title: "Paid Social Media Specialist",
        location: "US",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 85000,
        maxSalary: 105000,
        responsibilities: "Plan and execute paid social media campaigns\nManage social media advertising budgets\nOptimize campaigns for performance and ROI\nCreate and A/B test ad creative and copy\nAnalyze campaign metrics and provide recommendations\nStay updated on platform changes and best practices",
        requirements: "3+ years of experience in paid social media advertising\nProficiency with social media advertising platforms\nExperience with budget management and optimization\nStrong analytical skills and data-driven approach\nKnowledge of audience targeting and segmentation",
        benefits: "Competitive salary package\nFull benefits coverage\nFlexible work arrangements\nProfessional development opportunities\nEmployee referral program\nTeam building events",
        isRemote: false
      },
      {
        title: "WhatsApp Product Manager",
        location: "Global",
        department: "Product",
        category: "Product",
        minSalary: 130000,
        maxSalary: 160000,
        responsibilities: "Define product vision, strategy, and roadmap for WhatsApp features\nWork closely with engineering, design, and research teams\nPrioritize product backlog and define requirements\nAnalyze user needs and market opportunities\nMeasure product performance and iterate based on data",
        requirements: "5+ years of product management experience\nStrong technical background and understanding of mobile platforms\nExcellent analytical and problem-solving skills\nProven track record of shipping successful products\nMBA or technical degree preferred",
        benefits: "Competitive salary and equity package\nComprehensive health, dental, and vision coverage\nGenerous paid time off and parental leave\nFlexible work arrangements\nContinuing education allowance\nWellness programs",
        isRemote: false
      },
      {
        title: "Design Program Manager - WhatsApp",
        location: "Remote",
        department: "Design",
        category: "Design",
        minSalary: 120000,
        maxSalary: 150000,
        responsibilities: "Coordinate design workflows and processes across WhatsApp products\nFacilitate collaboration between design and cross-functional teams\nManage design project timelines and resources\nImplement and optimize design operations\nEnsure design quality and consistency across products",
        requirements: "4+ years of experience in design program management\nStrong understanding of design processes and methodologies\nExcellent organization and communication skills\nExperience with design tools and systems\nBackground in UX/UI design or related field",
        benefits: "Competitive compensation package\nComprehensive benefits coverage\nRemote work flexibility\nProfessional development opportunities\nHome office stipend\nWellness programs",
        isRemote: true
      },
      {
        title: "Support Experience Engineer - Tools & Automation, WhatsApp Operations",
        location: "US",
        department: "Engineering",
        category: "Engineering",
        minSalary: 115000,
        maxSalary: 140000,
        responsibilities: "Design and develop tools to improve support operations\nAutomate workflows to enhance efficiency\nAnalyze support data to identify improvement opportunities\nCollaborate with support and engineering teams\nImplement solutions that scale across global support systems",
        requirements: "3+ years of software engineering experience\nStrong knowledge of programming languages (Python, JavaScript)\nExperience with automation and tooling development\nFamiliarity with support operations or customer service\nBachelor's degree in Computer Science or related field",
        benefits: "Competitive salary with bonuses\nComprehensive health benefits\nFlexible work schedule\nContinuing education support\nWellness programs\nTeam building activities",
        isRemote: false
      },
      {
        title: "Technical Program Manager, WhatsApp",
        location: "Remote",
        department: "Engineering",
        category: "Engineering",
        minSalary: 135000,
        maxSalary: 165000,
        responsibilities: "Lead cross-functional technical programs for WhatsApp\nCoordinate engineering efforts across multiple teams\nManage project timelines, resources, and dependencies\nIdentify and mitigate risks to program success\nCommunicate program status to key stakeholders",
        requirements: "5+ years of technical program management experience\nStrong technical background in software development\nExcellent leadership and communication skills\nExperience with agile methodologies\nProven track record of delivering complex technical programs",
        benefits: "Competitive salary and equity package\nComprehensive benefits coverage\nRemote work flexibility\nProfessional development budget\nHome office allowance\nWellness stipend",
        isRemote: true
      },
      {
        title: "Head of WhatsApp Support Operations",
        location: "Global",
        department: "Operations",
        category: "Operations",
        minSalary: 150000,
        maxSalary: 180000,
        responsibilities: "Lead global WhatsApp support operations strategy\nDevelop and implement support processes and standards\nManage support leadership team across regions\nOptimize operational efficiency and user satisfaction\nReport on key performance metrics to executive leadership",
        requirements: "8+ years of experience in support operations management\nProven leadership abilities and team management\nStrong analytical and strategic thinking skills\nExcellence in cross-functional collaboration\nExperience with global support operations",
        benefits: "Competitive executive compensation package\nComprehensive health and wellness benefits\nExecutive retirement plan\nFlexible work arrangements\nLeadership development programs\nTravel opportunities",
        isRemote: false
      },
      {
        title: "Backend Engineer - Security",
        location: "Remote",
        department: "Engineering",
        category: "Engineering",
        minSalary: 130000,
        maxSalary: 160000,
        responsibilities: "Design and implement security features for WhatsApp's backend systems\nReview code for security vulnerabilities\nCollaborate with security team on threat modeling\nImplement secure authentication and encryption methods\nStay current with security best practices",
        requirements: "5+ years of backend engineering experience\nStrong knowledge of security principles and practices\nExperience with encryption and secure communication protocols\nFamiliarity with secure coding practices\nBachelor's degree in Computer Science or related field",
        benefits: "Competitive salary with equity\nComprehensive benefits package\nFlexible remote work policy\nContinuing education allowance\nHome office setup budget\nPaid industry conferences",
        isRemote: true
      },
      {
        title: "Data Scientist - User Behavior",
        location: "US",
        department: "Data Science",
        category: "Data Science",
        minSalary: 125000,
        maxSalary: 155000,
        responsibilities: "Analyze user behavior patterns within WhatsApp\nBuild predictive models to improve user experience\nCollaborate with product and engineering teams\nTranslate data insights into actionable recommendations\nDesign and implement A/B tests to validate hypotheses",
        requirements: "4+ years of experience in data science\nStrong background in statistical analysis and machine learning\nProficiency in SQL, Python, and data visualization tools\nExperience with behavioral data analysis\nMaster's or PhD in Statistics, Computer Science, or related field",
        benefits: "Competitive salary and equity package\nComprehensive health benefits\nFlexible work arrangements\nProfessional development budget\nRelocation assistance\nWellness programs",
        isRemote: false
      }
    ];
    
    // Insert sample jobs into storage
    for (const jobData of sampleJobs) {
      this.createJob(jobData);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Job methods
  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }
  
  async getJobById(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }
  
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobId++;
    const job: Job = { ...insertJob, id };
    this.jobs.set(id, job);
    return job;
  }
  
  // Application methods
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const createdAt = new Date().toISOString();
    const application: Application = { 
      ...insertApplication, 
      id, 
      status: "pending",
      createdAt
    };
    this.applications.set(id, application);
    return application;
  }
  
  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.jobId === jobId
    );
  }
  
  async getApplicationById(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (application) {
      const updatedApplication = { ...application, status };
      this.applications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
