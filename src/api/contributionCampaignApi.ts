import { apiRequest, unwrapData } from './http';

export type ContributionPledge = {
  _id: string;
  friendId: { _id: string; name?: string; email?: string; avatar?: string } | string;
  status: 'pending' | 'accepted' | 'paid' | 'declined' | 'approved';
  pledgedAmount?: number;
  respondedAt?: string;
};

export type ContributionCampaign = {
  _id: string;
  wishlistItemId: string;
  organizerId: { _id: string; name?: string; email?: string } | string;
  itemTitle?: string;
  targetAmount?: number;
  itemContributionProgress?: number;
  itemContributionTarget?: number;
  eventTitle?: string;
  status: 'awaiting_friends' | 'ready_for_organizer' | 'organizer_contributed' | 'cancelled';
  organizerPledgedAmount?: number;
  vendorId?: string;
  vendorName?: string;
  sharePerPerson?: number;
  participantCount?: number;
  pledges: ContributionPledge[];
  createdAt?: string;
};

export async function createContributionCampaignApi(input: {
  wishlistItemId: string;
  friendIds: string[];
  eventTitle?: string;
  vendorId: string;
}): Promise<ContributionCampaign> {
  const response = await apiRequest<unknown>('/contribution-campaigns', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<ContributionCampaign>(response);
}

export async function getContributionCampaignByItemApi(
  wishlistItemId: string
): Promise<ContributionCampaign | null> {
  const response = await apiRequest<unknown>(`/contribution-campaigns/item/${wishlistItemId}`, {
    auth: true,
  });
  const data = unwrapData<ContributionCampaign | null>(response);
  return data ?? null;
}

export async function getContributionCampaignByIdApi(
  campaignId: string
): Promise<ContributionCampaign> {
  const response = await apiRequest<unknown>(`/contribution-campaigns/${campaignId}`, {
    auth: true,
  });
  return unwrapData<ContributionCampaign>(response);
}

export async function getMyPendingContributionInvitesApi(): Promise<ContributionCampaign[]> {
  const response = await apiRequest<unknown>('/contribution-campaigns/invites/pending', {
    auth: true,
  });
  const data = unwrapData<ContributionCampaign[] | ContributionCampaign>(response);
  return Array.isArray(data) ? data : [data];
}

/** Decline a contribution invite (pending or accepted → declined). */
export async function declineContributionInviteApi(
  campaignId: string,
): Promise<ContributionCampaign> {
  const response = await apiRequest<unknown>(`/contribution-campaigns/${campaignId}/decline`, {
    method: 'POST',
    auth: true,
  });
  return unwrapData<ContributionCampaign>(response);
}

/** @deprecated Use declineContributionInviteApi */
export async function respondToContributionInviteApi(
  campaignId: string,
  input: { approve: boolean },
): Promise<ContributionCampaign> {
  if (input.approve) {
    return acceptContributionInviteApi(campaignId);
  }
  return declineContributionInviteApi(campaignId);
}

/** Pending → accepted when the friend taps Contribute (before payment). */
export async function acceptContributionInviteApi(
  campaignId: string,
  pledgedAmount?: number,
): Promise<ContributionCampaign> {
  const response = await apiRequest<unknown>(`/contribution-campaigns/${campaignId}/accept`, {
    method: 'POST',
    auth: true,
    body: { pledgedAmount },
  });
  return unwrapData<ContributionCampaign>(response);
}

/** Accepted → declined when the friend leaves payment without paying. */
export async function abandonContributionPaymentApi(
  campaignId: string,
): Promise<ContributionCampaign> {
  const response = await apiRequest<unknown>(
    `/contribution-campaigns/${campaignId}/abandon-payment`,
    {
      method: 'POST',
      auth: true,
    },
  );
  return unwrapData<ContributionCampaign>(response);
}

export function getFriendIdFromPledge(pledge: ContributionPledge): string {
  const f = pledge.friendId;
  return typeof f === 'string' ? f : f._id;
}

export function getOrganizerId(campaign: ContributionCampaign): string {
  const o = campaign.organizerId;
  return typeof o === 'string' ? o : o._id;
}
