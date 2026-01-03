import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const categories: Category[] = [
    { id: '1', name: 'Clothing', icon: 'shirt-outline' },
    { id: '2', name: 'Stationery', icon: 'book-outline' },
    { id: '3', name: 'Stationery', icon: 'book-outline' },
    { id: '4', name: 'Stationery', icon: 'book-outline' },
  ];

  const [popularProducts, _setPopularProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'New School Physics',
      price: 25000,
      image: require('../../assets/product-book.png'),
    },
    {
      id: '2',
      name: 'PRIMARK Shirt',
      price: 25000,
      image: require('../../assets/product-shirt.png'),
    },
    {
      id: '3',
      name: 'New School Physics',
      price: 25000,
      image: require('../../assets/product-book.png'),
    },
  ]);

  const [forYouProducts, _setForYouProducts] = useState<Product[]>([
    {
      id: '4',
      name: 'PRIMARK Shirt',
      price: 25000,
      image: require('../../assets/product-shirt.png'),
    },
    {
      id: '5',
      name: 'New School Physics',
      price: 25000,
      image: require('../../assets/product-book.png'),
    },
    {
      id: '6',
      name: 'New School Physics',
      price: 25000,
      image: require('../../assets/product-book.png'),
    },
  ]);

  // Filter products based on search query
  const filteredPopularProducts = popularProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredForYouProducts = forYouProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCategoryPress = (categoryName: string) => {
    console.log('Category pressed:', categoryName);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleSeeAll = (section: string) => {
    if (section === 'popular') {
      navigation.navigate('PopularInSchool');
    }
  };

  const renderProductCard = (product: Product, _section: 'popular' | 'forYou') => (
    <TouchableOpacity
      key={product.id}
      className="mr-4 w-[160px]"
      onPress={() => handleProductPress(product.id)}
    >
      <View className="relative mb-2 h-[160px] w-full overflow-hidden">
        <Image source={product.image} className="h-full w-full" resizeMode="cover" />
        <TouchableOpacity
          className={`absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full p-1 ${
            isFavorite(product.id) ? 'bg-primary-4' : 'bg-main-bg'
          }`}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons name={'heart-outline'} size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text className="mb-1 text-sm text-text-primary" numberOfLines={1}>
        {product.name}
      </Text>
      <Text className="text-sm font-plus-bold text-text-primary">
        ₦{product.price.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View className="bg-primary-light px-6 pb-4 pt-12 rounded-b-xl">
        {/* Logo */}
        <View className="mb-4 items-center">
          <Logo size="small" />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center rounded-xl bg-white px-4">
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            className="ml-2 flex-1 py-4 text-sm text-text-primary"
            placeholder="Search for any item..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Categories */}
        <View className="px-6 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-plus-semibold text-text-primary">Categories</Text>
            <TouchableOpacity>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="mr-3 flex-row items-center rounded-lg bg-primary-4 px-4 py-2"
                onPress={() => handleCategoryPress(category.name)}
              >
                <Ionicons name={category.icon as any} size={16} color={COLORS.primary} />
                <Text className="ml-2 text-sm text-primary-light">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular in your school */}
        <View className="py-4">
          <View className="mb-3 flex-row items-center justify-between px-6">
            <Text className="text-lg font-plus-semibold text-text-primary">
              Popular in your school
            </Text>
            <TouchableOpacity onPress={() => handleSeeAll('popular')}>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6"
          >
            {filteredPopularProducts.map((product) => renderProductCard(product, 'popular'))}
          </ScrollView>
        </View>

        {/* For You */}
        <View className="py-4 pb-6">
          <View className="mb-3 flex-row items-center justify-between px-6">
            <Text className="text-lg font-plus-semibold text-text-primary">For You</Text>
            <TouchableOpacity>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6"
          >
            {filteredForYouProducts.map((product) => renderProductCard(product, 'forYou'))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <View className="mx-8 flex-row border  border-gray-light  rounded-full bg-white p-1">
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-full ${
              activeTab === 'Home' ? 'bg-[#F4F4F4]' : ''
            }`}
            onPress={() => setActiveTab('Home')}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color={activeTab === 'Home' ? COLORS.primary : COLORS.textPrimary}
            />
            <Text
              className={`mt-1 text-xs font-plus-bold ${
                activeTab === 'Home' ? 'text-primary-light' : 'text-text-primary'
              }`}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-full ${
              activeTab === 'Categories' ? 'bg-[#F4F4F4]' : ''
            }`}
            onPress={() => navigation.navigate('Categories')}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={activeTab === 'Categories' ? COLORS.primary : COLORS.textPrimary}
            />
            <Text
              className={`mt-1 text-xs font-plus-bold ${
                activeTab === 'Categories' ? 'text-primary' : 'text-text-primary'
              }`}
            >
              Categories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-full ${
              activeTab === 'Cart' ? 'bg-[#F4F4F4]' : ''
            }`}
            onPress={() => setActiveTab('Cart')}
          >
            <Ionicons
              name="cart-outline"
              size={20}
              color={activeTab === 'Cart' ? COLORS.primary : COLORS.textPrimary}
            />
            <Text
              className={`mt-1 text-xs font-plus-bold ${
                activeTab === 'Cart' ? 'text-primary' : 'text-text-primary'
              }`}
            >
              Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-full ${
              activeTab === 'Profile' ? 'bg-[#F4F4F4]' : ''
            }`}
            onPress={() => setActiveTab('Profile')}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={activeTab === 'Profile' ? COLORS.primary : COLORS.textPrimary}
            />
            <Text
              className={`mt-1 text-xs font-plus-bold ${
                activeTab === 'Profile' ? 'text-primary' : 'text-text-primary'
              }`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
