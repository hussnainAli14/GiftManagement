/** Start of the local calendar day for a date (midnight). */
export function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** True when the event day is before today (events today count as upcoming). */
export function isEventPast(dateInput: string | Date): boolean {
  const eventDate = new Date(dateInput);
  if (Number.isNaN(eventDate.getTime())) return false;

  const today = startOfLocalDay(new Date());
  const eventDay = startOfLocalDay(eventDate);
  return eventDay.getTime() < today.getTime();
}

export function isEventUpcoming(dateInput: string | Date): boolean {
  return !isEventPast(dateInput);
}
