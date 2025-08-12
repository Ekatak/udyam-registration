/* eslint-disable @typescript-eslint/no-explicit-any */
export const udyamApi = {
  verifyAadhaarAndSendOtp: async (aadhaar: string, name: string) => {
    const res = await fetch("http://localhost:5000/api/aadhaar-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, name }),
    });
    return res.json();
  },

  verifyOtp: async (aadhaar: string, otp: string, requestId: string) => {
    const res = await fetch("http://localhost:5000/api/otp-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, otp, requestId }),
    });
    return res.json();
  },

  verifyPan: async (pan: string, name: string) => {
    const res = await fetch("http://localhost:5000/api/pan-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pan, panName: name }),
    });
    return res.json();
  },

  submitUdyamApplication: async (aadhaar: string, pan: string) => {
    const res = await fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, pan }),
    });
    return res.json();
  },

  // ✅ New method for FinalStep
  completeRegistration: async (payload: {
    aadhaar: string;
    aadhaarName: string;
    pan: string;
    panName: string;
  }) => {
    const res = await fetch("http://localhost:5000/api/complete-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
