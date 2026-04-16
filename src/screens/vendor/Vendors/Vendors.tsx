import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { getAdminsApi, type UserProfile } from '../../../api/userApi';
import { colors } from '../../../theme';

export type VendorApplicationItem = {
  id: string;
  vendorName: string;
  companyName: string;
  email: string;
  appliedDate: string;
};

function toAdminItem(u: UserProfile): VendorApplicationItem {
  return {
    id: String(u._id),
    vendorName: String(u.name || 'Admin'),
    companyName: 'Administrator',
    email: String(u.email || ''),
    appliedDate: '',
  };
}

const Vendors = () => {
  const insets = useSafeAreaInsets();
  const [admins, setAdmins] = useState<VendorApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getAdminsApi();
        const mapped = list.map(toAdminItem);
        if (!cancelled) setAdmins(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load admins.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = (item: VendorApplicationItem) => {
    // Intentionally no-op for now (admins list).
    setAdmins((prev) => prev.filter((a) => a.id !== item.id));
  };

  const handleDeny = (item: VendorApplicationItem) => {
    // Intentionally no-op for now (admins list).
    setAdmins((prev) => prev.filter((a) => a.id !== item.id));
  };

  const renderCard = ({ item }: { item: VendorApplicationItem }) => (
    <View style={styles.card}>
      <Text style={styles.vendorName}>{item.vendorName}</Text>
      <Text style={styles.companyName}>{item.companyName}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <View style={styles.actionRow}>
      <Text style={styles.appliedDate}>Role: ADMIN</Text>
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
        data={admins}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading admins…</Text>
            </View>
          ) : error ? (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No admins found.</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Vendors;
