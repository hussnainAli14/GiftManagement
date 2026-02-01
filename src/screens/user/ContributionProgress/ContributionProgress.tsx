import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { parsePrice } from '../ConfirmOrder/types';
import { styles } from './styles';
import { DUMMY_CONTRIBUTORS } from './types';
import type { ContributionProgressParams } from './types';
import { colors, typography } from '../../../theme';

type ContributionProgressRouteProp = RouteProp<
  { params: ContributionProgressParams },
  'params'
>;

type ContributionProgressStackParamList = {
  ContributionProgress: ContributionProgressParams;
  Payment: {
    amount: number;
    description: string;
    isFullGift: boolean;
    isContribution?: boolean;
    eventTitle?: string;
  };
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

const ContributionProgress = () => {
  const route = useRoute<ContributionProgressRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ContributionProgressStackParamList, 'ContributionProgress'>>();
  const { item, eventTitle } = route.params ?? {};

  const total = useMemo(() => (item ? parsePrice(item.price) : 0), [item]);
  const step = useMemo(() => Math.round(total * 0.1 * 100) / 100, [total]);
  const alreadyContributed = useMemo(
    () => (item ? Math.round(total * (item.contributedPercent / 100) * 100) / 100 : 0),
    [item, total]
  );

  const [userContribution, setUserContribution] = useState(0);

  const totalContributed = alreadyContributed + userContribution;
  const progressPercent = total > 0 ? (totalContributed / total) * 100 : 0;
  const remaining = Math.round((total - totalContributed) * 100) / 100;

  const canDecrement = userContribution > 0;
  const canIncrement = totalContributed < total;

  const handleDecrement = () => {
    if (!canDecrement) return;
    setUserContribution((prev) => Math.max(0, Math.round((prev - step) * 100) / 100));
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next = Math.round((userContribution + step) * 100) / 100;
    const capped = Math.min(next, total - alreadyContributed);
    setUserContribution(capped);
  };

  const handleConfirmContribution = () => {
    if (!item || userContribution <= 0) return;
    const description = eventTitle
      ? `Contribution to '${item.title}' - ${eventTitle} Wishlist`
      : `Contribution to '${item.title}'`;
    navigation.navigate('Payment', {
      amount: userContribution,
      description,
      isFullGift: false,
      isContribution: true,
      eventTitle,
    });
  };

  if (!item) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contribution Goal card */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Contribution Goal</Text>
          <Text style={styles.goalItemName}>{item.title}</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountCurrent}>{formatPkr(totalContributed)}</Text>
            <Text style={styles.amountTotal}>/ {formatPkr(total)}</Text>
          </View>
          <View style={styles.progressWrapper}>
            <ProgressBar
              progress={progressPercent}
              height={8}
              borderRadius={4}
              fillColor={colors.primary}
              trackColor={colors.gray}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              decrementDisabled={!canDecrement}
              incrementDisabled={!canIncrement}
            />
          </View>
          <View style={styles.remainingRow}>
            <Text style={styles.remainingText}>Remaining: {formatPkr(remaining)}</Text>
            <View style={styles.badgeStillNeeded}>
              <Text style={styles.badgeStillNeededText}>Still Needed</Text>
            </View>
          </View>
        </View>

        {/* Contributors */}
        <Text style={styles.sectionTitle}>Contributors</Text>
        {DUMMY_CONTRIBUTORS.map((c) => (
          <View key={c.id} style={styles.contributorCard}>
            <View style={styles.contributorAvatar} />
            <View style={styles.contributorContent}>
              <Text style={styles.contributorName}>{c.name}</Text>
              <Text style={styles.contributorDate}>{c.date}</Text>
              <Text style={styles.contributorAmount}>{c.amount}</Text>
              <View style={styles.contributorBadge}>
                <Text style={styles.contributorBadgeText}>{c.status}</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: userContribution <= 0 ? 0.6 : 1,
            },
          ]}
          onPress={handleConfirmContribution}
          disabled={userContribution <= 0}
          activeOpacity={0.7}
        >
          <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={14} color={colors.white} />
          </View>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold as '700', color: colors.white }}>Confirm Contribution</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ContributionProgress;
