import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: April 16, 2026</Text>

        <Text style={styles.h2}>Overview</Text>
        <Text style={styles.p}>
          This is placeholder text for the Privacy Policy page. Replace this content with your actual
          privacy policy before shipping to production.
        </Text>

        <Text style={styles.h2}>What we collect</Text>
        <Text style={styles.p}>
          - Account information (name, email, phone){'\n'}- Profile details you choose to provide
          {'\n'}- App activity required to provide features (events, wishlists, messages)
        </Text>

        <Text style={styles.h2}>How we use information</Text>
        <Text style={styles.p}>
          We use data to operate the app features, secure your account, and improve reliability and
          performance.
        </Text>

        <Text style={styles.h2}>Contact</Text>
        <Text style={styles.p}>For questions, contact: support@example.com</Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

