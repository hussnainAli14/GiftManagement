import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

export type VendorApplicationItem = {
  id: string;
  vendorName: string;
  companyName: string;
  email: string;
  appliedDate: string;
};

const MOCK_VENDOR_APPLICATIONS: VendorApplicationItem[] = [
  { id: '1', vendorName: 'Ahmed Khan', companyName: 'Khan Tech Solutions', email: 'ahmed.khan@khantech.com', appliedDate: '2023-10-20' },
  { id: '2', vendorName: 'Fatima Zahra', companyName: 'Zahra Fabrics', email: 'fatima.zahra@zahrafabrics.pk', appliedDate: '2023-10-19' },
  { id: '3', vendorName: 'Mohammed Ali', companyName: 'Ali Arts & Crafts', email: 'mohammed.ali@aliarts.com', appliedDate: '2023-10-18' },
  { id: '4', vendorName: 'Sara Ahmed', companyName: 'Sara Handmade', email: 'sara.ahmed@sarahandmade.pk', appliedDate: '2023-10-17' },
  { id: '5', vendorName: 'Hassan Raza', companyName: 'Raza Electronics', email: 'hassan.raza@razaelectronics.com', appliedDate: '2023-10-16' },
  { id: '6', vendorName: 'Ayesha Malik', companyName: 'Malik Gifts', email: 'ayesha.malik@malikgifts.pk', appliedDate: '2023-10-15' },
  { id: '7', vendorName: 'Omar Farooq', companyName: 'Farooq Trading Co.', email: 'omar.farooq@farooqtrading.com', appliedDate: '2023-10-14' },
];

const Vendors = () => {
  const insets = useSafeAreaInsets();
  const [applications, setApplications] = useState<VendorApplicationItem[]>(MOCK_VENDOR_APPLICATIONS);

  const handleApprove = (item: VendorApplicationItem) => {
    // TODO: API call to approve vendor
    setApplications((prev) => prev.filter((a) => a.id !== item.id));
  };

  const handleDeny = (item: VendorApplicationItem) => {
    // TODO: API call to deny vendor
    setApplications((prev) => prev.filter((a) => a.id !== item.id));
  };

  const renderCard = ({ item }: { item: VendorApplicationItem }) => (
    <View style={styles.card}>
      <Text style={styles.vendorName}>{item.vendorName}</Text>
      <Text style={styles.companyName}>{item.companyName}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <View style={styles.actionRow}>
      <Text style={styles.appliedDate}>Applied on: {item.appliedDate}</Text>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.denyButton}
          onPress={() => handleDeny(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.denyButtonText}>Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Vendors;
