import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StatusBar, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { ScreenHeader, Button } from '../components';
import { RadioOption, Checkbox } from '../ui';
import { NavigationProp} from '../types/navigation';
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

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [address, setAddress] = useState('');
  const [hasSavedDeliveryInfo, setHasSavedDeliveryInfo] = useState(false);
  const [saveInfoChecked, setSaveInfoChecked] = useState(false);
  const [useAnotherAddressChecked, setUseAnotherAddressChecked] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<{ label: string; value: string }[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string | null>(null);

  useEffect(() => {
    getSavedDeliveryInfo().then((info) => {
      if (info) {
        setHasSavedDeliveryInfo(true);
        setAddress(info.address);
      } else {
        setHasSavedDeliveryInfo(false);
      }
    });
    getPickupLocations().then((list) => {
      setPickupLocations(list.map((l) => ({ label: l.name, value: l.id })));
    });
  }, []);

  useEffect(() => {
    if (hasSavedDeliveryInfo) {
      setSaveInfoChecked(false);
    }
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
    if (deliveryType === 'delivery') {
      if (saveInfoChecked && address.trim().length > 0) {
        await saveDeliveryInfo({ address: address.trim(), savedAt: new Date().toISOString() });
        setHasSavedDeliveryInfo(true);
      }
    }
    navigation.navigate('Success', {
      message: 'Your order has been successfully sent! You will receive an order confirmation email soon.',
      navigateTo: 'Home',
      variant: 'plain',
    });
  };

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
                hasSavedDeliveryInfo
                  ? undefined
                  : 'Enter your delivery address within your school...'
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
              Please note that your delivery will take between 24–72 hours after order confirmation
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
              Please note that your delivery will take between 24–72 hours after order confirmation
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
          <View
            className="px-6"
            style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}
          >
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

            <Button title="Make Payment" onPress={handleMakePayment} className="w-full" />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
;

export default CheckoutScreen;
