import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar, Button } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { styles } from './styles';
import type { ContributionProgressParams } from './types';
import { colors } from '../../../theme';
import { useAuth } from '../../../context/AuthContext';
import { getFriendsApi, type FriendModel } from '../../../api/friendApi';
import {
  createContributionCampaignApi,
  getContributionCampaignByItemApi,
  getContributionCampaignByIdApi,
  getFriendIdFromPledge,
  getOrganizerId,
  type ContributionCampaign,
  type ContributionPledge,
} from '../../../api/contributionCampaignApi';
import {
  getContributionFundedAmount,
  getContributionGoalAmount,
  getContributionRemainingAllowance,
  validateContributionAmount,
  formatContributionPkr,
} from '../../../utils/contributionAmounts';
import {
  isPledgeActive,
  isPledgePaid,
  pledgeStatusLabel,
} from '../../../utils/contributionPledgeStatus';
import { getWishlistByEventApi } from '../../../api/wishlistApi';
import {
  getCampaignPeerReviewsApi,
  getFriendContributionRatingsApi,
  type FriendContributionRating,
} from '../../../api/reviewApi';

type ContributionProgressRouteProp = RouteProp<
  { params: ContributionProgressParams },
  'params'
>;

type StackParamList = {
  ContributionProgress: ContributionProgressParams;
  RespondContributionInvite: { campaignId: string };
  FriendContributionReview: {
    campaignId: string;
    revieweeId: string;
    friendName?: string;
  };
  Payment: {
    amount: number;
    description: string;
    isFullGift: boolean;
    isContribution?: boolean;
    eventTitle?: string;
    wishlistItemId?: string;
    campaignId?: string;
    vendorId?: string;
    vendorName?: string;
  };
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

function itemFromCampaign(campaign: ContributionCampaign): PersonsWishlistItemData {
  const target = campaign.targetAmount ?? 0;
  return {
    id: campaign.wishlistItemId,
    title: campaign.itemTitle || 'Wishlist item',
    description: '',
    price: `PKR ${target.toLocaleString('en-PK')}`,
    image: '',
    contributedPercent: 0,
    contributionTarget: target,
    contributionProgress: 0,
  };
}

const ContributionProgress = () => {
  const route = useRoute<ContributionProgressRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'ContributionProgress'>>();
  const { user } = useAuth();
  const {
    item: routeItem,
    wishlistItemId: routeWishlistItemId,
    campaignId: routeCampaignId,
    eventTitle: routeEventTitle,
    eventId: routeEventId,
    wishlistOwnerId: routeWishlistOwnerId,
    eventOwnerId: routeEventOwnerId,
    vendorId: routeVendorId,
    vendorName: routeVendorName,
  } = route.params ?? {};

  const [resolvedItem, setResolvedItem] = useState<PersonsWishlistItemData | null>(routeItem ?? null);
  const [eventTitle, setEventTitle] = useState(routeEventTitle);
  const [organizerAmountInput, setOrganizerAmountInput] = useState('');

  const [campaign, setCampaign] = useState<ContributionCampaign | null>(null);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [friendRatings, setFriendRatings] = useState<Record<string, FriendContributionRating>>({});
  const [reviewedFriendIds, setReviewedFriendIds] = useState<Set<string>>(new Set());
  const [lowRatingPrompt, setLowRatingPrompt] = useState<{ id: string; name: string } | null>(null);

  const item = resolvedItem;
  const wishlistItemId = item?.id ?? routeWishlistItemId;

  const goalTarget = useMemo(
    () =>
      getContributionGoalAmount({
        price: item?.price,
        contributionTarget: item?.contributionTarget,
        contributionProgress: item?.contributionProgress,
        contributedPercent: item?.contributedPercent,
        targetAmount: campaign?.targetAmount,
      }),
    [item, campaign?.targetAmount],
  );

  const fundedAmount = useMemo(
    () =>
      getContributionFundedAmount(goalTarget, {
        contributionProgress: item?.contributionProgress,
        contributedPercent: item?.contributedPercent,
      }),
    [goalTarget, item?.contributionProgress, item?.contributedPercent],
  );

  const isOrganizer = useMemo(() => {
    if (!campaign || !user?.id) return true;
    return getOrganizerId(campaign) === user.id;
  }, [campaign, user?.id]);

  const paidPledgeTotal = useMemo(() => {
    if (!campaign) return 0;
    return campaign.pledges
      .filter((p) => isPledgePaid(p.status))
      .reduce((sum, p) => sum + Number(p.pledgedAmount || 0), 0);
  }, [campaign]);

  const totalContributed = Math.min(goalTarget, fundedAmount);
  const progressPercent =
    goalTarget > 0 ? Math.min(100, (totalContributed / goalTarget) * 100) : 0;
  const remaining = getContributionRemainingAllowance(goalTarget, fundedAmount);

  const canOrganizerPay =
    isOrganizer && campaign && campaign.status !== 'organizer_contributed';

  const paymentVendorId = routeVendorId ?? campaign?.vendorId;
  const paymentVendorName = routeVendorName ?? campaign?.vendorName;

  const excludeUserIds = useMemo(() => {
    const ids = new Set<string>();
    if (routeWishlistOwnerId) ids.add(routeWishlistOwnerId);
    if (routeEventOwnerId) ids.add(routeEventOwnerId);
    return ids;
  }, [routeWishlistOwnerId, routeEventOwnerId]);

  const inviteableFriends = useMemo(
    () => friends.filter((f) => !excludeUserIds.has(f.friend._id)),
    [friends, excludeUserIds],
  );

  const load = useCallback(async () => {
    if (!wishlistItemId && !routeCampaignId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const camp = routeCampaignId
        ? await getContributionCampaignByIdApi(routeCampaignId)
        : wishlistItemId
          ? await getContributionCampaignByItemApi(wishlistItemId)
          : null;
      const friendList = await getFriendsApi();
      setCampaign(camp);
      setFriends(friendList);

      const friendIds = friendList.map((f) => f.friend._id);
      if (friendIds.length) {
        try {
          const ratings = await getFriendContributionRatingsApi(friendIds);
          const map: Record<string, FriendContributionRating> = {};
          ratings.forEach((r) => {
            map[r.revieweeId] = r;
          });
          setFriendRatings(map);
        } catch {
          setFriendRatings({});
        }
      }

      if (camp?._id && user?.id && getOrganizerId(camp) === user.id) {
        try {
          const reviews = await getCampaignPeerReviewsApi(camp._id);
          setReviewedFriendIds(new Set(reviews.map((r) => String(r.revieweeId))));
        } catch {
          setReviewedFriendIds(new Set());
        }
      } else {
        setReviewedFriendIds(new Set());
      }
      if (camp) {
        if (!routeItem) {
          setResolvedItem(itemFromCampaign(camp));
        }
        if (!routeEventTitle && camp.eventTitle) {
          setEventTitle(camp.eventTitle);
        }
        if (user?.id && getOrganizerId(camp) === user.id) {
          const invited = new Set(camp.pledges.map((p) => getFriendIdFromPledge(p)));
          setSelectedFriendIds(invited);
        }
      }

      const eventIdForWishlist = routeEventId;
      if (wishlistItemId && eventIdForWishlist) {
        try {
          const wishlist = await getWishlistByEventApi(eventIdForWishlist);
          const wishlistItem = wishlist?.items?.find((wi) => wi._id === wishlistItemId);
          if (wishlistItem) {
            const target = wishlistItem.contributionTarget ?? wishlistItem.price ?? 0;
            const progress = wishlistItem.contributionProgress ?? 0;
            const percent =
              target > 0
                ? Math.round(Math.max(0, Math.min(100, (progress / target) * 100)))
                : 0;
            setResolvedItem((prev) => ({
              ...(prev ?? {
                id: wishlistItemId,
                title: wishlistItem.title,
                description: wishlistItem.description ?? '',
                price: `PKR ${Number(wishlistItem.price ?? 0).toLocaleString('en-PK')}`,
                image: wishlistItem.image ?? '',
                contributedPercent: percent,
              }),
              contributionTarget: target,
              contributionProgress: progress,
              contributedPercent: percent,
            }));
          }
        } catch {
          // Keep route/campaign item data.
        }
      }
    } catch {
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  }, [wishlistItemId, routeCampaignId, routeItem, routeEventTitle, routeEventId, user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const applyFriendSelection = (id: string) => {
    setSelectedFriendIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const toggleFriend = (id: string, name: string) => {
    if (selectedFriendIds.has(id)) {
      setSelectedFriendIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }

    const ratingInfo = friendRatings[id];
    if (ratingInfo && ratingInfo.reviewCount > 0 && ratingInfo.averageRating < 4) {
      setLowRatingPrompt({ id, name });
      return;
    }

    applyFriendSelection(id);
  };

  const handleLowRatingConfirm = () => {
    if (lowRatingPrompt) {
      applyFriendSelection(lowRatingPrompt.id);
    }
    setLowRatingPrompt(null);
  };

  const handleLowRatingCancel = () => {
    setLowRatingPrompt(null);
  };

  const handleSendInvites = async () => {
    if (!item?.id || selectedFriendIds.size === 0) {
      Alert.alert('Select friends', 'Choose at least one friend to invite.');
      return;
    }
    if (!paymentVendorId) {
      Alert.alert('Vendor required', 'Go back and select a vendor to continue.');
      return;
    }
    setSendingInvites(true);
    try {
      const updated = await createContributionCampaignApi({
        wishlistItemId: item.id,
        friendIds: [...selectedFriendIds],
        eventTitle,
        vendorId: paymentVendorId,
      });
      setCampaign(updated);
      Alert.alert(
        'Requests sent',
        'Friends can contribute any amount they choose. You will see their status here.',
      );
    } catch (e) {
      Alert.alert('Failed', e instanceof Error ? e.message : 'Could not send requests');
    } finally {
      setSendingInvites(false);
    }
  };

  const handleConfirmContribution = () => {
    if (!item || !canOrganizerPay || !campaign) return;
    const amount = parseFloat(organizerAmountInput);
    const validation = validateContributionAmount(amount, remaining);
    if (!validation.ok) {
      Alert.alert(
        validation.message.includes('fully funded') ? 'Fully funded' : 'Amount too high',
        validation.message,
      );
      return;
    }
    const description = eventTitle
      ? `Contribution to '${item.title}' - ${eventTitle} Wishlist`
      : `Contribution to '${item.title}'`;
    navigation.navigate('Payment', {
      amount,
      description,
      isFullGift: false,
      isContribution: true,
      eventTitle,
      wishlistItemId: item.id,
      campaignId: campaign._id,
      vendorId: paymentVendorId,
      vendorName: paymentVendorName,
    });
  };

  if (!routeVendorId && routeItem && !routeCampaignId) {
    return (
      <View style={[styles.container, styles.centeredPad]}>
        <Text style={styles.hintText}>Select a vendor first from Gift Options.</Text>
      </View>
    );
  }

  if (!wishlistItemId && !routeCampaignId) {
    return (
      <View style={[styles.container, styles.centeredPad]}>
        <Text style={styles.hintText}>Open this screen from a wishlist item to contribute.</Text>
      </View>
    );
  }

  if (!item && !loading) {
    return (
      <View style={[styles.container, styles.centeredPad]}>
        <Text style={styles.hintText}>Could not load this contribution request.</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const myActivePledge = campaign?.pledges.find(
    (p) => getFriendIdFromPledge(p) === user?.id && isPledgeActive(p.status),
  );

  if (myActivePledge && campaign && !isOrganizer) {
    return (
      <View style={[styles.container, styles.centeredPad]}>
        <Text style={styles.sectionTitle}>Friend contribution request</Text>
        <Text style={styles.hintText}>
          {campaign.organizerId && typeof campaign.organizerId === 'object'
            ? campaign.organizerId.name
            : 'Someone'}{' '}
          invited you to contribute toward &quot;{campaign.itemTitle}&quot;. Choose any amount you
          wish.
        </Text>
        <Button
          variant="primary"
          fullWidth
          onPress={() =>
            navigation.navigate('RespondContributionInvite', { campaignId: campaign._id })
          }
        >
          Contribute
        </Button>
      </View>
    );
  }

  const showFriendPicker =
    isOrganizer && (!campaign || campaign.status === 'awaiting_friends');

  const pendingCount =
    campaign?.pledges.filter((p) => p.status === 'pending').length ?? 0;
  const acceptedCount =
    campaign?.pledges.filter((p) => p.status === 'accepted').length ?? 0;

  const pledgeBadgeStyle = (status: ContributionPledge['status']) => {
    if (isPledgePaid(status)) return styles.contributorBadgeApproved;
    if (status === 'accepted') return styles.contributorBadgeAccepted;
    if (status === 'declined') return styles.contributorBadgeDeclined;
    return undefined;
  };

  const pledgeBadgeTextStyle = (status: ContributionPledge['status']) => {
    if (isPledgePaid(status)) return styles.contributorBadgeTextApproved;
    if (status === 'accepted') return styles.contributorBadgeTextAccepted;
    return undefined;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Contribution Goal</Text>
          <Text style={styles.goalItemName}>{item.title}</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountCurrent}>{formatPkr(totalContributed)}</Text>
            <Text style={styles.amountTotal}>/ {formatPkr(goalTarget)}</Text>
          </View>
          <View style={styles.progressWrapper}>
            <ProgressBar
              progress={progressPercent}
              height={8}
              borderRadius={4}
              fillColor={colors.primary}
              trackColor={colors.borderGray}
            />
          </View>
          <View style={styles.remainingRow}>
            <Text style={styles.remainingText}>Remaining: {formatPkr(remaining)}</Text>
            <View style={styles.badgeStillNeeded}>
              <Text style={styles.badgeStillNeededText}>Still Needed</Text>
            </View>
          </View>
        </View>

        {paymentVendorName ? (
          <View style={styles.vendorBanner}>
            <Text style={styles.vendorBannerLabel}>Selected vendor</Text>
            <Text style={styles.vendorBannerName}>{paymentVendorName}</Text>
          </View>
        ) : null}

        {showFriendPicker ? (
          <>
            <Text style={styles.sectionTitle}>Invite friends</Text>
            <Text style={styles.hintText}>
              Ask friends to contribute any amount toward the remaining {formatPkr(remaining)}.
              Each person chooses what they want to give.
            </Text>
            {inviteableFriends.length === 0 ? (
              <Text style={styles.hintText}>
                {friends.length === 0
                  ? 'Add friends first from the Friends tab.'
                  : 'No eligible friends to invite (the wishlist or event owner cannot be invited).'}
              </Text>
            ) : (
              inviteableFriends.map((f) => {
                const fid = f.friend._id;
                const selected = selectedFriendIds.has(fid);
                const ratingInfo = friendRatings[fid];
                const friendLabel = f.friend.name ?? 'Friend';
                const displayRating =
                  ratingInfo && ratingInfo.reviewCount > 0 ? ratingInfo.averageRating : 0;
                const reviewCount = ratingInfo?.reviewCount ?? 0;
                return (
                  <TouchableOpacity
                    key={fid}
                    style={[styles.friendRow, selected && styles.friendRowSelected]}
                    onPress={() => toggleFriend(fid, friendLabel)}
                  >
                    <View style={styles.friendNameCol}>
                      <Text style={styles.friendName}>{friendLabel}</Text>
                      <View style={styles.friendRatingRow}>
                        <Icon name="star" size={14} color={colors.primary} />
                        <Text style={styles.friendRatingText}>
                          {displayRating.toFixed(1)}
                          {reviewCount > 0
                            ? ` · ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
                            : ''}
                        </Text>
                      </View>
                    </View>
                    <Icon
                      name={selected ? 'check-circle' : 'radio-button-unchecked'}
                      size={22}
                      color={selected ? colors.primary : colors.darkGray}
                    />
                  </TouchableOpacity>
                );
              })
            )}
            <Button
              variant="primary"
              fullWidth
              onPress={handleSendInvites}
              disabled={sendingInvites || selectedFriendIds.size === 0}
              style={styles.sendInvitesBtn}
            >
              {campaign?.pledges.length ? 'Update invites' : 'Send contribution requests'}
            </Button>
          </>
        ) : null}

        {campaign && campaign.pledges.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Contributors</Text>
            {isOrganizer && pendingCount > 0 ? (
              <Text style={styles.waitingBanner}>
                {pendingCount} pending
                {acceptedCount > 0 ? ` · ${acceptedCount} accepted` : ''}
              </Text>
            ) : null}
            {campaign.pledges.map((p) => {
              const name =
                typeof p.friendId === 'object' ? p.friendId.name ?? 'Friend' : 'Friend';
              const status = pledgeStatusLabel(p.status);
              const revieweeId = getFriendIdFromPledge(p);
              const alreadyReviewed = reviewedFriendIds.has(revieweeId);
              const canReview =
                isOrganizer &&
                !alreadyReviewed &&
                (p.status === 'accepted' ||
                  p.status === 'declined' ||
                  isPledgePaid(p.status));
              return (
                <View key={p._id} style={styles.contributorCard}>
                  <View style={styles.contributorAvatar} />
                  <View style={styles.contributorContent}>
                    <Text style={styles.contributorName}>{name}</Text>
                    {isPledgePaid(p.status) && p.pledgedAmount != null ? (
                      <Text style={styles.contributorAmount}>
                        Paid {formatPkr(p.pledgedAmount)}
                      </Text>
                    ) : null}
                    <View style={[styles.contributorBadge, pledgeBadgeStyle(p.status)]}>
                      <Text style={[styles.contributorBadgeText, pledgeBadgeTextStyle(p.status)]}>
                        {status}
                      </Text>
                    </View>
                    {canReview ? (
                      <TouchableOpacity
                        style={styles.rateContributorBtn}
                        onPress={() =>
                          navigation.navigate('FriendContributionReview', {
                            campaignId: campaign._id,
                            revieweeId,
                            friendName: name,
                          })
                        }
                      >
                        <Icon name="star" size={16} color={colors.primary} />
                        <Text style={styles.rateContributorText}>Rate contributor</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </>
        ) : null}

        {campaign?.status === 'organizer_contributed' ? (
          <Text style={styles.hintText}>You have already contributed to this group gift.</Text>
        ) : canOrganizerPay ? (
          <View style={styles.amountPickerCard}>
            <Text style={styles.pledgedAmountLabel}>Your contribution</Text>
            <Text style={styles.hintText}>
              Enter any amount up to {formatContributionPkr(remaining)} (includes amounts already
              paid by others).
            </Text>
            <TextInput
              style={styles.organizerAmountInput}
              placeholder="e.g. 5000"
              placeholderTextColor={colors.textSecondary}
              value={organizerAmountInput}
              onChangeText={setOrganizerAmountInput}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmContribution}
              activeOpacity={0.7}
            >
              <Icon name="check" size={18} color={colors.white} />
              <Text style={styles.confirmButtonText}>Confirm your contribution</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={lowRatingPrompt != null}
        transparent
        animationType="fade"
        onRequestClose={handleLowRatingCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Low contributor rating</Text>
            <Text style={styles.modalMessage}>
              {lowRatingPrompt?.name ?? 'This person'} accepted to contribute but did not
              contribute previously. Do you want to add them?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={handleLowRatingCancel}
              >
                <Text style={styles.modalBtnSecondaryText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleLowRatingConfirm}
              >
                <Text style={styles.modalBtnPrimaryText}>Yes, add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContributionProgress;
