/* eslint-disable @typescript-eslint/no-explicit-any */

// Common API response type for all endpoints
export interface ApiResponse {
  success: boolean;
  message?: string;
  requestId?: string;
}

export const udyamApi = {
  verifyAadhaarAndSendOtp: async (
    aadhaar: string,
    name: string,
    mobile: string
  ): Promise<ApiResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (aadhaar.endsWith("0")) {
          resolve({ success: false, message: "Aadhaar not found" });
        } else if (aadhaar.endsWith("9")) {
          resolve({ success: false, message: "Aadhaar blocked" });
        } else {
          resolve({
            success: true,
            message: "OTP sent successfully",
            requestId: "REQ123456"
          });
        }
      }, 500);
    });
  },

  verifyOtp: async (mobile: string, otp: string): Promise<ApiResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === "000000") {
          resolve({ success: false, message: "Invalid OTP" });
        } else {
          resolve({ success: true, message: "OTP verified successfully" });
        }
      }, 500);
    });
  },

  verifyPan: async (pan: string, name: string): Promise<ApiResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (pan.endsWith("X")) {
          resolve({ success: false, message: "PAN not found" });
        } else if (pan.endsWith("Z")) {
          resolve({ success: false, message: "PAN inactive" });
        } else {
          resolve({ success: true, message: "PAN verified successfully" });
        }
      }, 500);
    });
  },

  submitUdyamApplication: async (
    aadhaar: string,
    pan: string
  ): Promise<ApiResponse> => {
    return Promise.resolve({
      success: true,
      message: "Application submitted successfully"
    });
  },

  completeRegistration: async (payload: {
    aadhaar: string;
    aadhaarName: string;
    pan: string;
    panName: string;
  }): Promise<ApiResponse> => {
    return Promise.resolve({
      success: true,
      message: "Registration completed successfully"
    });
  },
};
