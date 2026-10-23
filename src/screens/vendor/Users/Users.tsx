import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Search } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import {
  getAppUsersDirectoryApi,
  type AppUserDirectoryEntry,
} from '../../../api/userApi';
import { getAvatarImageSource } from '../../../utils/resolveUserAvatar';

type CitySection = {
  title: string;
  data: AppUserDirectoryEntry[];
};

const Users = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AppUserDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const rows = await getAppUsersDirectoryApi();
      setUsers(rows);
    } catch (e) {
      setUsers([]);
      setError(e instanceof Error ? e.message : 'Could not load users.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sections = useMemo((): CitySection[] => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q) ||
            (u.area || '').toLowerCase().includes(q),
        )
      : users;

    const byCity = new Map<string, AppUserDirectoryEntry[]>();
    for (const user of filtered) {
      const city = (user.city || 'Unknown City').trim() || 'Unknown City';
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city)!.push(user);
    }

    return [...byCity.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({
        title,
        data: [...data].sort((x, y) => x.name.localeCompare(y.name)),
      }));
  }, [users, searchQuery]);

  const totalShown = useMemo(
    () => sections.reduce((sum, s) => sum + s.data.length, 0),
    [sections],
  );

  const renderUserRow = ({ item }: { item: AppUserDirectoryEntry }) => (
    <View style={styles.userRow}>
      <Image
        source={getAvatarImageSource(item.avatar || undefined, item.name)}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.area ? (
          <Text style={styles.userEmail} numberOfLines={1}>
            {item.area}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search
            placeholder="Search by name or city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {!loading && !error ? (
        <Text style={styles.summaryText}>
          {totalShown} user{totalShown === 1 ? '' : 's'} · {sections.length} cit
          {sections.length === 1 ? 'y' : 'ies'}
        </Text>
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={renderUserRow}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Icon name="location-city" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
          sections.length === 0 ? { flexGrow: 1 } : null,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading users…</Text>
            </View>
          ) : error ? (
            <TouchableOpacity style={{ paddingTop: 24 }} onPress={() => load()} activeOpacity={0.8}>
              <Text style={{ color: colors.errorRed, textAlign: 'center' }}>{error}</Text>
              <Text style={{ color: colors.primary, textAlign: 'center', marginTop: 8 }}>
                Tap to retry
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ paddingTop: 24 }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                No users found.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Users;
