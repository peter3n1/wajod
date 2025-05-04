import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { applicationFormSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Configure multer for file upload
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only certain file types
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint prefix
  const apiRouter = express.Router();
  app.use("/api", apiRouter);
  
  // Endpoint để lấy địa chỉ IP của người dùng
  apiRouter.get("/ip", (req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || 
               req.socket.remoteAddress || 
               req.ip || 
               '0.0.0.0';
               
    res.json({ ip: Array.isArray(ip) ? ip[0] : ip });
  });

  // Get all jobs
  apiRouter.get("/jobs", async (req: Request, res: Response) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get job by ID
  apiRouter.get("/jobs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Submit job application
  apiRouter.post(
    "/applications", 
    upload.single('resume'),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Resume file is required" });
        }

        // Validate form data
        const formData = {
          jobId: parseInt(req.body.jobId),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          coverLetter: req.body.coverLetter,
        };

        try {
          applicationFormSchema.parse(formData);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            const readableError = fromZodError(validationError);
            return res.status(400).json({ message: readableError.message });
          }
          return res.status(400).json({ message: "Invalid form data" });
        }

        // Check if job exists
        const job = await storage.getJobById(formData.jobId);
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }

        // Create application record
        const application = await storage.createApplication({
          jobId: formData.jobId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          resumePath: req.file.path,
          coverLetter: formData.coverLetter,
        });

        res.status(201).json({ 
          message: "Application submitted successfully", 
          applicationId: application.id 
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Failed to submit application" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
