// Strips surrounding spaces so that a value made only of spaces counts as empty.
export const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

// Emails are stored in lowercase, matching the unique index on lower(email).
export const normalizeEmail = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;
