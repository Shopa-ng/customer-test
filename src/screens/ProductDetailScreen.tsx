import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';
import { getProductById, Product } from '../api/products.api';
import { useCartStore } from '../store/cart.store';

type RouteParams = {
  ProductDetail: {
    productId: string;
  };
};

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'ProductDetail'>>();
  const productId = route.params?.productId || '';
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigation.goBack();

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') setQuantity((p) => p + 1);
    else if (type === 'decrement' && quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const imageUri = product.images && product.images.length > 0 ? product.images[0] : null;
    const vendorName = product.vendor?.storeName || 'Unknown Store';
    const vendorId = product.vendorId || '';

    addItem(
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: imageUri,
        vendorName,
        vendorId,
        description: product.description || undefined,
      },
      quantity,
    );

    navigation.navigate('Cart');
  };

  const renderStars = (rating: number) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={16}
          color={COLORS.accent}
        />
      ))}
    </View>
  );

  // ─── Loading State ───
  if (isLoading) {
    return (
      <View className="flex-1 bg-main-bg items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ─── Error State ───
  if (error || !product) {
    return (
      <View className="flex-1 bg-main-bg items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.textSecondary} />
        <Text className="mt-4 text-base text-text-secondary text-center">
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity
          className="mt-4 rounded-xl bg-primary px-6 py-3"
          onPress={handleBack}
        >
          <Text className="text-base text-white font-plus-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Derived Values ───
  const imageUri = product.images && product.images.length > 0 ? product.images[0] : null;
  const price = Number(product.price);
  const vendorName = product.vendor?.storeName || 'Unknown Store';
  const description = product.description || 'No description available.';
  const reviews = (product as any).reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Math.round(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount)
    : 0;

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.mainBg} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity
          onPress={handleBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavorite(productId)}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isFavorite(productId) ? 'bg-primary-4' : 'bg-white'
          }`}
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
        >
          <Ionicons name="heart-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        {/* Product Image */}
        <View className="h-[280px] w-full px-6 bg-main-bg">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="contain" />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Ionicons name="image-outline" size={64} color={COLORS.textSecondary} />
            </View>
          )}
        </View>

        {/* Details Container */}
        <View className="flex-1 -mt-6 rounded-t-[30px] bg-white pt-8 pb-10 shadow-sm">
          <View className="px-6">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-2xl font-plus-semibold text-text-primary">
                  {product.name}
                </Text>
                <Text className="mt-2 text-base text-text-secondary">
                  Store: <Text className="text-accent font-plus-semibold">{vendorName}</Text>
                </Text>
              </View>

              {/* Quantity Selector */}
              <View className="flex-row items-center rounded-lg border border-primary-light">
                <TouchableOpacity
                  onPress={() => handleQuantityChange('decrement')}
                  className="h-12 w-8 items-center justify-center"
                >
                  <Ionicons name="remove" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View className="w-8 items-center">
                  <Text className="text-base font-plus-semibold text-text-primary">{quantity}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleQuantityChange('increment')}
                  className="h-8 w-8 items-center justify-center"
                >
                  <Ionicons name="add" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="mb-3 text-2xl font-plus-bold text-text-primary">
              {'\u20A6'}{price.toLocaleString()}
            </Text>

            {/* Rating */}
            <View className="mb-8 flex-row items-center">
              {renderStars(avgRating)}
              <Text className="ml-2 text-base text-text-secondary">({reviewCount})</Text>
            </View>

            {/* Category badge */}
            {product.category && (
              <View className="mb-4 self-start rounded-lg bg-primary-4 px-3 py-1">
                <Text className="text-sm text-primary-light">{product.category.name}</Text>
              </View>
            )}

            {/* Tabs */}
            <View className="mb-2 flex-row">
              <TouchableOpacity
                onPress={() => setActiveTab('details')}
                className={`mr-3 rounded-lg px-3 py-2 ${
                  activeTab === 'details' ? 'bg-primary-4' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-base text-center ${
                    activeTab === 'details'
                      ? 'font-plus-semibold text-primary-light'
                      : 'text-text-secondary'
                  }`}
                >
                  Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('reviews')}
                className={`rounded-lg px-3 py-2 ${
                  activeTab === 'reviews' ? 'bg-primary-4' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-base text-center ${
                    activeTab === 'reviews'
                      ? 'font-plus-semibold text-primary-light'
                      : 'text-text-secondary'
                  }`}
                >
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <View className="px-6 py-2">
              <Text className="text-base leading-6 text-text-primary">
                {showFullDescription ? description : `${description.slice(0, 200)}${description.length > 200 ? '...' : ''}`}
              </Text>
              {description.length > 200 && (
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text className="mt-2 text-base font-plus-semibold text-accent">
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Stock info */}
              <View className="mt-6 flex-row items-center">
                <View className={`h-2 w-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="text-base text-text-secondary">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Text>
              </View>
            </View>
          ) : (
            <View className="px-6 py-4">
              {reviews.length === 0 ? (
                <Text className="text-base text-text-secondary text-center py-8">
                  No reviews yet. Be the first to review!
                </Text>
              ) : (
                reviews.map((review: any) => (
                  <View key={review.id} className="mb-6">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-lg font-plus-semibold text-text-primary">
                        {review.reviewer?.firstName || 'Anonymous'} {review.reviewer?.lastName || ''}
                      </Text>
                      <Text className="text-sm text-text-secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="mb-2">{renderStars(review.rating)}</View>
                    <Text className="text-base leading-6 text-text-primary">{review.comment || ''}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        className="flex-row items-center justify-between border-t border-gray-light bg-white px-6 py-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <View>
          <Text className="text-sm text-text-secondary">Total Price</Text>
          <Text className="text-2xl font-plus-bold text-text-primary">
            {'\u20A6'}{(price * quantity).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          className="rounded-xl bg-primary px-8 items-center justify-center"
          style={{ height: 53 }}
          disabled={product.stock <= 0}
        >
          <Text className="text-lg font-plus-semibold text-white">Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
