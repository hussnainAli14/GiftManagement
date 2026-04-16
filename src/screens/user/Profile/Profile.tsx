import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../../context/AuthContext';
import {
  getMyProfileApi,
  updateMyProfileApi,
  registerDeviceTokenApi,
  removeDeviceTokenApi,
} from '../../../api/userApi';
import { getFcmToken, requestUserPermission } from '../../../notifications/push';
import { styles } from './styles';
import { colors } from '../../../theme';

type ProfileStackParamList = {
  ProfileMain: undefined;
  ChangePassword: undefined;
  MyProfile: undefined;
  EditMyProfile: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

type SettingRowProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLogout?: boolean;
};

const SettingRow = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  isLogout,
}: SettingRowProps) => {
  const content = (
    <>
      <View style={[styles.rowIcon, isLogout && styles.rowLogoutIcon]}>
        <Icon
          name={icon as any}
          size={22}
          color={isLogout ? colors.errorRed : colors.darkGray}
        />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, isLogout && styles.rowLogoutTitle]}>{title}</Text>
        <Text style={[styles.rowSubtitle, isLogout && styles.rowLogoutSubtitle]}>{subtitle}</Text>
      </View>
      {rightElement != null ? <View style={styles.rowRight}>{rightElement}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.row, isLogout && styles.rowLogout]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.row, isLogout && styles.rowLogout]}>{content}</View>;
};

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>>();
  const { logout } = useAuth();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [loadingNotifPref, setLoadingNotifPref] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMyProfileApi();
        if (cancelled) return;
        setNotificationsOn(me.notificationsEnabled !== false);
      } catch {
        // keep default
      } finally {
        if (!cancelled) setLoadingNotifPref(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleNotifications = useCallback(
    async (next: boolean) => {
      setNotificationsOn(next);
      try {
        await updateMyProfileApi({ notificationsEnabled: next });

        // Best-effort: register/unregister token so server can push in background
        const token = await getFcmToken().catch(() => '');
        if (token) {
          if (next) {
            const granted = await requestUserPermission();
            if (!granted) {
              setNotificationsOn(false);
              await updateMyProfileApi({ notificationsEnabled: false });
              Alert.alert('Notifications disabled', 'Permission was not granted.');
              return;
            }
            await registerDeviceTokenApi(token);
          } else {
            await removeDeviceTokenApi(token);
          }
        }
      } catch (e) {
        setNotificationsOn(!next);
        Alert.alert('Could not update notifications', e instanceof Error ? e.message : 'Please try again.');
      }
    },
    []
  );

  const handleLogout = async () => {
    await logout();
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleManageAccount = () => {
    navigation.navigate('MyProfile');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleTerms = () => {
    navigation.navigate('TermsOfService');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Account & Security</Text>
        <SettingRow
          icon="people-outline"
          title="Manage Account"
          subtitle="Update personal info and preferences"
          onPress={handleManageAccount}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />
        <SettingRow
          icon="credit-card"
          title="Payment Methods"
          subtitle="Add or manage your payment options"
          onPress={() => {}}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />
        <SettingRow
          icon="lock-outline"
          title="Change Password"
          subtitle="Update your account password"
          onPress={handleChangePassword}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />

        <Text style={styles.sectionTitle}>General Preferences</Text>
        <SettingRow
          icon="notifications-none"
          title="Notifications"
          subtitle="Manage alerts and sounds"
          rightElement={
            <Switch
              value={notificationsOn}
              onValueChange={toggleNotifications}
              disabled={loadingNotifPref}
              trackColor={{ false: colors.borderGray, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
        <SettingRow
          icon="language"
          title="Language"
          subtitle="English (US)"
          onPress={() => {}}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />

        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <SettingRow
          icon="verified-user"
          title="Privacy Policy"
          subtitle="Understand how your data is handled"
          onPress={handlePrivacyPolicy}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />
        <SettingRow
          icon="description"
          title="Terms of Service"
          subtitle="Read our terms and conditions"
          onPress={handleTerms}
          rightElement={<Icon name="chevron-right" size={24} color={colors.darkGray} />}
        />

        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={[styles.row, styles.rowLogout]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={styles.rowLogoutIcon}>
            <Icon name="logout" size={22} color={colors.errorRed} />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.rowLogoutTitle}>Logout</Text>
            <Text style={styles.rowLogoutSubtitle}>Sign out from your account</Text>
          </View>
          <Text style={styles.logoutRightText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
