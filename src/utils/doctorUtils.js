/**
 * Automatically generates initials from a doctor's name:
 * - Single name: use the first two letters. Example: Agalya → AG
 * - Multiple names: use the first letter of first and last names. Example: Priya Sharma → PS
 * Strips common prefixes ("Dr.", "Dr ") before computing initials.
 */
export function getDoctorInitials(name) {
  if (!name || typeof name !== 'string') return 'DR';
  const cleaned = name.replace(/^Dr\.?\s+/i, '').trim();
  if (!cleaned) return 'DR';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
