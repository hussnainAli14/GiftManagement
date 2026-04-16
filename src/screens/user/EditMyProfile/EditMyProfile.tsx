import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { getMyProfileApi, updateMyProfileApi, uploadMyAvatarApi, type UserProfile } from '../../../api/userApi';
import { DatePicker, Dropdown, TextInput } from '../../../components';
import { colors } from '../../../theme';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';
import { styles } from './styles';

type ProfileStackParamList = {
  EditMyProfile: undefined;
};

const EditMyProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'EditMyProfile'>>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [dob, setDob] = useState<Date | null>(null);

  const [form, setForm] = useState<Partial<UserProfile>>({
    name: '',
    phone: '',
    avatar: '',
    gender: '',
    birthdate: '',
  });

  const parseBirthdate = (raw: unknown): Date | null => {
    const s = typeof raw === 'string' ? raw.trim() : '';
    if (!s) return null;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  const formatBirthdate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMyProfileApi();
        if (cancelled) return;
        const parsedDob = parseBirthdate(me?.birthdate);
        setDob(parsedDob);
        setForm({
          name: me?.name || '',
          phone: me?.phone || '',
          avatar: me?.avatar || '',
          gender: me?.gender || '',
          birthdate: me?.birthdate || '',
        });
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = (form.name || 'User').trim() || 'User';
  const avatarSource = useMemo(
    () => getAvatarImageSource(avatarBroken ? '' : form.avatar, displayName),
    [avatarBroken, form.avatar, displayName],
  );

  const update = useCallback((patch: Partial<UserProfile>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    if (patch.avatar !== undefined) setAvatarBroken(false);
  }, []);

  const pickAvatar = useCallback(async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });
      if (res.didCancel) return;
      const asset = res.assets?.[0];
      const uri = asset?.uri;
      if (!uri) {
        Alert.alert('Could not select image', 'Please try again.');
        return;
      }
      setSaving(true);
      const serverAvatar = await uploadMyAvatarApi(uri);
      update({ avatar: serverAvatar });
    } catch {
      Alert.alert('Could not open gallery', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [update]);

  const onSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateMyProfileApi({
        name: String(form.name || '').trim(),
        phone: String(form.phone || '').trim(),
        avatar: String(form.avatar || '').trim(),
        gender: String(form.gender || '').trim(),
        birthdate: String(form.birthdate || '').trim(),
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save profile', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  }, [form, navigation]);

  const genderOptions = useMemo(
    () => [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ],
    [],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={avatarSource} style={styles.avatar} onError={() => setAvatarBroken(true)} />
            </View>
            <TouchableOpacity style={styles.avatarPickBtn} activeOpacity={0.85} onPress={pickAvatar}>
              <Icon name="photo-library" size={18} color={colors.white} />
              <Text style={styles.avatarPickBtnText}>
                {String(form.avatar || '').trim() ? 'Change photo' : 'Choose photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            label="Name"
            value={String(form.name || '')}
            onChangeText={(t) => update({ name: t })}
            placeholder="Your name"
            leftIcon={<Icon name="person" size={20} color={colors.primaryMuted} />}
            textColor={colors.notificationGray}
            placeholderTextColor={colors.textSecondary}
            inputStyle={styles.bigInputText}
          />

          <TextInput
            label="Phone"
            value={String(form.phone || '')}
            onChangeText={(t) => update({ phone: t })}
            placeholder="(123) 456-7890"
            leftIcon={<Icon name="phone" size={20} color={colors.primaryMuted} />}
            textColor={colors.notificationGray}
            placeholderTextColor={colors.textSecondary}
            inputStyle={styles.bigInputText}
            keyboardType="phone-pad"
          />

          <Dropdown
            label="Gender"
            placeholder="Select gender"
            data={genderOptions}
            value={String(form.gender || '')}
            onChange={(v) => update({ gender: String(v) })}
            textColor={colors.notificationGray}
            placeholderTextColor={colors.textSecondary}
            selectedTextStyle={styles.bigInputText}
          />

          <DatePicker
            label="Date of Birth"
            placeholder="Pick date of birth"
            value={dob || undefined}
            onChange={(d) => {
              setDob(d);
              update({ birthdate: formatBirthdate(d) });
            }}
            maximumDate={new Date()}
            textColor={colors.notificationGray}
            placeholderTextColor={colors.textSecondary}
            selectedTextStyle={styles.bigInputText}
            leftIcon={<Icon name="calendar-today" size={18} color={colors.primaryMuted} />}
          />

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={onSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default EditMyProfile;

