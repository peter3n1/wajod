import { CheckCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApplicationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationConfirmationModal = ({ isOpen, onClose }: ApplicationConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center p-6">
        <div className="mb-6 text-whatsapp-green flex justify-center">
          <CheckCircle className="h-16 w-16" />
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Application received – thank you!
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-lg text-gray-600 mb-8">
          We appreciate your interest in joining WhatsApp. 
          You'll receive an email confirmation and next steps within a few working days.
        </p>
        
        <Button
          onClick={onClose}
          className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white w-full"
          size="lg"
        >
          Return to Careers
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationConfirmationModal;
