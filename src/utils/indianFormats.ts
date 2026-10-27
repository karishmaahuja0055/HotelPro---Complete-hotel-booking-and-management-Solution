/**
 * Indian Rupee and Regional Formatting Utilities
 */

// Formats a number into Indian Rupee representation (e.g. ₹1,25,000)
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formats 10-digit Indian phone number with +91 prefix
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    const core = digits.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone.startsWith('+91') ? phone : `+91 ${phone}`;
}

// Validates Indian phone number (10 digits, optionally starting with +91)
export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    // Standard Indian mobile number begins with 6, 7, 8, or 9
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  return false;
}

// Indian standard GSTIN validator (15 characters: 2 state digits + 10 PAN + 1 entity + 1 'Z' + 1 checksum)
export function isValidGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

// Generate unique booking reference with Indian region prefix
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const counter = Math.floor(1000 + Math.random() * 9000);
  return `HP-IND-${year}-${randomPart}${counter}`;
}

// Format date in Indian English standard (DD MMM YYYY)
export function formatIndianDate(dateString: string | Date): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
