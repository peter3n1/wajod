import { X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface ApplicationReviewModalProps {
  job: Job;
  application: {
    jobId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    resumeFileName: string;
    coverLetter?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ApplicationReviewModal = ({ 
  job, 
  application, 
  isOpen, 
  onClose, 
  onBack,
  onSubmit 
}: ApplicationReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-start mb-2">
            <DialogTitle className="text-2xl font-bold">
              Review Your Application
            </DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Position</h3>
            <p className="text-gray-600">{job.title}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600">
                {application.firstName} {application.lastName}
              </p>
              <p className="text-gray-600">{application.email}</p>
              <p className="text-gray-600">{application.phone}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <p className="text-gray-600">
                Resume: <span className="text-whatsapp-darkgreen">{application.resumeFileName}</span>
              </p>
              <p className="text-gray-600">
                Cover Letter: <span>{application.coverLetter ? "Provided" : "Not provided"}</span>
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-gray-600 mb-6">
              By clicking "Confirm & Submit", your application will be sent to the WhatsApp recruitment team. 
              You will receive an email confirmation and further instructions within a few working days.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={onBack}
              >
                Back to Edit
              </Button>
              <Button
                onClick={onSubmit}
                className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationReviewModal;
