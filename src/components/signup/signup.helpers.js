/**
 * Returns true if the phone string contains exactly 10 digits.
 * Accepts formatted inputs like (555) 123-4567 or 555-123-4567.
 */
export const isValidPhone = (phone) => phone.replace(/\D/g, '').length === 10;

/**
 * Formats a Date object or date string as "Month Day, Year".
 * Returns '—' for empty values and falls back to the raw string if unparseable.
 */
export const formatDate = (dob) => {
  if (!dob) return '—';
  const d = dob instanceof Date ? dob : new Date(dob);
  if (isNaN(d.getTime())) return String(dob);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
