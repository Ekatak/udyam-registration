import { useState } from "react";
import { ProgressTracker } from "@/components/ui/progress-tracker";
import { AadhaarStep } from "./AadhaarStep";
import { PanStep } from "./PanStep";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText } from "lucide-react";

interface FormData {
  aadhaar?: { aadhaar: string; name: string };
  pan?: { pan: string; panName: string };
}

const steps = [
  {
    id: 1,
    title: "Aadhaar Verification",
    description: "Identity verification with OTP"
  },
  {
    id: 2,
    title: "PAN Verification", 
    description: "Tax identification validation"
  }
];

export const UdyamRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAadhaarComplete = (data: { aadhaar: string; name: string }) => {
    setFormData(prev => ({ ...prev, aadhaar: data }));
    setCompletedSteps(prev => [...prev, 1]);
    setCurrentStep(2);
  };

  const handlePanComplete = (data: { pan: string; panName: string }) => {
    setFormData(prev => ({ ...prev, pan: data }));
    setCompletedSteps(prev => [...prev, 2]);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen form-container flex items-center justify-center p-4">
        <Card className="form-card border-form-border max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Registration Completed Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your Udyam registration form has been submitted. Both Aadhaar and PAN verification are complete.
            </p>
            
            <div className="space-y-4 text-left bg-muted/30 p-6 rounded-lg border border-form-border">
              <h3 className="font-semibold text-foreground">Verification Summary:</h3>
              
              <div className="flex items-center justify-between py-2 border-b border-form-border">
                <span className="text-sm text-muted-foreground">Aadhaar Verified:</span>
                <span className="text-sm font-medium">****{formData.aadhaar?.aadhaar.slice(-4)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-form-border">
                <span className="text-sm text-muted-foreground">Name (Aadhaar):</span>
                <span className="text-sm font-medium">{formData.aadhaar?.name}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-form-border">
                <span className="text-sm text-muted-foreground">PAN Verified:</span>
                <span className="text-sm font-medium font-mono">{formData.pan?.pan}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Name (PAN):</span>
                <span className="text-sm font-medium">{formData.pan?.panName}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-info mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Next Steps</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                You will receive a confirmation email with your application reference number. 
                The complete Udyam registration process includes additional business details 
                which would be collected in subsequent steps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen form-container">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Udyam Registration Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your MSME registration with our simplified two-step verification process
          </p>
        </div>

        <ProgressTracker 
          steps={steps} 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />

        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <AadhaarStep onNext={handleAadhaarComplete} />
          )}
          
          {currentStep === 2 && formData.aadhaar && (
            <PanStep 
              onComplete={handlePanComplete} 
              aadhaarData={formData.aadhaar}
            />
          )}
        </div>
      </div>
    </div>
  );
};