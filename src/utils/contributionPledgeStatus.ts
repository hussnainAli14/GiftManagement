export type PledgeStatus = 'pending' | 'accepted' | 'paid' | 'declined' | 'approved';

/** @deprecated `approved` is legacy; treated as paid. */
export function isPledgePaid(status: string | undefined): boolean {
  return status === 'paid' || status === 'approved';
}

export function isPledgeAccepted(status: string | undefined): boolean {
  return status === 'accepted';
}

export function isPledgePending(status: string | undefined): boolean {
  return status === 'pending';
}

export function isPledgeActive(status: string | undefined): boolean {
  return isPledgePending(status) || isPledgeAccepted(status);
}

export function pledgeStatusLabel(status: string | undefined): string {
  if (isPledgePaid(status)) return 'Paid';
  if (status === 'accepted') return 'Accepted';
  if (status === 'declined') return 'Declined';
  return 'Pending';
}
