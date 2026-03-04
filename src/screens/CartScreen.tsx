import React, { useState } from 'react';
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

interface CartItem {
  id: string;
  name: string;
  author: string;
  merchant: string;
  price: number;
  quantity: number;
  image: any;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  // Nav bar height: pill (~65px) + bottom safe area + 20px minimum padding
  const navBarHeight = Math.max(insets.bottom, 20) + 65;
  // Dummy data matching the image
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'New School Physics',
      author: 'Textbook by J. K. Rowlings',
      merchant: 'BM Bookstores',
      price: 25000,
      quantity: 1,
      image: require('../../assets/product-book.png'), // Assuming this asset exists from HomeScreen
    },
    {
      id: '2',
      name: 'New School Physics',
      author: 'Textbook by J. K. Rowlings',
      merchant: 'BM Bookstores',
      price: 25000,
      quantity: 1,
      image: require('../../assets/product-book.png'),
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Cart"  />

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: navBarHeight + 80 }}
      >
        {cartItems.map((item) => (
          <View
            key={item.id}
            className="mb-4 flex-row overflow-hidden rounded-xl bg-main-bg border border-primary p-3 shadow-sm"
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1.5,
            }}
          >
            {/* Product Image */}
            <View className="h-24 w-24 overflow-hidden rounded-lg bg-gray-50">
              <Image
                source={item.image}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>

            {/* Details */}
            <View className="ml-3 flex-1 justify-between py-1">
              <View>
                <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                        <Text className="text-base font-plus-medium text-text-primary">
                        {item.name}
                        </Text>
                        <Text className="text-base font-plus-medium text-text-primary mt-0.5">
                        {item.author}
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
                  {item.merchant}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-4">
                <Text className="text-lg font-plus-bold text-primary-light">
                  ₦ {item.price.toLocaleString()}
                </Text>

                {/* Quantity Controls */}
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    className="h-7 w-7 items-center justify-center rounded-lg bg-main-bg border border-neutral-200"
                  >
                    <Ionicons name="remove" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>

                  <Text className="text-base font-plus-medium text-text-primary w-4 text-center">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    className="h-7 w-7 items-center justify-center  rounded-lg border border-neutral-200"
                  >
                    <Ionicons name="add" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Sticky Footer — floats above the nav bar */}
      <View
        className="absolute left-0 right-0 px-6 bg-transparent"
        style={{ bottom: navBarHeight + 12 }}
      >
        <View className="flex-row items-center space-x-4">
          <View className="w-[40%]">
            <Text className="text-sm text-text-secondary">Sub Total:</Text>
            <Text className="text-2xl font-plus-bold text-text-primary mt-1">
              ₦ {subTotal.toLocaleString()}
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

      <BottomNavBar activeTab="Cart" />
    </View>
  );
};

export default CartScreen;
