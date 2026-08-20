export type ValidationResult = {
  message?: string;
  valid: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  if (!emailPattern.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Please enter your password.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must contain at least 8 characters.' };
  }

  return { valid: true };
}

export function validateRequired(value: string, message: string): ValidationResult {
  if (!value.trim()) {
    return { valid: false, message };
  }

  return { valid: true };
}

export function firstInvalid(...results: ValidationResult[]) {
  return results.find((result) => !result.valid);
}
