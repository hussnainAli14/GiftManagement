import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';

const Success = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleContinueToApp = () => {
    // Navigate to Main navigator (Home screen) by resetting the root navigator
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' as never }],
        })
      );
    } else {
      // Fallback: try navigating directly if getParent doesn't work
      (navigation as any).navigate('Main');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24, paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="star" size={64} color={colors.primary} />
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Account Created Successfully!</Text>

        {/* Description */}
        <Text style={styles.description}>
          You're all set to organize events and connect with friends!
        </Text>

        {/* Continue Button */}
        <Button
          variant="primary"
          fullWidth
          onPress={handleContinueToApp}
          style={styles.continueButton}
        >
          Continue to App
        </Button>
      </ScrollView>
    </View>
  );
};

export default Success;
