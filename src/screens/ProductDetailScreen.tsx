import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useFavorites } from '../context/FavoritesContext';

type RouteParams = {
  ProductDetail: {
    productId: string;
  };
};

interface ProductDetail {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  rating: number;
  reviewCount: number;
  store: string;
  image: any;
  description: string;
  sizes?: string[];
  specifications?: { label: string; value: string }[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'ProductDetail'>>();
  const productId = route.params?.productId || '1';

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();

  const products: Record<string, ProductDetail> = {
    '1': {
      id: '1',
      name: 'New School Physics',
      subtitle: 'Textbook by J.K. Rowlings',
      price: 25000,
      rating: 2,
      reviewCount: 6,
      store: 'BM Bookstores',
      image: require('../../assets/product-book.png'),
      description:
        'Lorem ipsum dolor sit amet consectetur. Non sollicitudin massa tristique felis fringilla dignissim sed risus interdum. Facilisis feugiat non elementum dui lectus. Consequat fames pellentesque feugiat turpis urna lectus libero ornare. Condimentum nunc sagittis quam nulla dolor vitae volutpat praesent.',
      specifications: [
        { label: 'Author', value: 'J.K. Rowlings' },
        { label: 'Publisher', value: 'BM Bookstores' },
        { label: 'ISBN', value: '978-3-16-148410-0' },
        { label: 'Pages', value: '450' },
      ],
    },
    '2': {
      id: '2',
      name: 'PRIMARK Shirt',
      price: 15000,
      rating: 4,
      reviewCount: 12,
      store: 'Shirts and Co',
      image: require('../../assets/product-shirt.png'),
      description:
        'Lorem ipsum dolor sit amet consectetur. Non sollicitudin massa tristique felis fringilla dignissim sed risus interdum. Facilisis feugiat non elementum dui lectus. Consequat fames pellentesque feugiat turpis urna lectus libero ornare. Condimentum nunc sagittis quam nulla dolor vitae volutpat praesent.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      specifications: [
        { label: 'Material', value: '100% Cotton' },
        { label: 'Brand', value: 'PRIMARK' },
        { label: 'Care', value: 'Machine Washable' },
      ],
    },
    '3': {
      id: '3',
      name: 'Scientific Calculator',
      price: 8500,
      rating: 5,
      reviewCount: 8,
      store: 'TechStore',
      image: { uri: 'https://picsum.photos/id/237/200/200' },
      description:
        'Advanced scientific calculator with comprehensive functions for engineering and mathematics students. Features include complex number calculations, statistical analysis, and programmable functions.',
      specifications: [
        { label: 'Brand', value: 'Casio' },
        { label: 'Model', value: 'FX-991EX' },
        { label: 'Display', value: 'LCD' },
        { label: 'Power', value: 'Solar + Battery' },
      ],
    },
  };

  const product = products[productId] || products['1'];

  // Mock reviews data - ready for backend integration
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Emmanuel',
      rating: 4,
      date: '20th Nov, 2025',
      comment:
        'Lorem ipsum dolor sit amet consectetur. Amet sit magna bibendum id adipiscing mattis facilisi egestas sed. Euut proin.',
    },
    {
      id: '2',
      userName: 'Okime',
      rating: 4,
      date: '20th Nov, 2025',
      comment:
        'Lorem ipsum dolor sit amet consectetur. Amet sit magna bibendum id adipiscing mattis facilisi egestas sed. Euut proin.',
    },
  ];

  /* -------------------- Handlers -------------------- */

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(productId);
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', {
      productId: product.id,
      quantity,
      selectedSize,
    });
    // TODO: Implement cart functionality
  };

  /* -------------------- Helpers -------------------- */

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

  const renderDetailsTab = () => (
    <View className="px-6 py-2">
      <Text className="text-sm leading-6 text-text-primary">
        {showFullDescription ? product.description : `${product.description.slice(0, 200)}...`}
      </Text>
      <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
        <Text className="mt-2 text-sm font-plus-semibold text-primary-light">
          {showFullDescription ? 'Show less' : 'Show more'}
        </Text>
      </TouchableOpacity>

      {product.specifications && product.specifications.length > 0 && (
        <View className="mt-6">
          <Text className="mb-3 text-base font-plus-semibold text-text-primary">
            Specifications
          </Text>
          {product.specifications.map((spec, index) => (
            <View
              key={index}
              className="mb-2 flex-row justify-between border-b border-gray-100 pb-2"
            >
              <Text className="text-sm text-text-secondary">{spec.label}</Text>
              <Text className="text-sm font-plus-semibold text-text-primary">{spec.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View className="px-6 py-4">
      {reviews.map((review) => (
        <View key={review.id} className="mb-6">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-plus-semibold text-text-primary">
              {review.userName}
            </Text>
            <Text className="text-xs text-text-secondary">{review.date}</Text>
          </View>
          <View className="mb-2">{renderStars(review.rating)}</View>
          <Text className="text-sm leading-6 text-text-primary">{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  /* -------------------- UI -------------------- */

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.mainBg} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <TouchableOpacity
          onPress={handleBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isFavorite(productId) ? 'bg-primary-4' : 'bg-white'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="heart-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        {/* Product Image */}
        <View className="h-[280px] w-full px-6 bg-main-bg">
          <Image source={product.image} className="h-full w-full" resizeMode="contain" />
        </View>

        {/* Details Container */}
        <View className="flex-1 -mt-6 rounded-t-[30px] bg-white pt-8 pb-10 shadow-sm">
          {/* Product Info */}
          <View className="px-6">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-plus-semibold text-text-primary">{product.name}</Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  Store: <Text className="text-accent font-plus-semibold">{product.store}</Text>
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
                  <Text className="text-sm font-plus-semibold text-text-primary">{quantity}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleQuantityChange('increment')}
                  className="h-8 w-8 items-center justify-center"
                >
                  <Ionicons name="add" size={18} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="mb-3 text-xl font-plus-bold text-text-primary">
              ₦{product.price.toLocaleString()}
            </Text>

            {/* Rating */}
            <View className="mb-8 flex-row items-center">
              {renderStars(product.rating)}
              <Text className="ml-2 text-sm text-text-secondary">({product.reviewCount})</Text>
            </View>

            {/* Size Selection (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <Text className="mr-3 text-sm font-plus-semibold text-text-primary">Size:</Text>
                  <View className="flex-row flex-wrap">
                    {product.sizes.map((size) => (
                      <TouchableOpacity
                        key={size}
                        onPress={() => handleSizeSelect(size)}
                        className={`mr-1.5 rounded-lg border px-3 py-2 ${
                          selectedSize === size
                            ? 'border-primary-light bg-primary-4'
                            : 'border-gray-light bg-white'
                        }`}
                      >
                        <Text
                          className={`text-sm font-plus-semibold ${
                            selectedSize === size ? 'text-primary-light' : 'text-text-primary'
                          }`}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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
                  className={`text-sm text-center ${
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
                  className={`text-sm text-center ${
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
          {activeTab === 'details' ? renderDetailsTab() : renderReviewsTab()}
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
          <Text className="text-xs text-text-secondary">Total Price</Text>
          <Text className="text-xl font-plus-bold text-text-primary">
            ₦{(product.price * quantity).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          className="rounded-lg bg-primary-light px-8 py-4"
        >
          <Text className="text-base font-plus-semibold text-white">Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
