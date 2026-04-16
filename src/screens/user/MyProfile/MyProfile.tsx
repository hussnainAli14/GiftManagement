import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMyProfileApi, type UserProfile } from '../../../api/userApi';
import { colors } from '../../../theme';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';
import { styles } from './styles';

type ProfileStackParamList = {
  MyProfile: undefined;
  EditMyProfile: undefined;
};

const MyProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'MyProfile'>>();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await getMyProfileApi();
      setMe(profile);
      setAvatarBroken(false);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const displayName = (me?.name || 'User').trim() || 'User';
  const avatarSource = useMemo(
    () => getAvatarImageSource(avatarBroken ? '' : me?.avatar, displayName),
    [avatarBroken, me?.avatar, displayName],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <Image
                source={avatarSource}
                style={styles.avatar}
                onError={() => setAvatarBroken(true)}
              />
            </View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{me?.email || ''}</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditMyProfile')}
          >
            <Icon name="edit" size={18} color={colors.white} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Details</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{me?.phone?.trim() || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{me?.gender?.trim() || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Birthdate</Text>
              <Text style={styles.value}>{me?.birthdate?.trim() || '—'}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyProfile;

