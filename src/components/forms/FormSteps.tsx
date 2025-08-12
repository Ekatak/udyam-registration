// Validation rule interface
interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message?: string;
}

// Form step definition
export interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  validationRules: Record<string, ValidationRule>;
  isRequired: boolean;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Aadhaar Verification",
    description: "Identity verification with OTP",
    fields: ["aadhaar", "name", "otp"],
    validationRules: {
      aadhaar: {
        required: true,
        pattern: /^[0-9]{12}$/,
        message: "Enter valid 12-digit Aadhaar number"
      },
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Enter name as per Aadhaar"
      },
      otp: {
        required: true,
        pattern: /^[0-9]{6}$/,
        message: "Enter valid 6-digit OTP"
      }
    },
    isRequired: true
  },
  {
    id: 2,
    title: "PAN Verification",
    description: "Tax identification validation",
    fields: ["pan", "panName"],
    validationRules: {
      pan: {
        required: true,
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Enter valid PAN (Format: ABCDE1234F)"
      },
      panName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: "Enter name as per PAN"
      }
    },
    isRequired: true
  }
];

// Form state
export interface FormData {
  aadhaar?: {
    aadhaar: string;
    name: string;
    verified: boolean;
    otpVerified: boolean;
  };
  pan?: {
    pan: string;
    panName: string;
    verified: boolean;
  };
  currentStep: number;
  completedSteps: number[];
  submissionTimestamp?: string;
}

export const initialFormData: FormData = {
  currentStep: 1,
  completedSteps: [],
};

// Form actions
export type FormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'SET_AADHAAR_DATA'; payload: FormData['aadhaar'] }
  | { type: 'SET_PAN_DATA'; payload: FormData['pan'] }
  | { type: 'SUBMIT_FORM'; payload: string }
  | { type: 'RESET_FORM' };

// Reducer
export const formReducer = (state: FormData, action: FormAction): FormData => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'COMPLETE_STEP':
      return { ...state, completedSteps: [...new Set([...state.completedSteps, action.payload])] };
    case 'SET_AADHAAR_DATA':
      return { ...state, aadhaar: action.payload };
    case 'SET_PAN_DATA':
      return { ...state, pan: action.payload };
    case 'SUBMIT_FORM':
      return { ...state, submissionTimestamp: action.payload };
    case 'RESET_FORM':
      return initialFormData;
    default:
      return state;
  }
};

// Helpers
export const getStepByName = (stepName: string): FormStep | undefined =>
  FORM_STEPS.find(step => step.title.toLowerCase().includes(stepName.toLowerCase()));

export const getNextStep = (currentStep: number): number | null => {
  const nextIndex = FORM_STEPS.findIndex(step => step.id === currentStep) + 1;
  return nextIndex < FORM_STEPS.length ? FORM_STEPS[nextIndex].id : null;
};

export const getPreviousStep = (currentStep: number): number | null => {
  const prevIndex = FORM_STEPS.findIndex(step => step.id === currentStep) - 1;
  return prevIndex >= 0 ? FORM_STEPS[prevIndex].id : null;
};

export const getFormProgress = (completedSteps: number[]): number =>
  Math.round((completedSteps.length / FORM_STEPS.length) * 100);

export const isFormComplete = (completedSteps: number[]): boolean =>
  FORM_STEPS.every(step => completedSteps.includes(step.id));

// Validation
export const validateStep = (
  stepId: number,
  data: Record<string, string>
): { isValid: boolean; errors: Record<string, string> } => {
  const step = FORM_STEPS.find(s => s.id === stepId);
  if (!step) return { isValid: false, errors: { general: "Invalid step" } };

  const errors: Record<string, string> = {};

  step.fields.forEach(field => {
    const value = data[field] ?? '';
    const rule = step.validationRules[field];

    if (rule.required && value.trim() === '') {
      errors[field] = `${field} is required`;
      return;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message ?? `${field} is invalid`;
      return;
    }
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      return;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
      return;
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
};
