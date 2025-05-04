import { Job } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { toast } from "@/hooks/use-toast";

// Submit application 
export async function submitApplication(formData: FormData): Promise<{ success: boolean; applicationId?: number }> {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to submit application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If parsing fails, use the default error message
      }
      
      toast({
        variant: "destructive",
        title: "Application submission failed",
        description: errorMessage,
      });
      
      return { success: false };
    }
    
    const data = await response.json();
    return { 
      success: true,
      applicationId: data.applicationId
    };
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Application submission failed",
      description: "An unexpected error occurred. Please try again later.",
    });
    return { success: false };
  }
}
