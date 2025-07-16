/**
 * Safely gets a display name for a user, falling back to email.
 * @param {object | null} user - The user object from Firebase Auth.
 * @returns {string} The display name, email, or a generic fallback.
 */
export const getDisplayName = (user) => user?.displayName || user?.email || 'Bible Student';