import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput, Button } from '../../../components';
import { styles } from './styles';

type ChangePasswordStackParamList = {
  ChangePassword: undefined;
};

const ChangePassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ChangePasswordStackParamList, 'ChangePassword'>>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // TODO: Validate and call API; for now just navigate to Home
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('Home');
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
        >
          Change Password
        </Button>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
