import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';

const TermsOfService = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.updated}>Last updated: April 16, 2026</Text>

        <Text style={styles.h2}>Summary</Text>
        <Text style={styles.p}>
          This is placeholder text for the Terms of Service page. Replace it with your actual terms
          before launching the app.
        </Text>

        <Text style={styles.h2}>Using the app</Text>
        <Text style={styles.p}>
          By using the app, you agree to follow applicable laws and not misuse the platform.
        </Text>

        <Text style={styles.h2}>Accounts</Text>
        <Text style={styles.p}>
          You are responsible for maintaining the security of your account and the accuracy of the
          information you provide.
        </Text>

        <Text style={styles.h2}>Contact</Text>
        <Text style={styles.p}>For questions, contact: support@example.com</Text>
      </ScrollView>
    </View>
  );
};

export default TermsOfService;

