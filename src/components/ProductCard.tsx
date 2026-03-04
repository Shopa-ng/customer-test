import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Product } from '../types/product';
import { useFavorites } from '../context/FavoritesContext';

interface ProductCardProps {
  product: Product;
  onPress: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

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

  return (
    <TouchableOpacity
      onPress={() => onPress(product.id)}
      className="mb-4 w-[48%]"
    >
      <View className="rounded-xl border border-gray-light bg-white">
        <View className="relative mb-2 h-[180px] w-full overflow-hidden rounded-t-xl items-center justify-center p-2">
          <Image
            source={product.image}
            className="h-full w-full"
            resizeMode="contain"
          />
          <TouchableOpacity
            className={`absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full ${
              isFavorite(product.id) ? 'bg-primary-4' : 'bg-white'
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
        <View className="px-3 pb-3">
          <Text className="mb-1 text-base text-text-secondary" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="mb-2 text-base font-plus-bold text-text-primary">
            ₦{product.price.toLocaleString()}
          </Text>
          <View className="mb-3 flex-row items-center">
            {renderStars(product.rating)}
            <Text className="ml-1 text-sm text-text-secondary">
              ({product.reviews})
            </Text>
          </View>
          <TouchableOpacity
            className="items-center rounded-xl bg-primary py-3"
            onPress={() => onAddToCart(product.id)}
          >
            <Text className="text-base font-plus-semibold text-white">
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
