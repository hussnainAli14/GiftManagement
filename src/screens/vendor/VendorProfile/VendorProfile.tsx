import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMyVendorProfileApi, type VendorModel } from '../../../api/vendorApi';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';

function labelOrDash(v: unknown): string {
  const s = String(v ?? '').trim();
  return s || '—';
}

export const VendorProfile = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [vendor, setVendor] = useState<VendorModel | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const v = await getMyVendorProfileApi();
        if (!cancelled) setVendor(v);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const title = useMemo(() => user?.name || vendor?.name || 'Vendor', [user?.name, vendor?.name]);

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Image
            source={getAvatarImageSource(undefined, title)}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>{title}</Text>
            <Text style={styles.email} numberOfLines={1}>{labelOrDash(user?.email)}</Text>
            <View style={styles.badgesRow}>
              <View style={[styles.badge, vendor?.isApproved ? styles.badgeApproved : styles.badgePending]}>
                <Text style={styles.badgeText}>{vendor?.isApproved ? 'Approved' : 'Pending approval'}</Text>
              </View>
              <View style={styles.badgeGhost}>
                <Text style={styles.badgeGhostText}>{(vendor?.category || 'other').toString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <TouchableOpacity style={styles.errorCard} activeOpacity={0.8} onPress={() => {}}>
            <Text style={styles.errorTitle}>Couldn&apos;t load profile</Text>
            <Text style={styles.errorBody}>{error}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Business name</Text>
                <Text style={styles.value}>{labelOrDash(vendor?.businessName)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Business address</Text>
                <Text style={styles.value}>{labelOrDash(vendor?.businessAddress)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{labelOrDash(vendor?.category)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{labelOrDash(vendor?.description)}</Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Icon name="info" size={18} color={colors.textSecondary} />
              <Text style={styles.tipText}>
                Your profile details come from your vendor registration and can be enhanced later.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, loggingOut ? styles.logoutButtonDisabled : null]}
              activeOpacity={0.85}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Icon name="logout" size={20} color={colors.white} />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default VendorProfile;

