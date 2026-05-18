const PLACEHOLDER_VALUES = new Set(['—', '-', 'not provided', 'n/a', 'na', 'none']);

/** True when a string is present and not a placeholder like "Not provided" or "—". */
export function hasDisplayValue(value?: string | null): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_VALUES.has(trimmed.toLowerCase());
}
