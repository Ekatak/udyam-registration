// Validation rules for Udyam registration form fields

export const ValidationRules = {
  // Aadhaar validation: 12 digits
  aadhaar: {
    pattern: /^[0-9]{12}$/,
    message: "Aadhaar must be exactly 12 digits",
    format: (value: string) => value.replace(/\D/g, "").slice(0, 12),
    mask: (value: string) => {
      // Format as XXXX XXXX XXXX
      return value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
  },

  // PAN validation: [A-Z]{5}[0-9]{4}[A-Z]{1}
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "PAN format should be ABCDE1234F (5 letters + 4 digits + 1 letter)",
    format: (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10),
    mask: (value: string) => {
      // Format as ABCDE1234F
      return value.replace(/([A-Z]{5})([0-9]{4})([A-Z]{1})/, "$1$2$3");
    }
  },

  // OTP validation: 6 digits
  otp: {
    pattern: /^[0-9]{6}$/,
    message: "OTP must be exactly 6 digits",
    format: (value: string) => value.replace(/\D/g, "").slice(0, 6)
  },

  // Name validation
  name: {
    pattern: /^[a-zA-Z\s]{2,50}$/,
    message: "Name should contain only letters and spaces (2-50 characters)",
    format: (value: string) => value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50)
  },

  // Mobile number validation (Indian format)
  mobile: {
    pattern: /^[6-9][0-9]{9}$/,
    message: "Mobile number should be 10 digits starting with 6, 7, 8, or 9",
    format: (value: string) => value.replace(/\D/g, "").slice(0, 10)
  }
};

// Helper functions for validation
export const validateField = (value: string, fieldType: keyof typeof ValidationRules): boolean => {
  const rule = ValidationRules[fieldType];
  return rule.pattern.test(value);
};

export const formatField = (value: string, fieldType: keyof typeof ValidationRules): string => {
  const rule = ValidationRules[fieldType];
  return rule.format(value);
};

export const getErrorMessage = (fieldType: keyof typeof ValidationRules): string => {
  return ValidationRules[fieldType].message;
};

// Name matching logic for cross-verification
export const checkNameSimilarity = (name1: string, name2: string): {
  isMatch: boolean;
  similarity: number;
  suggestions?: string[];
} => {
  const normalize = (name: string) => 
    name.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  // Simple word matching
  const words1 = n1.split(/\s+/);
  const words2 = n2.split(/\s+/);
  
  let matchingWords = 0;
  const totalWords = Math.max(words1.length, words2.length);
  
  words1.forEach(word1 => {
    if (words2.some(word2 => 
      word1.includes(word2) || 
      word2.includes(word1) || 
      word1 === word2
    )) {
      matchingWords++;
    }
  });
  
  const similarity = (matchingWords / totalWords) * 100;
  const isMatch = similarity >= 60; // 60% similarity threshold
  
  return {
    isMatch,
    similarity: Math.round(similarity),
    suggestions: !isMatch ? [
      "Check for spelling differences",
      "Ensure names match official documents",
      "Consider using initials or abbreviated forms"
    ] : undefined
  };
};

// API simulation responses
export const SimulatedApiResponses = {
  aadhaarVerification: {
    success: {
      status: "verified",
      name: "John Doe",
      message: "Aadhaar verified successfully"
    },
    failure: {
      status: "failed",
      message: "Invalid Aadhaar number or details don't match"
    }
  },
  
  otpVerification: {
    success: {
      status: "verified",
      message: "OTP verified successfully"
    },
    failure: {
      status: "failed", 
      message: "Invalid OTP. Please try again"
    }
  },
  
  panVerification: {
    success: {
      status: "verified",
      name: "JOHN DOE",
      panType: "Individual",
      message: "PAN verified successfully"
    },
    failure: {
      status: "failed",
      message: "Invalid PAN number or details don't match"
    }
  }
};