import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { useCartStore } from '../store/cart.store';
import { QuantityBox } from '../ui';
import { NavigationProp } from '../types/navigation';
import { getProductById, Product } from '../api/products.api';

const SavedItemsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled(favorites.map((id) => getProductById(id)))
      .then((results) => {
        const loaded = results
          .filter((r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled')
          .map((r) => r.value);
        setProducts(loaded);

        // Init quantities for any new items
        setQuantities((prev) => {
          const next = { ...prev };
          loaded.forEach((p) => { if (!next[p.id]) next[p.id] = 1; });
          return next;
        });
      })
      .finally(() => setLoading(false));
  }, [favorites]);

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? null,
      vendorName: product.vendor?.storeName || 'Unknown Store',
      vendorId: product.vendorId,
    }, qty);
    navigation.navigate('Cart');
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Saved Items" showBack={true} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray text-lg font-plus-medium">
            No current saved items
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {products.map((item) => (
            <View
              key={item.id}
              className="bg-background-card border border-gray-light rounded-xl p-4 mb-4 relative"
            >
              {/* Remove button */}
              <TouchableOpacity
                className="absolute top-3 right-3 z-10 p-1"
                onPress={() => removeFavorite(item.id)}
              >
                <Ionicons name="close" size={20} color={COLORS.gray} />
              </TouchableOpacity>

              <View className="flex-row">
                {/* Product image */}
                <TouchableOpacity
                  className="w-[100px] h-[100px] items-center justify-center mr-4"
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                >
                  {item.images?.[0] ? (
                    <Image
                      source={{ uri: item.images[0] }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-gray-light/30 rounded-lg items-center justify-center">
                      <Ionicons name="cube-outline" size={32} color={COLORS.gray} />
                    </View>
                  )}
                </TouchableOpacity>

                <View className="flex-1 justify-center">
                  <Text
                    className="text-text-primary font-plus-bold text-base mb-1 leading-tight"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-gray text-sm mb-2">
                    {item.vendor?.storeName ?? ''}
                  </Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-success font-plus-bold text-lg">
                      ₦ {(item.price * (quantities[item.id] ?? 1)).toLocaleString()}
                    </Text>
                    <QuantityBox
                      value={quantities[item.id] ?? 1}
                      onChange={(next) =>
                        setQuantities((q) => ({ ...q, [item.id]: next }))
                      }
                    />
                  </View>

                  <TouchableOpacity
                    className="bg-primary rounded-xl py-2 mt-3 items-center justify-center"
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text className="text-white font-plus-bold text-base">
                      Add to cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default SavedItemsScreen;
