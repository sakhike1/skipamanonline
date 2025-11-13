/**
 * Validation utilities for form inputs and data
 */

/**
 * Validates email address format
 * @param email - Email string to validate
 * @returns true if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if string is not empty after trimming
 * @param value - String to validate
 * @returns true if string has content, false otherwise
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates phone number format (basic validation)
 * @param phone - Phone string to validate
 * @returns true if phone is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

