import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import FeaturedQuoteSection from "@/components/FeaturedQuoteSection";
import NewsSection from "@/components/NewsSection";
import JobsSection from "@/components/JobsSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import JobDetailsModal from "@/components/JobDetailsModal";
import ApplicationFormModal from "@/components/ApplicationFormModal";
import ApplicationReviewModal from "@/components/ApplicationReviewModal";
import ApplicationConfirmationModal from "@/components/ApplicationConfirmationModal";
import { Job } from "@shared/schema";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [showApplicationFormModal, setShowApplicationFormModal] = useState(false);
  const [showApplicationReviewModal, setShowApplicationReviewModal] = useState(false);
  const [showApplicationConfirmationModal, setShowApplicationConfirmationModal] = useState(false);
  const [applicationData, setApplicationData] = useState<{
    jobId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    resumeFileName: string;
    coverLetter?: string;
  } | null>(null);
  
  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetailsModal(true);
  };
  
  const handleApplyForJob = () => {
    setShowJobDetailsModal(false);
    setShowApplicationFormModal(true);
  };
  
  const handleApplicationSubmit = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    resumeFileName: string;
    coverLetter?: string;
  }) => {
    if (!selectedJob) return;
    
    setApplicationData({
      ...formData,
      jobId: selectedJob.id
    });
    setShowApplicationFormModal(false);
    setShowApplicationReviewModal(true);
  };
  
  const handleReviewBack = () => {
    setShowApplicationReviewModal(false);
    setShowApplicationFormModal(true);
  };
  
  const handleApplicationConfirmSubmit = () => {
    setShowApplicationReviewModal(false);
    setShowApplicationConfirmationModal(true);
  };
  
  const handleCloseConfirmation = () => {
    setShowApplicationConfirmationModal(false);
    setApplicationData(null);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TestimonialsSection />
        <WhyJoinSection />
        <FeaturedQuoteSection />
        <NewsSection />
        <JobsSection onViewJobDetails={handleViewJobDetails} />
      </main>
      <Footer />
      
      {/* Modals */}
      {selectedJob && (
        <>
          <JobDetailsModal 
            job={selectedJob}
            isOpen={showJobDetailsModal} 
            onClose={() => setShowJobDetailsModal(false)}
            onApply={handleApplyForJob}
          />
          
          <ApplicationFormModal
            job={selectedJob}
            isOpen={showApplicationFormModal}
            onClose={() => setShowApplicationFormModal(false)}
            onSubmit={handleApplicationSubmit}
          />
          
          {applicationData && (
            <ApplicationReviewModal
              job={selectedJob}
              application={applicationData}
              isOpen={showApplicationReviewModal}
              onClose={() => setShowApplicationReviewModal(false)}
              onBack={handleReviewBack}
              onSubmit={handleApplicationConfirmSubmit}
            />
          )}
          
          <ApplicationConfirmationModal
            isOpen={showApplicationConfirmationModal}
            onClose={handleCloseConfirmation}
          />
        </>
      )}
    </div>
  );
}
