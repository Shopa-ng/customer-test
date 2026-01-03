import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  UIManager,
  findNodeHandle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: any;
}

type SortOption =
  | 'bestRatings'
  | 'popularity'
  | 'newestFirst'
  | 'oldestFirst'
  | 'priceLowToHigh'
  | 'priceHighToLow';

const sortOptions = [
  { value: 'bestRatings', label: 'Best ratings' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newestFirst', label: 'Newest first' },
  { value: 'oldestFirst', label: 'Oldest first' },
  { value: 'priceLowToHigh', label: 'Price (low to high)' },
  { value: 'priceHighToLow', label: 'Price (high to low)' },
];

const PopularInSchoolScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const sortButtonRef = useRef<View>(null);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('bestRatings');

  const [products, _setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'New School Physics',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-book.png'),
    },
    {
      id: '2',
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 3,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
    },
    {
      id: '3',
      name: 'New School Physics',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-book.png'),
    },
    {
      id: '4',
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 3,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
    },
    {
      id: '5',
      name: 'New School Physics',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-book.png'),
    },
    {
      id: '6',
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 3,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
    },
  ]);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* -------------------- Handlers -------------------- */

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleCart = () => {
    console.log('Go to cart');
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  const handleToggleFavorite = (productId: string) => {
    toggleFavorite(productId);
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
    setShowSortModal(false);
  };

  const openSortPopover = () => {
    const handle = findNodeHandle(sortButtonRef.current);
    if (!handle) return;

    UIManager.measureInWindow(handle, (x, y, w, h) => {
      setPopoverPos({
        left: x,
        top: y + h + 8,
      });
      setShowSortModal(true);
    });
  };

  /* -------------------- Helpers -------------------- */

  const renderStars = (rating: number) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={14}
          color={COLORS.accent}
        />
      ))}
    </View>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      onPress={() => handleProductPress(product.id)}
      className="mb-4 w-[48%]"
    >
      <View className="rounded-lg border border-gray-light bg-main-bg">
        <View className="relative mb-2 h-[180px] w-full overflow-hidden rounded-t-lg">
          <Image source={product.image} className="h-full w-full" resizeMode="contain" />
          <TouchableOpacity
            className={`absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full ${
              isFavorite(product.id) ? 'bg-primary-4' : 'bg-white'
            }`}
            onPress={() => handleToggleFavorite(product.id)}
          >
            <Ionicons name="heart-outline" size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <View className="px-3 pb-3">
          <Text className="mb-1 text-sm text-text-secondary" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="mb-2 text-sm font-plus-bold text-text-primary">
            ₦{product.price.toLocaleString()}
          </Text>
          <View className="mb-3 flex-row items-center">
            {renderStars(product.rating)}
            <Text className="ml-1 text-xs text-text-secondary">({product.reviews})</Text>
          </View>
          <TouchableOpacity
            className="items-center rounded-lg bg-primary-light py-3"
            onPress={() => handleAddToCart(product.id)}
          >
            <Text className="text-sm font-plus-semibold text-white">Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  /* -------------------- UI -------------------- */

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View className="bg-primary-light px-6 pb-4 pt-20 rounded-b-xl">
        {showSearch ? (
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={handleSearchToggle}>
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View className="flex-1 flex-row items-center rounded-lg bg-white px-4">
              <Ionicons name="search" size={20} color={COLORS.textSecondary} />
              <TextInput
                className="ml-2 flex-1 py-3 text-sm text-text-primary"
                placeholder="Search for any item..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            <TouchableOpacity className="ml-3" onPress={handleCart}>
              <Ionicons name="cart-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text className="text-lg font-plus-semibold text-white">Popular in your school</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity className="mr-3" onPress={handleSearchToggle}>
                <Ionicons name="search" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCart}>
                <Ionicons name="cart-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Sort Button */}
      <View className="px-6 py-4">
        <TouchableOpacity
          ref={sortButtonRef}
          className="flex-row items-center self-start rounded-lg bg-primary-4 px-4 py-2"
          onPress={openSortPopover}
        >
          <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
          <Text className="ml-2 text-sm font-plus-semibold text-primary-light">SORT BY</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <View className="flex-row flex-wrap justify-between px-6 pb-6">
          {filteredProducts.map(renderProductCard)}
        </View>
      </ScrollView>

      {/* Sort Popover Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: popoverPos.top,
              left: popoverPos.left,
            }}
          >
            <View
              className="rounded-xl border-2 border-primary-light bg-white px-4 py-3"
              style={{
                width: 200,
                maxWidth: Dimensions.get('window').width - 32,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center py-2"
                  onPress={() => handleSortSelect(option.value as SortOption)}
                >
                  <View
                    className={`mr-3 h-4 w-4 items-center justify-center rounded-full border border-primary-light`}
                  >
                    {selectedSort === option.value && (
                      <View className="h-2 w-2  bg-primary-light rounded-full" />
                    )}
                  </View>
                  <Text
                    className={`text-sm ${
                      selectedSort === option.value
                        ? 'font-plus-semibold text-text-primary'
                        : 'text-text-primary'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PopularInSchoolScreen;
