import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import { parsePrice } from './types';
import type { ConfirmOrderParams } from './types';
import { colors } from '../../../theme';
import { getUserByIdApi, type UserProfile } from '../../../api/userApi';
import { getVendorByIdApi } from '../../../api/vendorApi';
import { createDirectGiftOrderApi, createWishlistGiftOrderApi } from '../../../api/orderApi';
import { getCheckoutOfferApi, type CheckoutOffer } from '../../../api/rewardApi';
import { getEnglishCityCountryForUser } from '../../../utils/formatEnglishUserAddress';
import { formatBusinessCityCountry } from '../../../utils/formatEnglishBusinessAddress';

type ConfirmOrderStackParamList = {
  ConfirmOrder: ConfirmOrderParams;
  OrderConfirmed: undefined;
  ProductReview: {
    orderId: string;
    productId?: string;
    productName?: string;
  };
};

type ConfirmOrderRouteProp = RouteProp<
  { params: ConfirmOrderParams },
  'params'
>;

const SHIPPING_RATE = 0.07;
const TAX_RATE = 0.085;
/** Matches backend GIFT_WRAPPING_FEE (PKR). */
const GIFT_WRAPPING_FEE = 250;
/** Matches backend DIGITAL_GIFT_CARD_FEE (PKR). */
const DIGITAL_GIFT_CARD_FEE = 150;

type DigitalGiftCardTheme = 'classic' | 'birthday' | 'thank_you' | 'celebration';

const DIGITAL_CARD_THEMES: { id: DigitalGiftCardTheme; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'thank_you', label: 'Thank You' },
  { id: 'celebration', label: 'Celebration' },
];

function labelOrDash(value: string | undefined): string {
  const trimmed = String(value ?? '').trim();
  return trimmed || '—';
}

