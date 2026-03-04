import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Logo, BottomNavBar } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';
import { getProducts, getCategories, Product, Category } from '../api/products.api';
import { useAuthStore } from '../store/auth.store';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((s) => s.user);

  // ─── API State ───
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Layout ───
  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : 2;
  const horizontalPadding = 24;
  const gap = 16;
  const cardWidth =
    (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;
  const cardHeight = cardWidth;

  // ─── Fetch Data ───
  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ limit: 20, campusId: user?.campusId || undefined }),
        getCategories(),
      ]);

      // Handle both array and paginated responses
      const productList = Array.isArray(productsRes) ? productsRes : productsRes.data || [];
      const categoryList = Array.isArray(categoriesRes) ? categoriesRes : [];

      setProducts(productList);
      setCategories(categoryList);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load products';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.campusId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  // ─── Filter by search ───
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Split into "popular" (first half) and "for you" (second half)
  const midpoint = Math.ceil(filteredProducts.length / 2);
  const popularProducts = filteredProducts.slice(0, midpoint);
  const forYouProducts = filteredProducts.slice(midpoint);

  // ─── Category icons mapping ───
  const categoryIcons: Record<string, string> = {
    clothing: 'shirt-outline',
    stationery: 'book-outline',
    gadgets: 'phone-portrait-outline',
    provisions: 'cube-outline',
    electronics: 'phone-portrait-outline',
    books: 'book-outline',
    food: 'restaurant-outline',
    accessories: 'watch-outline',
  };

  const getCategoryIcon = (name: string) => {
    const key = name.toLowerCase();
    return categoryIcons[key] || 'grid-outline';
  };

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
  };

  // ─── Product Card ───
  const renderProductCard = (product: Product) => {
    const imageUri = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
      <TouchableOpacity
        key={product.id}
        style={{ width: cardWidth, marginRight: gap, marginBottom: gap }}
        onPress={() => handleProductPress(product.id)}
      >
        <View style={{ height: cardHeight }} className="relative mb-2 w-full overflow-hidden rounded-xl bg-gray-light">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Ionicons name="image-outline" size={32} color={COLORS.textSecondary} />
            </View>
          )}
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
        <Text className="mb-1 text-base text-text-primary" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-base font-plus-bold text-text-primary">
          {'\u20A6'}{product.price.toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── Empty / Loading / Error States ───
  const renderEmptyState = () => (
    <View className="items-center justify-center py-16">
      <Ionicons name="bag-outline" size={48} color={COLORS.textSecondary} />
      <Text className="mt-4 text-base text-text-secondary text-center">
        {searchQuery
          ? 'No products match your search'
          : 'No products available yet.\nBe the first vendor to list!'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View
        className="bg-primary px-6 pb-4 rounded-b-xl"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="mb-4 items-center">
          <Logo size="small" />
        </View>

        <View className="flex-row items-center rounded-xl bg-white px-4">
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            className="ml-2 flex-1 py-4 text-base text-text-primary"
            placeholder="Search for any item..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-3 text-base text-text-secondary">Loading products...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cloud-offline-outline" size={48} color={COLORS.textSecondary} />
          <Text className="mt-4 text-base text-text-secondary text-center">{error}</Text>
          <TouchableOpacity
            className="mt-4 rounded-xl bg-primary px-6 py-3"
            onPress={() => fetchData()}
          >
            <Text className="text-base text-white font-plus-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 16) + 96,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        >
          {/* Categories */}
          {categories.length > 0 && (
            <View className="px-6 py-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xl font-plus-semibold text-text-primary">Categories</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                  <Text className="text-base font-plus-bold underline text-primary-light">See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className="mr-3 flex-row items-center rounded-lg bg-primary-4 px-4 py-2"
                    onPress={() => handleCategoryPress(category)}
                  >
                    <Ionicons name={getCategoryIcon(category.name) as any} size={16} color={COLORS.primary} />
                    <Text className="ml-2 text-base text-primary-light">{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Products */}
          {filteredProducts.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {/* Popular in your school */}
              {popularProducts.length > 0 && (
                <View className="py-4">
                  <View className="mb-3 flex-row items-center justify-between px-6">
                    <Text className="text-xl font-plus-semibold text-text-primary">
                      Popular in your school
                    </Text>
                    <TouchableOpacity onPress={() => handleSeeAll('popular')}>
                      <Text className="text-base font-plus-bold underline text-primary-light">See all</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="px-6">
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -gap }}>
                      {popularProducts.map((product) => renderProductCard(product))}
                    </View>
                  </View>
                </View>
              )}

              {/* For You */}
              {forYouProducts.length > 0 && (
                <View className="py-4 pb-6">
                  <View className="mb-3 flex-row items-center justify-between px-6">
                    <Text className="text-xl font-plus-semibold text-text-primary">For You</Text>
                    <TouchableOpacity onPress={() => handleSeeAll('forYou')}>
                      <Text className="text-base font-plus-bold underline text-primary-light">See all</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="px-6">
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -gap }}>
                      {forYouProducts.map((product) => renderProductCard(product))}
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      <BottomNavBar activeTab="Home" />
    </View>
  );
};

export default HomeScreen;
