/** Normalize contribution-invite copy — no fixed PKR amount or equal split. */
export function formatContributionInviteMessage(input: {
  message?: string;
  organizerName?: string;
  itemTitle?: string;
  eventTitle?: string;
}): string {
  const { organizerName, itemTitle, eventTitle } = input;
  if (organizerName && itemTitle) {
    const eventSuffix = eventTitle ? ` (${eventTitle})` : '';
    return `${organizerName} invited you to contribute any amount toward "${itemTitle}"${eventSuffix}.`;
  }

  const legacy = input.message || '';
  if (/pay PKR|split among/i.test(legacy)) {
    const titleMatch = legacy.match(/toward ['"]([^'"]+)['"]/i);
    const resolvedTitle = titleMatch?.[1] || 'a gift';
    const nameMatch = legacy.match(/^(.+?) invited you/i);
    const resolvedName = nameMatch?.[1]?.trim() || 'Someone';
    const eventMatch = legacy.match(/\(([^)]+)\)\s*\.?\s*$/);
    const resolvedEvent = eventMatch?.[1];
    const eventSuffix = resolvedEvent ? ` (${resolvedEvent})` : '';
    return `${resolvedName} invited you to contribute any amount toward "${resolvedTitle}"${eventSuffix}.`;
  }

  return legacy || 'You have a new contribution request.';
}
