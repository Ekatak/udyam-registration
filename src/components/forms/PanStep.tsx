import { useState } from "react";
import { udyamApi, ApiResponse } from "@/components/forms/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PanStepProps {
  onComplete: (data: { pan: string; panName: string }) => void;
  aadhaarData: { aadhaar: string; name: string };
}

export const PanStep = ({ onComplete, aadhaarData }: PanStepProps) => {
  const [pan, setPan] = useState("");
  const [panName, setPanName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validatePan = (value: string): boolean =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setPan(value);
    if (errors.pan && validatePan(value)) {
      setErrors(prev => ({ ...prev, pan: "" }));
    }
  };

  const verifyPan = async () => {
    const newErrors: Record<string, string> = {};

    if (!validatePan(pan)) {
      newErrors.pan = "Please enter a valid PAN number (Format: ABCDE1234F)";
    }

    if (!panName.trim()) {
      newErrors.panName = "Name as per PAN is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsVerifying(true);
    try {
      const response: ApiResponse = await udyamApi.verifyPan(pan, panName);

      if (response.success) {
        const nameMatch =
          panName.toLowerCase().includes(aadhaarData.name.split(" ")[0].toLowerCase()) ||
          aadhaarData.name.toLowerCase().includes(panName.split(" ")[0].toLowerCase());

        if (!nameMatch) {
          toast({
            title: "Name Mismatch Warning",
            description: "The name in PAN doesn't seem to match with Aadhaar. Please verify.",
            variant: "destructive",
          });
        }

        setIsVerified(true);
        toast({
          title: "PAN Verified Successfully",
          description: "Your PAN details have been validated",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: response.message || "Invalid PAN details",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to connect to backend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleComplete = () => {
    if (isVerified) {
      onComplete({ pan, panName });
    }
  };

  return (
    <Card className="form-card border-form-border">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-accent" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          PAN Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your PAN details for tax identification verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aadhaar Summary */}
        <div className="bg-muted/30 p-4 rounded-lg border border-form-border">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Aadhaar Verified</p>
              <p className="text-xs text-muted-foreground">
                {aadhaarData.name} (****{aadhaarData.aadhaar.slice(-4)})
              </p>
            </div>
          </div>
        </div>

        {/* PAN Input */}
        <div className="space-y-2">
          <Label htmlFor="pan" className="text-sm font-medium">
            PAN Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="pan"
              type="text"
              value={pan}
              onChange={handlePanChange}
              placeholder="ABCDE1234F"
              className={cn(
                "font-mono transition-all duration-200",
                {
                  "error-state": errors.pan,
                  "success-state": pan && validatePan(pan) && !errors.pan && isVerified,
                }
              )}
            />
            {pan && validatePan(pan) && !errors.pan && isVerified && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
            )}
          </div>
          {errors.pan && <p className="text-sm text-destructive">{errors.pan}</p>}
        </div>

        {/* PAN Name Input */}
        <div className="space-y-2">
          <Label htmlFor="panName" className="text-sm font-medium">
            Name as per PAN <span className="text-destructive">*</span>
          </Label>
          <Input
            id="panName"
            type="text"
            value={panName}
            onChange={(e) => {
              setPanName(e.target.value);
              if (errors.panName && e.target.value.trim()) {
                setErrors(prev => ({ ...prev, panName: "" }));
              }
            }}
            placeholder="Enter name exactly as per PAN card"
            className={cn(
              "transition-all duration-200",
              {
                "error-state": errors.panName,
                "success-state": panName.trim() && !errors.panName && isVerified,
              }
            )}
          />
          {errors.panName && <p className="text-sm text-destructive">{errors.panName}</p>}
        </div>

        {/* Name matching info */}
        {panName && aadhaarData.name && (
          <div className="bg-info/5 border border-info/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-info mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-info">Name Matching Info</p>
                <p className="text-muted-foreground">Aadhaar: {aadhaarData.name}</p>
                <p className="text-muted-foreground">PAN: {panName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verify / Complete Button */}
        <div className="space-y-3">
          {!isVerified ? (
            <Button
              onClick={verifyPan}
              disabled={isVerifying || !pan || !panName.trim()}
              className="w-full"
              variant="government"
              size="lg"
            >
              {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
              {isVerifying ? "Verifying PAN..." : "Verify PAN"}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="w-full"
              variant="success"
              size="lg"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Registration
            </Button>
          )}
        </div>

        {/* Success message */}
        {isVerified && (
          <div className="text-center p-4 bg-success/5 border border-success/20 rounded-lg">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-sm font-medium text-success">PAN Verified Successfully</p>
            <p className="text-xs text-muted-foreground">
              Both Aadhaar and PAN verification completed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
