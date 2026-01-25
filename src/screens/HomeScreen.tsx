import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Logo, BottomNavBar } from '../components';
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
  image: ImageSourcePropType;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : 2;
  const horizontalPadding = 24;
  const gap = 16;
  const cardWidth =
    (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;
  const cardHeight = cardWidth;

  const categories: Category[] = [
    { id: '1', name: 'Clothing', icon: 'shirt-outline' },
    { id: '2', name: 'Stationery', icon: 'book-outline' },
    { id: '3', name: 'Gadgets', icon: 'phone-portrait-outline' },
    { id: '4', name: 'Provisions', icon: 'cube-outline' },
  ];

  const popularProducts: Product[] = [
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
  ];

  const forYouProducts: Product[] = [
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
  ];

  // Filter products based on search query
  const filteredPopularProducts = popularProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredForYouProducts = forYouProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryProducts', {
      categoryId: category.id,
      title: category.name,
    });
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleSeeAll = (section: string) => {
    if (section === 'popular') {
      navigation.navigate('PopularInSchool');
      return;
    }
    if (section === 'forYou') {
      navigation.navigate('Success', {
        message: 'This section will be available soon.',
        navigateTo: 'Home',
        variant: 'plain',
      });
    }
  };

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={{ width: cardWidth, marginRight: gap, marginBottom: gap }}
      onPress={() => handleProductPress(product.id)}
    >
      <View style={{ height: cardHeight }} className="relative mb-2 w-full overflow-hidden rounded-lg">
        <Image source={product.image} className="h-full w-full" resizeMode="cover" />
        <TouchableOpacity
          className={`absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full p-1 ${
            isFavorite(product.id) ? 'bg-primary-4' : 'bg-main-bg'
          }`}
          onPress={() => toggleFavorite(product.id)}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={COLORS.textPrimary}
          />
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

      <View
        className="bg-primary-light px-6 pb-4 rounded-b-xl"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="mb-4 items-center">
          <Logo size="small" />
        </View>

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 96,
        }}
      >
        <View className="px-6 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-plus-semibold text-text-primary">Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="mr-3 flex-row items-center rounded-lg bg-primary-4 px-4 py-2"
                onPress={() => handleCategoryPress(category)}
              >
                <Ionicons name={category.icon as any} size={16} color={COLORS.primary} />
                <Text className="ml-2 text-sm text-primary-light">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="py-4">
          <View className="mb-3 flex-row items-center justify-between px-6">
            <Text className="text-lg font-plus-semibold text-text-primary">
              Popular in your school
            </Text>
            <TouchableOpacity onPress={() => handleSeeAll('popular')}>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="px-6">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -gap }}>
              {filteredPopularProducts.map((product) => renderProductCard(product))}
            </View>
          </View>
        </View>

        <View className="py-4 pb-6">
          <View className="mb-3 flex-row items-center justify-between px-6">
            <Text className="text-lg font-plus-semibold text-text-primary">For You</Text>
            <TouchableOpacity onPress={() => handleSeeAll('forYou')}>
              <Text className="text-sm font-plus-bold underline text-primary-light">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="px-6">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -gap }}>
              {filteredForYouProducts.map((product) => renderProductCard(product))}
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="Home" />
    </View>
  );
};

export default HomeScreen;
