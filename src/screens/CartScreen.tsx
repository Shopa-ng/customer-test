import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp } from '../types/navigation';
import { COLORS } from '../constants/theme';
import { ScreenHeader, BottomNavBar } from '../components';
import { useCartStore } from '../store/cart.store';

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const navBarHeight = Math.max(insets.bottom, 20) + 65;

  const { items, incrementQuantity, decrementQuantity, removeItem, getSubtotal } = useCartStore();
  const subTotal = getSubtotal();

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Cart" />

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={64} color={COLORS.textSecondary} />
          <Text className="mt-4 text-lg text-text-secondary text-center">
            Your cart is empty
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-xl bg-primary px-8 py-3"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-base font-plus-semibold text-white">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-4 pt-6"
            contentContainerStyle={{ paddingBottom: navBarHeight + 80 }}
          >
            {items.map((item) => (
              <View
                key={item.id}
                className="mb-4 flex-row overflow-hidden rounded-xl bg-main-bg border border-primary p-3 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1.5,
                }}
              >
                {/* Product Image */}
                <View className="h-24 w-24 overflow-hidden rounded-lg bg-gray-50">
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      className="h-full w-full"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center">
                      <Ionicons name="image-outline" size={24} color={COLORS.textSecondary} />
                    </View>
                  )}
                </View>

                {/* Details */}
                <View className="ml-3 flex-1 justify-between py-1">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-2">
                        <Text className="text-base font-plus-medium text-text-primary">
                          {item.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        className="p-1"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <Text className="mt-1 text-sm text-text-secondary">
                      {item.vendorName}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-lg font-plus-bold text-primary-light">
                      {'\u20A6'} {item.price.toLocaleString()}
                    </Text>

                    {/* Quantity Controls */}
                    <View className="flex-row items-center space-x-3">
                      <TouchableOpacity
                        onPress={() => decrementQuantity(item.id)}
                        className="h-7 w-7 items-center justify-center rounded-lg bg-main-bg border border-neutral-200"
                      >
                        <Ionicons name="remove" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>

                      <Text className="text-base font-plus-medium text-text-primary w-4 text-center">
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => incrementQuantity(item.id)}
                        className="h-7 w-7 items-center justify-center rounded-lg border border-neutral-200"
                      >
                        <Ionicons name="add" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Sticky Footer */}
          <View
            className="absolute left-0 right-0 px-6 bg-transparent"
            style={{ bottom: navBarHeight + 12 }}
          >
            <View className="flex-row items-center space-x-4">
              <View className="w-[40%]">
                <Text className="text-sm text-text-secondary">Sub Total:</Text>
                <Text className="text-2xl font-plus-bold text-text-primary mt-1">
                  {'\u20A6'} {subTotal.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                className="flex-1 items-center justify-center rounded-xl bg-primary"
                style={{ height: 53 }}
                onPress={() => navigation.navigate('Checkout', { subtotal: subTotal })}
              >
                <Text className="text-base font-plus-semibold text-white">
                  Continue to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <BottomNavBar activeTab="Cart" />
    </View>
  );
};

export default CartScreen;
