import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const ProgressTracker = ({ steps, currentStep, completedSteps }: ProgressTrackerProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isActive = isCurrent || isCompleted;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 step-indicator",
                    {
                      "step-active text-white border-primary": isActive,
                      "border-muted-foreground text-muted-foreground": !isActive,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h4
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-primary": isActive,
                        "text-muted-foreground": !isActive,
                      }
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-24">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-300",
                    {
                      "bg-primary": completedSteps.includes(step.id),
                      "bg-muted": !completedSteps.includes(step.id),
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};