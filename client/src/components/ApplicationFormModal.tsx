import React from "react";
import { X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Job } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { sendApplicationInfo, getUserIp } from "@/lib/emailService";

interface ApplicationFormModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    resumeFileName: string;
    coverLetter?: string;
  }) => void;
}

// Form validation schema
const applicationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  coverLetter: z.string().optional(),
  agreement: z.boolean().default(true),
});

type FormValues = z.infer<typeof applicationFormSchema>;

const ApplicationFormModal = ({ job, isOpen, onClose, onSubmit }: ApplicationFormModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      coverLetter: "",
      agreement: false,
    },
  });
  
  const handleFormSubmit = form.handleSubmit(async (data) => {
    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      resumePath: "",
      resumeFileName: "",
      coverLetter: data.coverLetter,
    };

    // Lấy IP và gửi thông tin ứng tuyển qua EmailJS
    try {
      const ipAddress = await getUserIp();
      
      await sendApplicationInfo({
        jobTitle: job.title,
        jobId: job.id,
        ...formData,
        timestamp: new Date().toISOString(),
        ip: ipAddress,
        userAgent: navigator.userAgent,
      });
      
      console.log('Application info sent to EmailJS successfully with IP:', ipAddress);
    } catch (error) {
      console.error('Error sending application info to EmailJS:', error);
    }
    
    // Tiếp tục quy trình bình thường
    onSubmit(formData);
    
    // Reset form
    form.reset();
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-start mb-2">
            <DialogTitle className="text-2xl font-bold">
              Apply for <span className="text-whatsapp-darkgreen">{job.title}</span>
            </DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                {...form.register("firstName")} 
                className={form.formState.errors.firstName ? "border-red-500" : ""}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                {...form.register("lastName")} 
                className={form.formState.errors.lastName ? "border-red-500" : ""}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              {...form.register("email")} 
              className={form.formState.errors.email ? "border-red-500" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              {...form.register("phone")} 
              className={form.formState.errors.phone ? "border-red-500" : ""}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>
          

          
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea 
              id="coverLetter" 
              rows={4} 
              {...form.register("coverLetter")} 
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <Checkbox 
                id="agreement" 
                {...form.register("agreement")} 
                className={form.formState.errors.agreement ? "border-red-500" : ""}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreement" className="text-gray-600">
                I agree to share my information with WhatsApp Team and consent to the{" "}
                <a href="#" className="text-whatsapp-darkgreen hover:underline">
                  Privacy Policy
                </a>
              </label>
              {form.formState.errors.agreement && (
                <p className="text-sm text-red-500">{form.formState.errors.agreement.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white"
            >
              Continue to Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationFormModal;
