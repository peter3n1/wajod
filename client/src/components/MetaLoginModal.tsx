import React, { useState } from "react";
import { X } from "lucide-react";
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

const MetaLoginModal = ({ isOpen, onClose, onSuccess }: MetaLoginModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      
      // Any email/password combination is accepted for demo purposes
      if (email && password) {
        toast({
          title: "Connected to Meta",
          description: "Your application is now linked to your Meta account.",
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Please enter both email and password.",
        });
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
          
          <p className="text-center text-gray-600">
            Connect your Meta account to complete your application. 
            This helps us verify your identity and improves your chances of getting selected.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Phone</Label>
              <Input 
                id="email" 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
                className="border-gray-300"
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