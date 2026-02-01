import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Check if current screen wants to hide the tab bar
  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute.key]?.options;
  const routeName = currentRoute.name;
  // Get focused screen name from nested stack (e.g. Events stack has EventsMain, PersonsWishlist)
  const nestedState = currentRoute.state as { routes: { name: string }[]; index: number } | undefined;
  const focusedNestedRoute = nestedState?.routes?.[nestedState.index];
  const activeScreenName = focusedNestedRoute?.name ?? routeName;

  // Hide tab bar for specific screens (including nested stack screens)
  const screensToHideTabBar = ['FriendProfile', 'PersonsWishlist', 'GiftOptions', 'SelectVendor', 'ConfirmOrder', 'Payment', 'OrderConfirmed', 'ContributionProgress', 'ContributionSuccess', 'MyOrders', 'OrderDetail', 'ChangePassword'];

  const tabBarStyle = currentOptions?.tabBarStyle as { display?: string } | undefined;
  const shouldHideTabBar =
    screensToHideTabBar.includes(activeScreenName) ||
    screensToHideTabBar.includes(routeName) ||
    tabBarStyle?.display === 'none';

  if (shouldHideTabBar) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconColor = isFocused ? colors.primary : '#000000';
        const textColor = isFocused ? colors.primary : '#000000';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {typeof options.tabBarIcon === 'function' && (
              <View style={styles.iconContainer}>
                {options.tabBarIcon({
                  focused: isFocused,
                  color: iconColor,
                  size: 24,
                })}
              </View>
            )}
            <Text style={[styles.label, { color: textColor }]}>
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1,
    borderTopColor: colors.darkGray,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: typography.fontWeight.medium as '500',
  },
});

export default BottomTabBar;
