import { parsePrice } from '../screens/user/ConfirmOrder/types';

export type ContributionAmountSource = {
  price?: string | number;
  contributionTarget?: number;
  contributionProgress?: number;
  contributedPercent?: number;
  targetAmount?: number;
};

/** Goal amount for a contributable wishlist item (matches backend). */
export function getContributionGoalAmount(source: ContributionAmountSource): number {
  if (source.contributionTarget != null && source.contributionTarget > 0) {
    return source.contributionTarget;
  }
  if (source.targetAmount != null && source.targetAmount > 0) {
    return source.targetAmount;
  }
  if (typeof source.price === 'number' && source.price > 0) {
    return source.price;
  }
  return parsePrice(String(source.price ?? '0'));
}

/** Amount already pooled toward the goal (contributionProgress is PKR, not percent). */
export function getContributionFundedAmount(
  goalTarget: number,
  source: ContributionAmountSource,
): number {
  const progress = source.contributionProgress;
  if (progress != null && Number.isFinite(Number(progress))) {
    return Math.min(goalTarget, Math.round(Number(progress) * 100) / 100);
  }
  const pct = source.contributedPercent ?? 0;
  return Math.min(goalTarget, Math.round(goalTarget * (pct / 100) * 100) / 100);
}

/**
 * How much can still be contributed. Wishlist progress already includes paid friend pledges.
 */
export function getContributionRemainingAllowance(
  goalTarget: number,
  wishlistFunded: number,
): number {
  return Math.round(Math.max(0, goalTarget - wishlistFunded) * 100) / 100;
}

/** @deprecated Prefer getContributionRemainingAllowance — do not subtract pledges already in progress. */
export function getContributionRemaining(
  goalTarget: number,
  fundedAmount: number,
  _approvedPledgeTotal = 0,
): number {
  return getContributionRemainingAllowance(goalTarget, fundedAmount);
}

export function formatContributionPkr(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function validateContributionAmount(
  amount: number,
  maxAllowed: number,
): { ok: true } | { ok: false; message: string } {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: 'Choose a valid contribution amount.' };
  }
  if (maxAllowed <= 0) {
    return {
      ok: false,
      message: 'This item is already fully funded. No more contributions are needed.',
    };
  }
  if (amount > maxAllowed) {
    return {
      ok: false,
      message: `Contribution cannot exceed ${formatContributionPkr(maxAllowed)}. That is the remaining amount needed.`,
    };
  }
  return { ok: true };
}
