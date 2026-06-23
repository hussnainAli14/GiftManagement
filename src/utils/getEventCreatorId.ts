import type { EventModel } from '../api/eventApi';

export function getEventCreatorId(event: EventModel): string | undefined {
  if (!event.createdBy) return undefined;
  if (typeof event.createdBy === 'string') return event.createdBy;
  return event.createdBy._id;
}
