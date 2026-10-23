import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getMyVendorProfileApi,
  updateVendorProfileApi,
  type VendorModel,
} from '../../../api/vendorApi';
import { useAuth } from '../../../context/AuthContext';
import { colors } from '../../../theme';
import { styles } from './styles';
import { formatBusinessCityCountry } from '../../../utils/formatEnglishBusinessAddress';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';

type VendorProfileStackParamList = {
  VendorProfile: undefined;
  MyReviews: undefined;
};

function labelOrDash(v: unknown): string {
  const s = String(v ?? '').trim();
  return s || '—';
}

export const VendorProfile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<VendorProfileStackParamList, 'VendorProfile'>>();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [vendor, setVendor] = useState<VendorModel | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [businessNameDraft, setBusinessNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const v = await getMyVendorProfileApi();
        if (!cancelled) {
          setVendor(v);
          setBusinessNameDraft(String(v?.businessName || v?.name || '').trim());
        }
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

  const title = useMemo(
    () => vendor?.businessName || user?.name || vendor?.name || 'Vendor',
    [user?.name, vendor?.businessName, vendor?.name],
  );
  const businessAddress = useMemo(
    () => formatBusinessCityCountry(vendor ?? {}) ?? vendor?.businessAddress,
    [vendor],
  );

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const startEditName = () => {
    setBusinessNameDraft(String(vendor?.businessName || vendor?.name || '').trim());
    setEditingName(true);
  };

  const cancelEditName = () => {
    setBusinessNameDraft(String(vendor?.businessName || vendor?.name || '').trim());
    setEditingName(false);
  };

  const saveBusinessName = async () => {
    if (!vendor?._id || savingName) return;
    const nextName = businessNameDraft.trim();
    if (nextName.length < 2) {
      Alert.alert('Invalid name', 'Business name must be at least 2 characters.');
      return;
    }

    setSavingName(true);
    try {
      const updated = await updateVendorProfileApi(vendor._id, {
        businessName: nextName,
        name: nextName,
      });
      setVendor(updated);
      setBusinessNameDraft(String(updated.businessName || nextName).trim());
      setEditingName(false);
      Alert.alert('Saved', 'Your vendor name was updated.');
    } catch (e) {
      Alert.alert(
        'Could not save',
        e instanceof Error ? e.message : 'Unable to update vendor name.',
      );
    } finally {
      setSavingName(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

        <TouchableOpacity
          style={styles.menuRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MyReviews')}
        >
          <View style={styles.menuRowIcon}>
            <Icon name="rate-review" size={22} color={colors.darkGray} />
          </View>
          <View style={styles.menuRowContent}>
            <Text style={styles.menuRowTitle}>My Reviews</Text>
            <Text style={styles.menuRowSubtitle}>Ratings and reviews from customers</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.darkGray} />
        </TouchableOpacity>

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
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Business name</Text>
                  {!editingName ? (
                    <TouchableOpacity
                      onPress={startEditName}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.editIconButton}
                    >
                      <Icon name="edit" size={18} color={colors.darkGray} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {editingName ? (
                  <View>
                    <TextInput
                      style={styles.nameInput}
                      value={businessNameDraft}
                      onChangeText={setBusinessNameDraft}
                      placeholder="Enter business name"
                      placeholderTextColor={colors.darkGray}
                      autoCapitalize="words"
                      autoFocus
                      editable={!savingName}
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={cancelEditName}
                        disabled={savingName}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.saveButton, savingName ? styles.saveButtonDisabled : null]}
                        onPress={saveBusinessName}
                        disabled={savingName}
                      >
                        {savingName ? (
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <Text style={styles.saveButtonText}>Save</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.value}>{labelOrDash(vendor?.businessName)}</Text>
                )}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Business address</Text>
                <Text style={styles.value}>{labelOrDash(businessAddress)}</Text>
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
                Tap the edit icon next to Business name to update how customers see your store.
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
