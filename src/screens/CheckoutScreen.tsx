import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants/theme';
import { ScreenHeader, Button } from '../components';
import { RadioOption, Checkbox } from '../ui';
import { NavigationProp } from '../types/navigation';
import { calculateServiceFee, calculateTotal } from '../utils/fees';
import { formatNaira } from '../utils/currency';
import {
  DeliveryType,
  PaymentMethod,
  getSavedDeliveryInfo,
  saveDeliveryInfo,
  clearSavedDeliveryInfo,
  getPickupLocations,
} from '../services/checkout';
import { useCartStore } from '../store/cart.store';
import { createOrder, initializePayment, verifyPayment } from '../api/orders.api';

type RouteParams = {
  Checkout: {
    subtotal: number;
  };
};

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'Checkout'>>();
  const subtotal = route.params?.subtotal ?? 0;
  const insets = useSafeAreaInsets();
  const { items, clearCart } = useCartStore();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [address, setAddress] = useState('');
  const [hasSavedDeliveryInfo, setHasSavedDeliveryInfo] = useState(false);
  const [saveInfoChecked, setSaveInfoChecked] = useState(false);
  const [useAnotherAddressChecked, setUseAnotherAddressChecked] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<{ label: string; value: string }[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string | null>(null);

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  useEffect(() => {
    getSavedDeliveryInfo().then((info) => {
      if (info) {
        setHasSavedDeliveryInfo(true);
        setAddress(info.address);
      }
    });
    getPickupLocations().then((list) => {
      setPickupLocations(list.map((l) => ({ label: l.name, value: l.id })));
    });
  }, []);

  useEffect(() => {
    if (hasSavedDeliveryInfo) setSaveInfoChecked(false);
  }, [hasSavedDeliveryInfo]);

  useEffect(() => {
    if (useAnotherAddressChecked) {
      setAddress('');
      setHasSavedDeliveryInfo(false);
      clearSavedDeliveryInfo();
    }
  }, [useAnotherAddressChecked]);

  const fee = useMemo(() => calculateServiceFee(subtotal), [subtotal]);
  const total = useMemo(() => calculateTotal(subtotal, fee), [subtotal, fee]);

  const handleMakePayment = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      Alert.alert('Missing Address', 'Please enter a delivery address.');
      return;
    }

    if (deliveryType === 'pickup' && !selectedPickupLocation) {
      Alert.alert('Missing Location', 'Please select a pickup location.');
      return;
    }

    setIsProcessing(true);

    try {
      // Save delivery info if checked
      if (deliveryType === 'delivery' && saveInfoChecked && address.trim()) {
        await saveDeliveryInfo({ address: address.trim(), savedAt: new Date().toISOString() });
        setHasSavedDeliveryInfo(true);
      }

      // Group cart items by vendor (backend requires single vendor per order)
      const vendorGroups: Record<string, typeof items> = {};
      items.forEach((item) => {
        if (!vendorGroups[item.vendorId]) vendorGroups[item.vendorId] = [];
        vendorGroups[item.vendorId].push(item);
      });

      const vendorIds = Object.keys(vendorGroups);

      if (vendorIds.length > 1) {
        Alert.alert(
          'Multiple Vendors',
          'Your cart has items from different vendors. Currently, each order must be from one vendor. Please remove items from one vendor and try again.',
        );
        setIsProcessing(false);
        return;
      }

      // Create order
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const order = await createOrder({
        items: orderItems,
        deliveryAddress: deliveryType === 'delivery' ? address.trim() : undefined,
        deliveryMethod: deliveryType,
        notes: deliveryType === 'pickup' && selectedPickupLocation
          ? `Pickup location: ${selectedPickupLocation}`
          : undefined,
      });

      // Initialize Paystack payment
      const payment = await initializePayment(order.id);

      setPaymentReference(payment.reference);
      setPaymentUrl(payment.authorizationUrl);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to process payment';
      Alert.alert('Payment Error', Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle WebView navigation to detect payment completion
  const handleWebViewNavigationChange = async (navState: any) => {
    const { url } = navState;

    if (!url) return;

    // Detect Paystack completion — matches callback URL or any redirect away from paystack.co
    const isCallback = url.includes('callback') || url.includes('close');
    const isRedirectFromPaystack = url.includes('trxref=') || url.includes('reference=');
    
    if (isCallback || isRedirectFromPaystack) {
      setPaymentUrl(null);

      if (paymentReference) {
        try {
          const result = await verifyPayment(paymentReference);
          if (result.status === 'HELD' || result.status === 'success') {
            clearCart();
            navigation.navigate('Success', {
              message: 'Payment successful! Your order has been placed and the vendor has been notified.',
              navigateTo: 'Home',
              variant: 'plain',
            });
          } else {
            Alert.alert('Payment Pending', 'Your payment is being processed. You can check the status in your order history.');
            navigation.navigate('OrderHistory');
          }
        } catch {
          // Even if verify fails, the webhook will handle it
          clearCart();
          navigation.navigate('Success', {
            message: 'Your order has been placed! You will receive a confirmation once payment is verified.',
            navigateTo: 'Home',
            variant: 'plain',
          });
        }
      }
    }
  };

  // ─── Paystack WebView Modal ───
  if (paymentUrl) {
    return (
      <Modal visible animationType="slide" onRequestClose={() => setPaymentUrl(null)}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-light">
            <Text className="text-lg font-plus-semibold text-text-primary">Complete Payment</Text>
            <Button
              title="Cancel"
              onPress={() => {
                setPaymentUrl(null);
                Alert.alert('Payment Cancelled', 'Your order has been created but not paid. You can pay later from your order history.');
              }}
              className="px-4"
            />
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleWebViewNavigationChange}
            startInLoadingState
            renderLoading={() => (
              <View className="absolute inset-0 items-center justify-center bg-white">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="mt-3 text-base text-text-secondary">Loading payment page...</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Checkout" showBack />

      <View className="flex-1">
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="mb-6">
            <Text className="mb-2 text-base font-plus-medium text-text-primary">
              Select Delivery Type<Text className="text-accent">*</Text>
            </Text>
            <RadioOption
              label="Pickup"
              selected={deliveryType === 'pickup'}
              onPress={() => setDeliveryType('pickup')}
            />
            <RadioOption
              label="Delivery"
              selected={deliveryType === 'delivery'}
              onPress={() => setDeliveryType('delivery')}
            />
          </View>

          {deliveryType === 'delivery' ? (
            <View className="mb-6">
              <Text className="mb-2 text-base font-plus-medium text-text-primary">
                Enter delivery address<Text className="text-accent">*</Text>
              </Text>
              <TextInput
                className="rounded-xl border border-gray-light px-3 py-3 text-sm text-text-primary min-h-[100px]"
                value={address}
                onChangeText={setAddress}
                placeholder={
                  hasSavedDeliveryInfo ? undefined : 'Enter your delivery address within your school...'
                }
                placeholderTextColor={COLORS.textSecondary}
                multiline
                textAlignVertical="top"
              />
              {hasSavedDeliveryInfo ? (
                <Checkbox
                  label="Use another delivery address"
                  checked={useAnotherAddressChecked}
                  onToggle={() => setUseAnotherAddressChecked((prev) => !prev)}
                />
              ) : (
                <Checkbox
                  label="Save delivery info"
                  checked={saveInfoChecked}
                  onToggle={() => setSaveInfoChecked((prev) => !prev)}
                />
              )}
              <Text className="mt-2 text-sm leading-[18px] text-text-secondary">
                Please note that your delivery will take between 24-72 hours after order confirmation
              </Text>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="mb-2 text-base font-plus-medium text-text-primary">
                Select Pickup Location<Text className="text-accent">*</Text>
              </Text>
              {pickupLocations.map((loc) => (
                <RadioOption
                  key={loc.value}
                  label={loc.label}
                  selected={selectedPickupLocation === loc.value}
                  onPress={() => setSelectedPickupLocation(loc.value)}
                />
              ))}
              <Text className="mt-2 text-sm leading-[18px] text-text-secondary">
                Please note that your delivery will take between 24-72 hours after order confirmation
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="mb-1 text-base font-plus-medium text-text-primary">
              Choose Payment Method<Text className="text-accent">*</Text>
            </Text>
            <RadioOption
              label="Transfer"
              selected={paymentMethod === 'transfer'}
              onPress={() => setPaymentMethod('transfer')}
            />
          </View>
        </ScrollView>

        <SafeAreaView
          edges={['bottom']}
          className="bg-main-bg pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
        >
          <View className="px-6" style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}>
            <View className="mb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-text-primary">Subtotal</Text>
                <Text className="text-lg font-plus-bold text-text-primary">{formatNaira(subtotal)}</Text>
              </View>
              <View className="mt-1 flex-row items-center justify-between">
                <Text className="text-base text-text-secondary">Service fee (7.5%)</Text>
                <Text className="text-lg font-plus-bold text-text-primary">{formatNaira(fee)}</Text>
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-base font-plus-bold text-text-primary">TOTAL</Text>
                <Text className="text-lg font-plus-bold text-text-primary">{formatNaira(total)}</Text>
              </View>
            </View>

            <Button
              title={isProcessing ? 'Processing...' : 'Make Payment'}
              onPress={handleMakePayment}
              loading={isProcessing}
              disabled={isProcessing}
              className="w-full"
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default CheckoutScreen;
