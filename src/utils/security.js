/**
 * Security & Input Sanitization Suite
 * EXPERIMENT 2f: Apply secure handling of user inputs and authentication information
 */

/**
 * Strips dangerous HTML tags, javascript: URIs, and malicious event handlers to prevent XSS.
 * @param {string} input - Raw untrusted user input string
 * @returns {string} - Sanitized string safe for DOM rendering and storage
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, embed, object tags
    .replace(/<(iframe|embed|object|form)[^>]*>.*?<\/\1>/gi, '')
    // Strip inline event handlers like onload, onerror, onclick, onmouseover
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    // Disallow javascript: pseudoprotocol
    .replace(/javascript:[^"'\s]*/gi, '')
    // Strip standalone angle brackets
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Validates user input against strict criteria
 * @param {'name'|'email'|'phone'|'dates'|'requests'} type 
 * @param {any} value 
 * @param {object} [context] 
 * @returns {{ valid: boolean, error: string|null, sanitized: any }}
 */
export function validateInput(type, value, context = {}) {
  switch (type) {
    case 'name': {
      const sanitized = sanitizeInput(value || '');
      if (!sanitized || sanitized.length < 2) {
        return { valid: false, error: 'Full name must be at least 2 characters.', sanitized };
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(sanitized)) {
        return { valid: false, error: 'Name may only contain letters, spaces, hyphens, and periods.', sanitized };
      }
      return { valid: true, error: null, sanitized };
    }

    case 'email': {
      const sanitized = sanitizeInput(value || '');
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(sanitized)) {
        return { valid: false, error: 'Please provide a valid email address (e.g., user@domain.com).', sanitized };
      }
      return { valid: true, error: null, sanitized };
    }

    case 'phone': {
      const sanitized = sanitizeInput(value || '');
      if (!sanitized) {
        return { valid: true, error: null, sanitized: '' }; // optional
      }
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(sanitized)) {
        return { valid: false, error: 'Please enter a valid phone number format.', sanitized };
      }
      return { valid: true, error: null, sanitized };
    }

    case 'dates': {
      const { checkInDate, checkOutDate } = context;
      if (!checkInDate || !checkOutDate) {
        return { valid: false, error: 'Both check-in and check-out dates are required.', sanitized: null };
      }
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);

      // Verify valid date objects
      if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
        return { valid: false, error: 'Invalid calendar dates provided.', sanitized: null };
      }

      // Check chronological order
      if (outDate <= inDate) {
        return { valid: false, error: 'Check-out date must be after check-in date.', sanitized: null };
      }

      return { valid: true, error: null, sanitized: { checkInDate, checkOutDate } };
    }

    case 'requests': {
      const sanitized = sanitizeInput(value || '');
      if (sanitized.length > 500) {
        return { valid: false, error: 'Special requests cannot exceed 500 characters.', sanitized: sanitized.slice(0, 500) };
      }
      return { valid: true, error: null, sanitized };
    }

    default:
      return { valid: true, error: null, sanitized: sanitizeInput(value) };
  }
}

/**
 * Masks payment card numbers for PCI-DSS compliance display
 * @param {string} cardNumber 
 * @returns {string} e.g. "•••• •••• •••• 4242"
 */
export function maskCardNumber(cardNumber = '') {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (!cleaned) return '•••• •••• •••• ••••';
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Masks Bearer JWT tokens for secure UI rendering without leaking secret credentials
 * @param {string} token 
 * @returns {string} e.g. "eyJhbGci...[MASKED-AUTH-TOKEN]"
 */
export function maskToken(token = '') {
  if (!token || typeof token !== 'string') return 'None';
  if (token.length <= 16) return '••••••••••••';
  const prefix = token.slice(0, 14);
  return `${prefix}...[MASKED-SECURE-TOKEN]`;
}

/**
 * Generates an encrypted/hashed mock session ID
 */
export function generateSecureSessionToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'luxe_sec_';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
