import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput, Button } from '../../../components';
import { changePasswordApi } from '../../../api/userApi';
import { styles } from './styles';

type ChangePasswordStackParamList = {
  ChangePassword: undefined;
};

const ChangePassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ChangePasswordStackParamList, 'ChangePassword'>>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (saving) return;
    if (!currentPassword.trim() || !newPassword.trim()) {
      Alert.alert('Missing fields', 'Please fill current and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please confirm your new password.');
      return;
    }
    try {
      setSaving(true);
      await changePasswordApi(currentPassword, newPassword);
      Alert.alert('Password changed', 'Your password was updated successfully.');
      if (navigation.canGoBack()) navigation.goBack();
    } catch (e) {
      Alert.alert('Could not change password', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          containerStyle={styles.inputMargin}
        />
        <TextInput
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          containerStyle={styles.inputMargin}
        />
        <TextInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          containerStyle={styles.inputMargin}
        />
        <Button
          variant="primary"
          fullWidth
          onPress={handleChangePassword}
          style={styles.submitButton}
          disabled={saving}
        >
          Change Password
        </Button>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