const ConfirmOrder = () => {
  const route = useRoute<ConfirmOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ConfirmOrderStackParamList, 'ConfirmOrder'>>();
  const { item, vendor, eventTitle, directGift, productId, recipientUserId, recipientName: giftRecipientName } =
    route.params ?? {};

  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);
  const [vendorCityLabel, setVendorCityLabel] = useState(vendor?.cityLabel || '');
  const [loadingDetails, setLoadingDetails] = useState(Boolean(recipientUserId || vendor?.id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutOffer, setCheckoutOffer] = useState<CheckoutOffer | null>(null);
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [digitalGiftCard, setDigitalGiftCard] = useState(false);
  const [digitalGiftCardTheme, setDigitalGiftCardTheme] =
    useState<DigitalGiftCardTheme>('classic');
  const [digitalGiftCardMessage, setDigitalGiftCardMessage] = useState('');

  useEffect(() => {
    if (!recipientUserId && !vendor?.id) {
      setLoadingDetails(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingDetails(true);
      try {
        if (recipientUserId) {
          const user = await getUserByIdApi(recipientUserId);
          if (!cancelled) setRecipientProfile(user);
        }
        if (vendor?.id && !vendor.cityLabel) {
          const vendorDoc = await getVendorByIdApi(vendor.id);
          const city = formatBusinessCityCountry(vendorDoc);
          if (!cancelled && city) setVendorCityLabel(city);
        } else if (vendor?.cityLabel) {
          setVendorCityLabel(vendor.cityLabel);
        }
      } catch {
        if (!cancelled && vendor?.cityLabel) {
          setVendorCityLabel(vendor.cityLabel);
        }
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [recipientUserId, vendor?.id, vendor?.cityLabel]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const offer = await getCheckoutOfferApi();
        if (!cancelled) {
          setCheckoutOffer(offer);
          setApplyCoupon(Boolean(offer.eligible));
        }
      } catch {
        if (!cancelled) setCheckoutOffer(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recipientName = labelOrDash(giftRecipientName || recipientProfile?.name);
  const recipientCity = useMemo(() => {
    if (recipientProfile) {
      return getEnglishCityCountryForUser(recipientProfile);
    }
    return '—';
  }, [recipientProfile]);

  const displayVendorCity = labelOrDash(vendorCityLabel || vendor?.cityLabel);

  const imageSource =
    typeof item?.image === 'string' ? { uri: item.image } : item?.image;
  const subtotal = parsePrice(item?.price ?? '0');
  const shipping = Math.round(subtotal * SHIPPING_RATE * 100) / 100;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const wrappingFee = giftWrapping ? GIFT_WRAPPING_FEE : 0;
  const digitalCardFee = digitalGiftCard ? DIGITAL_GIFT_CARD_FEE : 0;
  const preDiscountTotal =
    Math.round((subtotal + shipping + tax + wrappingFee + digitalCardFee) * 100) / 100;

  const discountPercent =
    applyCoupon && checkoutOffer?.eligible ? checkoutOffer.discountPercent : 0;
  const discountAmount =
    discountPercent > 0
      ? Math.round(((preDiscountTotal * discountPercent) / 100) * 100) / 100
      : 0;
  const total = Math.round((preDiscountTotal - discountAmount) * 100) / 100;

  const formatPkr = (n: number) =>
    `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

  const handleSubmitOrder = useCallback(async () => {
    if (!item || !vendor) return;

    const cityOnly = recipientCity !== '—' ? recipientCity.split(',')[0]?.trim() : '';
    const deliveryAddress = recipientCity !== '—' ? recipientCity : undefined;

    const giftMessage = directGift && giftRecipientName
      ? `Gift for ${giftRecipientName}: ${item.title}`
      : eventTitle
        ? `For ${item.title} - ${eventTitle} Wishlist`
        : `For ${item.title}`;

    const deliveryFields = {
      deliveryRecipientName: recipientName !== '—' ? recipientName : undefined,
      deliveryAddress,
      deliveryCity: cityOnly || undefined,
      customerPhone: recipientProfile?.phone?.trim() || undefined,
    };

    const shouldApplyCoupon = Boolean(applyCoupon && checkoutOffer?.eligible);

    setIsSubmitting(true);
    try {
      let order;
      if (directGift) {
        if (!productId || !recipientUserId) {
          Alert.alert('Order failed', 'Gift details are missing. Please go back and try again.');
          return;
        }
        order = await createDirectGiftOrderApi({
          recipientId: recipientUserId,
          productId,
          vendorId: vendor.id,
          totalAmount: preDiscountTotal,
          giftMessage,
          applyRewardCoupon: shouldApplyCoupon,
          giftWrapping,
          digitalGiftCard,
          digitalGiftCardMessage: digitalGiftCard
            ? digitalGiftCardMessage.trim() || undefined
            : undefined,
          digitalGiftCardTheme: digitalGiftCard ? digitalGiftCardTheme : undefined,
          ...deliveryFields,
        });
      } else {
        order = await createWishlistGiftOrderApi({
          wishlistItemId: item.id,
          vendorId: vendor.id,
          totalAmount: preDiscountTotal,
          giftMessage,
          applyRewardCoupon: shouldApplyCoupon,
          giftWrapping,
          digitalGiftCard,
          digitalGiftCardMessage: digitalGiftCard
            ? digitalGiftCardMessage.trim() || undefined
            : undefined,
          digitalGiftCardTheme: digitalGiftCard ? digitalGiftCardTheme : undefined,
          ...deliveryFields,
        });
      }

      const parts: string[] = [];
      if (order.giftWrapping) {
        parts.push(
          `Gift wrapping added${
            order.giftWrappingFee ? ` (${formatPkr(order.giftWrappingFee)})` : ''
          }.`,
        );
      }
      if (order.digitalGiftCard) {
        parts.push(
          `Digital gift card sent${
            order.digitalGiftCardFee ? ` (${formatPkr(order.digitalGiftCardFee)})` : ''
          }.`,
        );
      }
      if (order.discountPercent && order.discountAmount) {
        parts.push(
          `Coupon ${order.couponCode || ''} saved you ${formatPkr(order.discountAmount)} (${order.discountPercent}% off).`,
        );
      }
      if (order.pointsRedeemed && order.pointsRedeemed > 0) {
        parts.push(`${order.pointsRedeemed} reward points were redeemed.`);
      }
      if (order.pointsAwarded && order.pointsAwarded > 0) {
        parts.push(`You earned ${order.pointsAwarded} reward points!`);
      }

      navigation.replace('OrderConfirmed' as never, {
        orderId: order._id,
        productId: directGift ? productId : undefined,
        productName: item.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        summary: parts.length ? parts.join('\n') : undefined,
      } as never);
    } catch (error) {
      Alert.alert(
        'Order failed',
        error instanceof Error ? error.message : 'Unable to place this order. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    item,
    vendor,
    recipientCity,
    directGift,
    giftRecipientName,
    eventTitle,
    recipientName,
    recipientProfile?.phone,
    applyCoupon,
    checkoutOffer?.eligible,
    giftWrapping,
    digitalGiftCard,
    digitalGiftCardMessage,
    digitalGiftCardTheme,
    productId,
    recipientUserId,
    preDiscountTotal,
    navigation,
  ]);

  if (!item || !vendor) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gift Details</Text>
          <View style={styles.giftRow}>
            <Image
              source={imageSource}
              style={styles.giftImage}
              resizeMode="cover"
            />
            <View style={styles.giftContent}>
              <Text style={styles.giftName} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.giftMeta}>Quantity: 1</Text>
              <Text style={styles.giftPrice}>{item.price}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vendor</Text>
          <View style={styles.infoRow}>
            <Icon name="store" size={18} color={colors.darkGray} />
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{vendor.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={18} color={colors.darkGray} />
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{displayVendorCity}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Receiver</Text>
          {loadingDetails ? (
            <ActivityIndicator color={colors.primary} style={styles.detailsLoader} />
          ) : (
            <>
              <View style={styles.infoRow}>
                <Icon name="person" size={18} color={colors.darkGray} />
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{recipientName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="location-on" size={18} color={colors.darkGray} />
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{recipientCity}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gift Wrapping</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setGiftWrapping((v) => !v)}
            style={[styles.wrapCard, giftWrapping && styles.wrapCardActive]}
          >
            <View style={styles.couponHeader}>
              <View style={[styles.couponBadge, styles.wrapBadge]}>
                <Icon name="card-giftcard" size={18} color={colors.white} />
              </View>
              <View style={styles.couponTextWrap}>
                <Text style={styles.couponTitle}>Add gift wrapping</Text>
                <Text style={styles.couponSubtitle}>
                  Premium wrap & ribbon · {formatPkr(GIFT_WRAPPING_FEE)}
                </Text>
              </View>
              <Switch
                value={giftWrapping}
                onValueChange={setGiftWrapping}
                trackColor={{ false: colors.borderGray, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <Text style={styles.couponHint}>
              Your gift will arrive wrapped and ready to present.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Digital Gift Card</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setDigitalGiftCard((v) => !v)}
            style={[styles.wrapCard, digitalGiftCard && styles.wrapCardActive]}
          >
            <View style={styles.couponHeader}>
              <View style={[styles.couponBadge, styles.digitalCardBadge]}>
                <Icon name="mail-outline" size={18} color={colors.white} />
              </View>
              <View style={styles.couponTextWrap}>
                <Text style={styles.couponTitle}>Send digital gift card</Text>
                <Text style={styles.couponSubtitle}>
                  E-card delivered instantly · {formatPkr(DIGITAL_GIFT_CARD_FEE)}
                </Text>
              </View>
              <Switch
                value={digitalGiftCard}
                onValueChange={setDigitalGiftCard}
                trackColor={{ false: colors.borderGray, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <Text style={styles.couponHint}>
              The recipient gets a digital card with your personal message.
            </Text>
          </TouchableOpacity>

          {digitalGiftCard ? (
            <View style={styles.digitalCardExtras}>
              <Text style={styles.themeLabel}>Card theme</Text>
              <View style={styles.themeRow}>
                {DIGITAL_CARD_THEMES.map((theme) => {
                  const selected = digitalGiftCardTheme === theme.id;
                  return (
                    <TouchableOpacity
                      key={theme.id}
                      style={[styles.themeChip, selected && styles.themeChipActive]}
                      onPress={() => setDigitalGiftCardTheme(theme.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.themeChipText, selected && styles.themeChipTextActive]}>
                        {theme.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.themeLabel}>Personal message</Text>
              <TextInput
                style={styles.digitalMessageInput}
                value={digitalGiftCardMessage}
                onChangeText={setDigitalGiftCardMessage}
                placeholder="Write a short note for your gift card..."
                placeholderTextColor={colors.darkGray}
                multiline
                maxLength={500}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reward Coupon</Text>
          {checkoutOffer?.eligible ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setApplyCoupon((v) => !v)}
              style={[styles.couponCard, applyCoupon && styles.couponCardActive]}
            >
              <View style={styles.couponHeader}>
                <View style={styles.couponBadge}>
                  <Icon name="local-offer" size={18} color={colors.white} />
                </View>
                <View style={styles.couponTextWrap}>
                  <Text style={styles.couponTitle}>
                    {checkoutOffer.couponCode} · {checkoutOffer.discountPercent}% off
                  </Text>
                  <Text style={styles.couponSubtitle}>
                    {checkoutOffer.rewardPoints.toLocaleString()} points · uses{' '}
                    {checkoutOffer.pointsCostToRedeem} points
                  </Text>
                </View>
                <Switch
                  value={applyCoupon}
                  onValueChange={setApplyCoupon}
                  trackColor={{ false: colors.borderGray, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              <Text style={styles.couponHint}>
                Higher reward points unlock higher discounts (max {checkoutOffer.maxDiscountPercent}%).
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.couponEmpty}>
              {checkoutOffer?.description ||
                'Earn reward points on purchases to unlock checkout coupons (max 50% off).'}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>{formatPkr(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>{formatPkr(shipping)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>{formatPkr(tax)}</Text>
          </View>
          {wrappingFee > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Gift wrapping</Text>
              <Text style={styles.priceValue}>{formatPkr(wrappingFee)}</Text>
            </View>
          ) : null}
          {digitalCardFee > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Digital gift card</Text>
              <Text style={styles.priceValue}>{formatPkr(digitalCardFee)}</Text>
            </View>
          ) : null}
          {discountAmount > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.discountLabel}>
                Discount ({discountPercent}% · {checkoutOffer?.couponCode})
              </Text>
              <Text style={styles.discountValue}>-{formatPkr(discountAmount)}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPkr(total)}</Text>
          </View>
        </View>

        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmitOrder}
          style={styles.proceedButton}
          disabled={loadingDetails || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default ConfirmOrder;
