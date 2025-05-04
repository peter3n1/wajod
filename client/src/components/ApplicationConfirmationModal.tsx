import React, { useState, useEffect } from "react";
import { CheckCircle2, CheckCircle, Medal, Calendar, Users, Clock, Briefcase, ShieldCheck } from "lucide-react";
import { 
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ApplicationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationConfirmationModal = ({ isOpen, onClose }: ApplicationConfirmationModalProps) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Animate the progress bar on mount
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setShowContent(true);
        }, 500);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setProgress(0);
      setShowContent(false);
    }
  }, [isOpen]);
  
  const today = new Date();
  const reviewDate = new Date(today);
  reviewDate.setDate(today.getDate() + 3);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {!showContent ? (
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-whatsapp-green"></div>
            </div>
            <h3 className="text-lg font-semibold">Finalizing your application...</h3>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-whatsapp-green to-green-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-black">Application Successful!</h2>
                  <p className="font-semibold text-black">Your application has been successfully submitted.</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <CheckCircle2 className="h-12 w-12 text-black" />
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <ShieldCheck className="h-6 w-6 text-whatsapp-green mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Meta Account Connected</h3>
                  <p className="text-sm text-gray-600">
                    Your application is now linked to your verified Meta account, which significantly 
                    increases the priority of your application.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">What happens next?</h3>
                
                <div className="flex items-start">
                  <div className="bg-whatsapp-green/10 rounded-full p-2 mr-4 mt-1">
                    <CheckCircle className="h-5 w-5 text-whatsapp-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Application Received</h4>
                    <p className="text-sm text-gray-600">We've received your application and ID document.</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(today)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 mt-1">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Initial Review</h4>
                    <p className="text-sm text-gray-600">Our recruitment team will review your application.</p>
                    <p className="text-xs text-gray-500 mt-1">Expected by {formatDate(reviewDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 mt-1">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Interview Invitation</h4>
                    <p className="text-sm text-gray-600">If selected, you'll receive an invitation for an interview.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 mt-1">
                    <Medal className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Final Decision</h4>
                    <p className="text-sm text-gray-600">The final hiring decision will be made after all interviews.</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-[#1877F2] mr-3" />
                  <h3 className="font-semibold text-gray-800">Join our talent community</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-9">
                  Stay updated on future opportunities at WhatsApp and Meta.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <Button 
                  onClick={onClose}
                  className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white flex-1"
                  size="lg"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Back to Careers
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationConfirmationModal;
