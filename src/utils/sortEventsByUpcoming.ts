/** Soonest event date first, latest last. */
export function sortEventsByUpcoming<T extends { date: string }>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
    if (Number.isNaN(dateA)) return 1;
    if (Number.isNaN(dateB)) return -1;
    return dateA - dateB;
  });
}
