/** Normalize Mongo/API user references to a plain id string. */
export function normalizeUserId(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'object') {
    const record = value as { _id?: unknown; id?: unknown };
    if (record._id != null) return normalizeUserId(record._id);
    if (record.id != null) return normalizeUserId(record.id);
  }
  return undefined;
}
