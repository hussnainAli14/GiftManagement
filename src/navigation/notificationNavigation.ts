import type { NavigationProp } from '@react-navigation/native';
import type { BackendNotification } from '../api/notificationApi';
import { navigationRef } from './navigationRef';

export function resolveNotificationKind(n: BackendNotification): string {
  const d = (n.data || {}) as Record<string, string | undefined>;
  if (d.kind) return d.kind;
  if (n.type === 'friend_request' || n.type === 'friend_accepted') return n.type;
  if (n.type === 'friend') {
    if (n.title === 'New Friend Request') return 'friend_request';
    if (n.title === 'Friend Request Accepted') return 'friend_accepted';
  }
  return n.type || '';
}

function navigateTab(
  tabName: string,
  screenName?: string,
  params?: Record<string, unknown>,
) {
  if (navigationRef.isReady()) {
    if (screenName) {
      navigationRef.navigate(tabName as never, { screen: screenName, params } as never);
    } else {
      navigationRef.navigate(tabName as never);
    }
    return;
  }
}

function goTabFromNavigation(
  navigation: NavigationProp<any>,
  tabName: string,
  screenName?: string,
  params?: Record<string, unknown>,
) {
  const parent = navigation.getParent();
  if (parent && screenName) {
    parent.navigate(tabName as never, { screen: screenName, params } as never);
    return;
  }
  if (parent) {
    parent.navigate(tabName as never);
    return;
  }
  if (screenName) {
    navigation.navigate(screenName as never, params as never);
  }
}

export function navigateFromNotification(
  n: BackendNotification,
  navigation?: NavigationProp<any>,
) {
  const d = (n.data || {}) as Record<string, string | undefined>;
  const kind = resolveNotificationKind(n);

  const goTab = (tabName: string, screenName?: string, params?: Record<string, unknown>) => {
    if (navigation) {
      goTabFromNavigation(navigation, tabName, screenName, params);
    } else {
      navigateTab(tabName, screenName, params);
    }
  };

  const stackNavigate = (screenName: string, params?: Record<string, unknown>) => {
    if (navigation) {
      navigation.navigate(screenName as never, params as never);
    } else if (navigationRef.isReady()) {
      navigationRef.navigate(screenName as never, params as never);
    }
  };

  if (kind === 'message' && d.peerUserId && d.peerName) {
    stackNavigate('ChatThread', {
      peerUserId: d.peerUserId,
      peerName: d.peerName,
      peerAvatar: d.peerAvatar || '',
    });
    return;
  }

  if (kind === 'friend_request') {
    if (d.requesterId) {
      goTab('Friends', 'FriendProfile', {
        friendId: d.requesterId,
        friendName: d.requesterName || 'User',
        friendAvatar: d.requesterAvatar || '',
      });
    } else {
      goTab('Friends', 'FriendsMain');
    }
    return;
  }

  if (kind === 'friend_accepted') {
    if (d.friendId) {
      goTab('Friends', 'FriendProfile', {
        friendId: d.friendId,
        friendName: d.friendName || 'Friend',
        friendAvatar: d.friendAvatar || '',
      });
    } else {
      goTab('Friends', 'FriendsMain');
    }
    return;
  }

  if (kind === 'event_reminder') {
    goTab('Events', 'EventsMain');
    return;
  }

  if (kind === 'contribution_invite' && d.campaignId) {
    stackNavigate('RespondContributionInvite', { campaignId: d.campaignId });
    return;
  }

  if (kind === 'contribution_friend_accepted' && d.campaignId) {
    if (d.friendId) {
      stackNavigate('FriendContributionReview', {
        campaignId: d.campaignId,
        revieweeId: d.friendId,
        friendName: d.friendName,
      });
    } else {
      goTab('Home', 'ContributionProgress', {
        wishlistItemId: d.wishlistItemId,
        campaignId: d.campaignId,
      });
    }
    return;
  }

  if (
    kind === 'contribution_friends_ready' ||
    kind === 'contribution_friend_approved' ||
    kind === 'contribution_received'
  ) {
    if (d.wishlistItemId) {
      goTab('Home', 'ContributionProgress', {
        wishlistItemId: d.wishlistItemId,
        campaignId: d.campaignId,
      });
    } else {
      goTab('Home', 'HomeMain');
    }
    return;
  }

  if (kind === 'public_wishlist' || kind === 'friends_wishlist' || kind === 'wishlist_update') {
    goTab('Events', 'EventsMain');
    return;
  }

  if (kind === 'wallet_received' || kind === 'wallet_topup') {
    goTab('Profile', 'WalletMain');
    return;
  }

  if (kind === 'password_changed' || kind === 'profile_updated') {
    goTab('Profile', 'ProfileMain');
    return;
  }

  goTab('Home', 'HomeMain');
}
