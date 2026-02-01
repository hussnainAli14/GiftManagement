import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';

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

const MOCK_USERS: VendorUserItem[] = [
  { id: '1', name: 'Ahmed Khan', email: 'ahmed.khan@example.com', status: 'Active', avatarUri: 'https://picsum.photos/seed/user1/96/96' },
  { id: '2', name: 'Fatima Zahra', email: 'fatima.zahra@example.com', status: 'Suspended', avatarUri: 'https://picsum.photos/seed/user2/96/96' },
  { id: '3', name: 'Omar Abdullah', email: 'omar.abdullah@example.com', status: 'Active', avatarUri: 'https://picsum.photos/seed/user3/96/96' },
  { id: '4', name: 'Aisha Malik', email: 'aisha.malik@example.com', status: 'Active', avatarUri: 'https://picsum.photos/seed/user4/96/96' },
  { id: '5', name: 'Bilal Hassan', email: 'bilal.hassan@example.com', status: 'Suspended', avatarUri: 'https://picsum.photos/seed/user5/96/96' },
  { id: '6', name: 'Noor Ali', email: 'noor.ali@example.com', status: 'Active', avatarUri: 'https://picsum.photos/seed/user6/96/96' },
  { id: '7', name: 'Yasir Javed', email: 'yasir.javed@example.com', status: 'Active', avatarUri: 'https://picsum.photos/seed/user7/96/96' },
];

const Users = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [userToView, setUserToView] = useState<VendorUserItem | null>(null);
  const [userToBan, setUserToBan] = useState<VendorUserItem | null>(null);

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        source={{ uri: item.avatarUri ?? 'https://picsum.photos/seed/avatar/96/96' }}
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
