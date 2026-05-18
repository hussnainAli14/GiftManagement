import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../../components';
import {
  acceptContributionInviteApi,
  declineContributionInviteApi,
  getContributionCampaignByIdApi,
  type ContributionCampaign,
} from '../../../api/contributionCampaignApi';
import { useAuth } from '../../../context/AuthContext';
import type { PaymentParams } from '../Payment/types';
import { getVendorsApi } from '../../../api/vendorApi';
import { colors } from '../../../theme';
import { isPledgePaid } from '../../../utils/contributionPledgeStatus';
import {
  getContributionFundedAmount,
  getContributionGoalAmount,
  getContributionRemainingAllowance,
  validateContributionAmount,
  formatContributionPkr,
} from '../../../utils/contributionAmounts';
import { styles } from './styles';

type Params = { campaignId: string };

type RoutePropType = RouteProp<{ params: Params }, 'params'>;

type StackParamList = {
  RespondContributionInvite: Params;
  Payment: PaymentParams;
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

const RespondContributionInvite = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useAuth();
  const campaignId = route.params?.campaignId;

  const [campaign, setCampaign] = useState<ContributionCampaign | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const data = await getContributionCampaignByIdApi(campaignId);
        setCampaign(data);
        const myPledge = data.pledges.find(
          (p) =>
            (typeof p.friendId === 'string' ? p.friendId : p.friendId._id) === user?.id
        );
        if (myPledge?.pledgedAmount) {
          setAmount(String(myPledge.pledgedAmount));
        }
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not load request');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [campaignId, user?.id]);

  const myPledge = campaign?.pledges.find(
    (p) => (typeof p.friendId === 'string' ? p.friendId : p.friendId._id) === user?.id
  );

  const maxContribution = useMemo(() => {
    if (!campaign) return 0;
    const goal = getContributionGoalAmount({
      targetAmount: campaign.targetAmount,
      contributionTarget: campaign.itemContributionTarget,
    });
    const funded = getContributionFundedAmount(goal, {
      contributionProgress: campaign.itemContributionProgress,
      contributionTarget: campaign.itemContributionTarget,
    });
    return getContributionRemainingAllowance(goal, funded);
  }, [campaign]);

  const handleConfirmContribution = async () => {
    if (!campaign || !campaignId) return;
    const pledgedAmount = parseFloat(amount);
    const validation = validateContributionAmount(pledgedAmount, maxContribution);
    if (!validation.ok) {
      Alert.alert(
        validation.message.includes('fully funded') ? 'Fully funded' : 'Amount too high',
        validation.message,
      );
      return;
    }

    setSubmitting(true);
    try {
      const updated = await acceptContributionInviteApi(campaignId, pledgedAmount);
      setCampaign(updated);
    } catch (e) {
      Alert.alert('Could not accept', e instanceof Error ? e.message : 'Please try again.');
      setSubmitting(false);
      return;
    }

    const organizerName =
      typeof campaign.organizerId === 'object' ? campaign.organizerId.name ?? 'A friend' : 'A friend';
    const description = campaign.eventTitle
      ? `Contribution to "${campaign.itemTitle}" - ${campaign.eventTitle}`
      : `Contribution to "${campaign.itemTitle}" (${organizerName})`;

    let vendorName = campaign.vendorName;
    if (!vendorName && campaign.vendorId) {
      try {
        const vendors = await getVendorsApi();
        const match = vendors.find((v) => v._id === campaign.vendorId);
        vendorName = match?.businessName || match?.name;
      } catch {
        // proceed without name
      }
    }

    setSubmitting(false);
    navigation.navigate('Payment', {
      amount: pledgedAmount,
      description,
      isFullGift: false,
      isContribution: true,
      isFriendCampaignPledge: true,
      wishlistItemId: campaign.wishlistItemId,
      campaignId,
      eventTitle: campaign.eventTitle,
      vendorId: campaign.vendorId,
      vendorName,
    });
  };

  const handleDecline = async () => {
    if (!campaignId) return;
    setSubmitting(true);
    try {
      await declineContributionInviteApi(campaignId);
      Alert.alert('Declined', 'You declined this contribution request.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Failed', e instanceof Error ? e.message : 'Could not decline');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Contribution request not found.</Text>
      </View>
    );
  }

  const organizerName =
    typeof campaign.organizerId === 'object' ? campaign.organizerId.name ?? 'A friend' : 'A friend';

  if (myPledge && isPledgePaid(myPledge.status)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Contribution complete</Text>
        <Text style={styles.emptyText}>
          You paid {formatPkr(myPledge.pledgedAmount ?? 0)} for &quot;{campaign.itemTitle}&quot;.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Contribution request</Text>
      <Text style={styles.subtitle}>
        {organizerName} invited you to contribute toward &quot;{campaign.itemTitle}&quot;
        {campaign.eventTitle ? ` (${campaign.eventTitle})` : ''}. Give any amount you wish.
      </Text>
      <Text style={styles.label}>Your contribution amount</Text>
      {maxContribution > 0 ? (
        <Text style={styles.maxHint}>
          Maximum {formatContributionPkr(maxContribution)} (remaining goal after others who paid)
        </Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="e.g. 5000"
        placeholderTextColor={colors.textSecondary}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Text style={styles.organizerPledge}>
        Status:{' '}
        {myPledge?.status === 'accepted'
          ? 'Accepted — complete payment below'
          : myPledge?.status === 'declined'
            ? 'Previously declined — tap Contribute to accept'
            : 'Pending'}
      </Text>
      <Button
        variant="primary"
        fullWidth
        onPress={handleConfirmContribution}
        disabled={submitting}
        style={styles.primaryBtn}
      >
        {submitting ? 'Please wait…' : 'Contribute'}
      </Button>
      <TouchableOpacity onPress={handleDecline} disabled={submitting}>
        <Text style={styles.declineText}>Decline</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RespondContributionInvite;
