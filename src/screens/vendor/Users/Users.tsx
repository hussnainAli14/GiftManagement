import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import { getAllUsersAdminApi, type UserProfile } from '../../../api/userApi';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';

export type UserStatus = 'Active' | 'Suspended';

export type VendorUserItem = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  avatarUri?: string;
  phone?: string;
  joinedDate?: string;
};

function toVendorUserItem(u: UserProfile): VendorUserItem {
  return {
    id: String(u._id),
    name: String(u.name || 'User'),
    email: String(u.email || ''),
    status: 'Active',
    avatarUri: typeof u.avatar === 'string' ? u.avatar : undefined,
    phone: u.phone,
    joinedDate: undefined,
  };
}

const Users = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [userToView, setUserToView] = useState<VendorUserItem | null>(null);
  const [userToBan, setUserToBan] = useState<VendorUserItem | null>(null);
  const [users, setUsers] = useState<VendorUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await getAllUsersAdminApi();
        const mapped = all.map(toVendorUserItem);
        if (!cancelled) setUsers(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleViewPress = (user: VendorUserItem) => {
    setUserToView(user);
  };

  const handleViewClose = () => {
    setUserToView(null);
  };

  const handleBanPress = (user: VendorUserItem) => {
    setUserToBan(user);
  };

  const handleBanCancel = () => {
    setUserToBan(null);
  };

  const handleBanConfirm = () => {
    // TODO: API call to ban user
    setUserToBan(null);
  };

  const renderStatus = (status: UserStatus) => (
    <View style={status === 'Active' ? styles.statusActive : styles.statusSuspended}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );

  const renderUserRow = ({ item }: { item: VendorUserItem }) => (
    <View style={styles.userRow}>
      <Image
        source={getAvatarImageSource(item.avatarUri, item.name)}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
        {renderStatus(item.status)}
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleViewPress(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="visibility" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleBanPress(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="block" size={22} color={colors.errorRed} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search
            placeholder="Search by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => {}} activeOpacity={0.7}>
          <Icon name="filter-list" size={20} color={colors.textSecondary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserRow}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading users…</Text>
            </View>
          ) : error ? (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No users found.</Text>
            </View>
          )
        }
      />

      {/* View user details popup */}
      <Modal
        visible={userToView !== null}
        transparent
        animationType="fade"
        onRequestClose={handleViewClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleViewClose}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>User Details</Text>
            {userToView && (
              <>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Name</Text>
                  <Text style={styles.modalDetailValue}>{userToView.name}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Email</Text>
                  <Text style={styles.modalDetailValue}>{userToView.email}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Status</Text>
                  <Text style={styles.modalDetailValue}>{userToView.status}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Ban confirmation popup */}
      <Modal
        visible={userToBan !== null}
        transparent
        animationType="fade"
        onRequestClose={handleBanCancel}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleBanCancel}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              Are you sure you want to ban this user?
            </Text>
            {userToBan && (
              <Text style={[styles.modalDetailValue, { marginBottom: 16 }]}>
                {userToBan.name} ({userToBan.email})
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleBanCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleBanConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Users;
