/** Split `total` into `count` equal parts (2 decimal places); remainder cents go to first shares. */
export function splitEqually(total: number, count: number): number[] {
  if (count < 1 || total <= 0) return [];
  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const extra = totalCents - baseCents * count;
  return Array.from({ length: count }, (_, i) => (baseCents + (i < extra ? 1 : 0)) / 100);
}

export type ContributionSplit = {
  participantCount: number;
  /** Amount each invited friend pays */
  sharePerPerson: number;
  /** Amount the organizer pays (may differ by a cent from friends) */
  organizerShare: number;
  /** Full split: [organizer, friend1, friend2, ...] */
  shares: number[];
};

/** Divide remaining goal among organizer + `friendCount` friends. */
export function computeContributionSplit(
  remaining: number,
  friendCount: number
): ContributionSplit {
  const participantCount = friendCount + 1;
  if (participantCount < 1 || remaining <= 0) {
    return {
      participantCount,
      sharePerPerson: 0,
      organizerShare: 0,
      shares: [],
    };
  }

  const shares = splitEqually(remaining, participantCount);
  const organizerShare = shares[0] ?? 0;
  const sharePerPerson = friendCount > 0 ? shares[1] ?? organizerShare : organizerShare;

  return {
    participantCount,
    sharePerPerson,
    organizerShare,
    shares,
  };
}
