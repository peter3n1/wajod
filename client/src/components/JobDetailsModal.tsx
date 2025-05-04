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

interface JobDetailsModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const JobDetailsModal = ({ job, isOpen, onClose, onApply }: JobDetailsModalProps) => {
  // Convert responsibilities, requirements, and benefits text to arrays for lists
  const responsibilitiesList = job.responsibilities.split('\n');
  const requirementsList = job.requirements.split('\n');
  const benefitsList = job.benefits.split('\n');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-start mb-2">
            <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
          <DialogDescription>
            <p className="text-gray-600">{job.location} | {job.department}</p>
            <p className="text-whatsapp-darkgreen font-medium mt-1">
              ${job.minSalary/1000}k - ${job.maxSalary/1000}k per year
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {responsibilitiesList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {requirementsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Benefits & Perks</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {benefitsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onApply}
            className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white"
            size="lg"
          >
            Apply Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
