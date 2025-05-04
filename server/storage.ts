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
        location: "Remote",
        department: "Marketing & Communications",
        category: "Marketing",
        minSalary: 80000,
        maxSalary: 95000,
        responsibilities: "Assist with day-to-day social media operations\nCreate and schedule content across platforms\nMonitor social media channels and engage with audience\nTrack social media metrics and prepare reports\nSupport social media campaigns and initiatives",
        requirements: "1-2 years of experience in social media management\nStrong writing and editing skills\nFamiliarity with social media scheduling tools\nKnowledge of social media best practices\nBachelor's degree in Marketing or related field",
        benefits: "Competitive salary package\nComprehensive health insurance\nPaid time off\nRemote work options\nProfessional development opportunities",
        isRemote: true
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
