import { useState } from "react";
import { udyamApi } from "@/components/forms/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AadhaarStepProps {
  onNext: (data: { aadhaar: string; name: string }) => void;
}

export const AadhaarStep = ({ onNext }: AadhaarStepProps) => {
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestId, setRequestId] = useState("");
  const { toast } = useToast();

  const validateAadhaar = (value: string): boolean => /^[0-9]{12}$/.test(value);
  const validateOtp = (value: string): boolean => /^[0-9]{6}$/.test(value);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(value);
    if (errors.aadhaar && validateAadhaar(value)) {
      setErrors(prev => ({ ...prev, aadhaar: "" }));
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (errors.otp && validateOtp(value)) {
      setErrors(prev => ({ ...prev, otp: "" }));
    }
  };

  const sendOtp = async () => {
    const newErrors: Record<string, string> = {};
    if (!validateAadhaar(aadhaar)) {
      newErrors.aadhaar = "Please enter a valid 12-digit Aadhaar number";
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await udyamApi.verifyAadhaarAndSendOtp(aadhaar, name);
      if (response.success && response.data?.requestId) {
        setIsOtpSent(true);
        setRequestId(response.data.requestId);
        toast({
          title: "OTP Sent Successfully",
          description: "Please check your registered mobile number for the OTP",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send OTP",
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
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!validateOtp(otp)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await udyamApi.verifyOtp(aadhaar, otp, requestId);
      if (response.success) {
        toast({
          title: "Verification Successful",
          description: "Aadhaar verified successfully",
        });
        onNext({ aadhaar, name });
      } else {
        toast({
          title: "Verification Failed",
          description: response.message || "Invalid OTP",
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

  return (
    <Card className="form-card border-form-border">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Aadhaar Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your Aadhaar details to verify your identity with OTP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isOtpSent ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="aadhaar" className="text-sm font-medium">
                Aadhaar Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="aadhaar"
                  type="text"
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  className={cn(
                    "transition-all duration-200",
                    {
                      "error-state": errors.aadhaar,
                      "success-state": aadhaar && validateAadhaar(aadhaar) && !errors.aadhaar,
                    }
                  )}
                />
                {aadhaar && validateAadhaar(aadhaar) && !errors.aadhaar && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                )}
              </div>
              {errors.aadhaar && <p className="text-sm text-destructive">{errors.aadhaar}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name && e.target.value.trim()) {
                      setErrors(prev => ({ ...prev, name: "" }));
                    }
                  }}
                  placeholder="Enter your full name as per Aadhaar"
                  className={cn(
                    "transition-all duration-200",
                    {
                      "error-state": errors.name,
                      "success-state": name.trim() && !errors.name,
                    }
                  )}
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <Button
              onClick={sendOtp}
              disabled={isLoading}
              className="w-full"
              variant="government"
              size="lg"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">OTP Sent Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Please enter the 6-digit OTP sent to your registered mobile number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">
                Enter OTP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className={cn(
                  "otp-input transition-all duration-200",
                  {
                    "error-state": errors.otp,
                    "success-state": otp && validateOtp(otp) && !errors.otp,
                  }
                )}
                maxLength={6}
              />
              {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
            </div>

            <div className="space-y-3">
              <Button
                onClick={verifyOtp}
                disabled={isVerifying}
                className="w-full"
                variant="government"
                size="lg"
              >
                {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                onClick={() => setIsOtpSent(false)}
                variant="outline"
                className="w-full"
              >
                Back to Aadhaar Entry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
