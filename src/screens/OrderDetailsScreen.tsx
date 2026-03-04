import React from 'react';
import { View, Text, ScrollView, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp, RootStackParamList } from '../types/navigation';

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
  icon 
}) => {
  const color = isRejected ? COLORS.error : (isCompleted || isActive) ? COLORS.primary : COLORS.gray;
  return (
    <View className="flex-row">
      {/* Timeline Line & Icon */}
      <View className="items-center mr-4">
        {/* Top Line */}
        {!isLast && (
           <View style={{ width: 2, height: 24, backgroundColor: isCompleted ? (isRejected ? COLORS.error : COLORS.primary) : 'transparent' }} />
        )}
        
        {/* Icon */}
        <View className="z-10 bg-main-bg py-1">
             <Ionicons 
                name={icon as any} 
                size={24} 
                color={color} 
             />
        </View>

        {/* Bottom Line (connects to next step) */}
        {!isLast && (
          <View style={{ width: 2, height: 40, backgroundColor: isCompleted ? (isRejected ? COLORS.error : COLORS.primary) : COLORS.gray }} />
        )}
      </View>

      {/* Content */}
      <View className="pb-8 justify-center">
        <Text style={{ color }} className="font-plus-bold text-base">
          {label}
        </Text>
        {time && (
          <Text className="text-gray text-sm mt-0.5 font-plus-medium">
            {time}
          </Text>
        )}
      </View>
    </View>
  );
};

const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderDetailsRouteProp>();
  const { orderId, status } = route.params;

  const buildSteps = () => {
    if (status === 'Canceled') {
      return [
        { label: 'Pending Confirmation', time: '20-10-2026, 3:40pm', completed: true, icon: 'clipboard-outline' },
        { label: 'Order Rejected', time: '20-10-2026, 6:50pm', completed: true, icon: 'close-outline', rejected: true },
        { label: 'Expected Delivery', time: 'Expected Delivery', completed: false, icon: 'bicycle-outline' },
        { label: 'Delivered', completed: false, icon: 'checkmark-outline' },
      ];
    }
    if (status === 'Completed') {
      return [
        { label: 'Pending Confirmation', time: '20-10-2026, 3:40pm', completed: true, icon: 'clipboard-outline' },
        { label: 'Order Confirmed', time: '20-10-2026, 5:03pm', completed: true, icon: 'person-outline' },
        { label: 'Expected Delivery', time: 'On or before 23-10-2026, 5:03pm', completed: true, icon: 'bicycle-outline' },
        { label: 'Delivered', time: '22-10-2026, 2:00pm', completed: true, icon: 'checkmark-outline' },
      ];
    }
    return [
      { label: 'Pending Confirmation', time: '20-10-2026, 3:40pm', completed: true, icon: 'clipboard-outline' },
      { label: 'Order Confirmed', time: '20-10-2026, 5:03pm', completed: true, icon: 'person-outline' },
      { label: 'Expected Delivery', time: 'On or before 23-10-2026, 5:03pm', completed: false, icon: 'bicycle-outline', active: true },
      { label: 'Delivered', completed: false, icon: 'checkmark-outline' },
    ];
  };

  const order = {
    id: orderId,
    date: '20-10-2026',
    items: [
      { name: '2x Primark Shirt', price: 50000, image: require('../../assets/product-shirt.png') }
    ],
    delivery: {
      name: 'Esther Esther',
      address: 'Room 3, Female Block'
    },
    subtotal: 50000,
    serviceFee: 5000,
    total: 60000,
    status,
    steps: buildSteps()
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <ScreenHeader 
        title="Order History"
        showBack={true} 
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Order Info Header */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-2xl font-plus-bold text-text-primary mb-1">
            Order #{order.id}
          </Text>
          <Text className="text-gray text-base font-plus-medium">
            Placed on {order.date}
          </Text>
        </View>

        {/* Timeline */}
        <View className="px-6 py-6">
          {order.steps.map((step, index) => (
            <OrderStep
              key={index}
              label={step.label}
              time={step.time}
              isCompleted={step.completed}
              isLast={index === order.steps.length - 1}
              isActive={(step as any).active === true}
              isRejected={(step as any).rejected === true}
              icon={step.icon}
            />
          ))}
        </View>

        {/* Order Details */}
        <View className="px-6 mb-6">
          <Text className="text-text-primary font-plus-bold text-lg mb-4">
            Order Details
          </Text>
          {order.items.map((item, index) => (
            <View key={index} className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-gray-light/20 rounded-lg items-center justify-center mr-4">
                <Image source={item.image} className="w-12 h-12" resizeMode="contain" />
              </View>
              <View>
                <Text className="text-text-primary font-plus-medium text-base mb-1">
                  {item.name}
                </Text>
                <Text className="text-text-primary font-plus-bold text-base">
                  ₦ {item.price.toLocaleString()}
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
          <Text className="text-text-primary text-base mb-1">{order.delivery.name}</Text>
          <Text className="text-text-primary text-base">{order.delivery.address}</Text>
        </View>

        <View className="px-6 mb-8">
          {order.status === 'Completed' ? (
            <>
              <Button title="Raise Order Dispute" onPress={() => navigation.navigate('RaiseOrderDispute')} />
              <Text className="text-center text-sm text-gray mt-3 px-4 leading-4">
                Please note that orders can only be disputed within 24hours of receiving order.
              </Text>
            </>
          ) : null}
        </View>

      </ScrollView>
      <SafeAreaView edges={['bottom']} className="px-6 pt-4">
        <View className="bg-main-bg rounded-t-3xl shadow-lg p-6">
          <View className="flex-row justify-between mb-3">
            <Text className="text-text-primary font-plus-medium text-base">Subtotal</Text>
            <Text className="text-text-primary font-plus-bold text-base">₦ {order.subtotal.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-light">
            <Text className="text-text-primary font-plus-medium text-base">Service fee (7.5%)</Text>
            <Text className="text-text-primary font-plus-bold text-base">₦ {order.serviceFee.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-primary font-plus-bold text-lg">TOTAL</Text>
            <Text className="text-text-primary font-plus-bold text-lg">₦ {order.total.toLocaleString()}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OrderDetailsScreen;
