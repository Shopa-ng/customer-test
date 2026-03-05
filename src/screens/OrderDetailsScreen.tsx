import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp, RootStackParamList } from '../types/navigation';
import { getOrderById, Order } from '../api/orders.api';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

interface OrderStepProps {
  label: string;
  time?: string;
  isCompleted: boolean;
  isLast?: boolean;
  isActive?: boolean;
  isRejected?: boolean;
  icon: string;
}

const OrderStep: React.FC<OrderStepProps> = ({
  label,
  time,
  isCompleted,
  isLast,
  isActive,
  isRejected,
  icon,
}) => {
  const color = isRejected
    ? COLORS.error
    : isCompleted || isActive
    ? COLORS.primary
    : COLORS.gray;

  return (
    <View className="flex-row">
      <View className="items-center mr-4">
        {!isLast && (
          <View
            style={{
              width: 2,
              height: 24,
              backgroundColor: isCompleted
                ? isRejected
                  ? COLORS.error
                  : COLORS.primary
                : 'transparent',
            }}
          />
        )}
        <View className="z-10 bg-main-bg py-1">
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        {!isLast && (
          <View
            style={{
              width: 2,
              height: 40,
              backgroundColor: isCompleted
                ? isRejected
                  ? COLORS.error
                  : COLORS.primary
                : COLORS.gray,
            }}
          />
        )}
      </View>
      <View className="pb-8 justify-center">
        <Text style={{ color }} className="font-plus-bold text-base">
          {label}
        </Text>
        {time && (
          <Text className="text-gray text-sm mt-0.5 font-plus-medium">{time}</Text>
        )}
      </View>
    </View>
  );
};

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function buildSteps(order: Order) {
  const status = order.status;
  const placed = formatDateTime(order.createdAt);

  const statusOrder = ['PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED'];
  const reached = (s: string) => statusOrder.indexOf(order.status) >= statusOrder.indexOf(s);

  if (status === 'CANCELLED') {
    return [
      { label: 'Order Placed', time: placed, completed: true, icon: 'clipboard-outline' },
      { label: 'Order Cancelled', time: formatDateTime(order.updatedAt), completed: true, icon: 'close-outline', rejected: true },
      { label: 'Expected Delivery', completed: false, icon: 'bicycle-outline' },
      { label: 'Delivered', completed: false, icon: 'checkmark-outline' },
    ];
  }

  return [
    { label: 'Order Placed', time: placed, completed: true, icon: 'clipboard-outline' },
    { label: 'Order Confirmed', time: reached('CONFIRMED') ? formatDateTime(order.updatedAt) : undefined, completed: reached('CONFIRMED'), icon: 'person-outline', active: status === 'PAID' },
    { label: 'Out for Delivery', time: reached('SHIPPED') ? formatDateTime(order.updatedAt) : undefined, completed: reached('SHIPPED'), icon: 'bicycle-outline', active: status === 'CONFIRMED' },
    { label: 'Delivered', time: reached('DELIVERED') ? formatDateTime(order.updatedAt) : undefined, completed: reached('DELIVERED') || reached('COMPLETED'), icon: 'checkmark-outline', active: status === 'SHIPPED' },
  ];
}

const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderDetailsRouteProp>();
  const { orderId, status } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <View className="flex-1 bg-main-bg">
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <ScreenHeader title="Order History" showBack={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 bg-main-bg">
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <ScreenHeader title="Order History" showBack={true} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray text-base text-center">
            {error ?? 'Order not found.'}
          </Text>
        </View>
      </View>
    );
  }

  const steps = buildSteps(order);
  const subtotal = parseFloat(order.totalAmount);
  const serviceFee = Math.round(subtotal * 0.075);
  const total = subtotal + serviceFee;

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Order History" showBack={true} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Order Info Header */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-2xl font-plus-bold text-text-primary mb-1">
            Order #{order.id.slice(-8).toUpperCase()}
          </Text>
          <Text className="text-gray text-base font-plus-medium">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Timeline */}
        <View className="px-6 py-6">
          {steps.map((step, index) => (
            <OrderStep
              key={index}
              label={step.label}
              time={step.time}
              isCompleted={step.completed}
              isLast={index === steps.length - 1}
              isActive={(step as any).active === true}
              isRejected={(step as any).rejected === true}
              icon={step.icon}
            />
          ))}
        </View>

        {/* Order Items */}
        <View className="px-6 mb-6">
          <Text className="text-text-primary font-plus-bold text-lg mb-4">
            Order Details
          </Text>
          {order.orderItems.map((item, index) => (
            <View key={index} className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-gray-light/20 rounded-lg items-center justify-center mr-4 overflow-hidden">
                {item.product.images?.[0] ? (
                  <Image
                    source={{ uri: item.product.images[0] }}
                    className="w-14 h-14"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="cube-outline" size={32} color={COLORS.gray} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-plus-medium text-base mb-1">
                  {item.quantity}x {item.product.name}
                </Text>
                <Text className="text-text-primary font-plus-bold text-base">
                  ₦ {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Details */}
        <View className="px-6 mb-8">
          <Text className="text-text-primary font-plus-bold text-lg mb-2">
            Delivery Details
          </Text>
          {order.deliveryAddress ? (
            <Text className="text-text-primary text-base">{order.deliveryAddress}</Text>
          ) : (
            <Text className="text-gray text-base">No delivery address provided</Text>
          )}
          {order.deliveryMethod && (
            <Text className="text-gray text-sm mt-1">{order.deliveryMethod}</Text>
          )}
        </View>

        {/* Dispute Button for completed orders */}
        <View className="px-6 mb-8">
          {status === 'Completed' && (
            <>
              <Button
                title="Raise Order Dispute"
                onPress={() => navigation.navigate('RaiseOrderDispute')}
              />
              <Text className="text-center text-sm text-gray mt-3 px-4 leading-4">
                Please note that orders can only be disputed within 24 hours of receiving order.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* Price Summary */}
      <SafeAreaView edges={['bottom']} className="px-6 pt-4">
        <View className="bg-main-bg rounded-t-3xl shadow-lg p-6">
          <View className="flex-row justify-between mb-3">
            <Text className="text-text-primary font-plus-medium text-base">Subtotal</Text>
            <Text className="text-text-primary font-plus-bold text-base">
              ₦ {subtotal.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-light">
            <Text className="text-text-primary font-plus-medium text-base">Service fee (7.5%)</Text>
            <Text className="text-text-primary font-plus-bold text-base">
              ₦ {serviceFee.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-primary font-plus-bold text-lg">TOTAL</Text>
            <Text className="text-text-primary font-plus-bold text-lg">
              ₦ {total.toLocaleString()}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OrderDetailsScreen;
