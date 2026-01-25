import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  UIManager,
  findNodeHandle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { NavigationProp, RootStackParamList } from '../types/navigation';
import { useSearch } from '../hooks/useSearch';
import { Product } from '../types/product';
import { ProductCard, ScreenHeader } from '../components';

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

const CategoryProductsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'CategoryProducts'>>();
  const { title } = route.params;
  const insets = useSafeAreaInsets();
  const sortButtonRef = useRef<View>(null);

  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('bestRatings');

  // Mock Data matching the screenshots
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
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
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
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
      name: 'PRIMARK Shirt',
      price: 25000,
      rating: 4,
      reviews: 6,
      image: require('../../assets/product-shirt.png'),
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

  const {
    searchQuery,
    setSearchQuery,
    showSearch,
    toggleSearch: handleSearchToggle,
    filteredData: filteredProducts,
  } = useSearch<Product>({
    data: products,
    searchKeys: ['name'],
  });

  const handleCart = () => {
    navigation.navigate('Cart');
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleAddToCart = (_productId: string) => {
    navigation.navigate('Cart');
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

  /* -------------------- UI -------------------- */

  return (
    <View className="flex-1 bg-main-bg">

      {/* Header */}
      <ScreenHeader
        title={title}
        showBack
        enableSearch
        isSearchVisible={showSearch}
        onSearchToggle={handleSearchToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showCart
        onCartPress={handleCart}
      />

      {/* Sort Button */}
      <View className="px-6 py-4">
        <TouchableOpacity
          ref={sortButtonRef}
          className="flex-row items-center self-start rounded-lg bg-primary-4 px-4 py-2"
          onPress={openSortPopover}
        >
          <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
          <Text className="ml-2 text-sm font-plus-semibold text-primary-light">
            SORT BY
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <View className="flex-row flex-wrap justify-between px-6 pb-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          ))}
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
              className="rounded-xl border border-primary bg-white px-4 py-3"
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
                    className={`mr-3 h-4 w-4 items-center justify-center rounded-full border border-primary`}
                  >
                    {selectedSort === option.value && (
                      <View className="h-2 w-2  bg-primary rounded-full" />
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

export default CategoryProductsScreen;
