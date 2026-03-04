import React from 'react';
import { View, Text, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';
import { QuantityBox } from '../ui';
import { NavigationProp } from '../types/navigation';

interface ProductSummary {
  id: string;
  name: string;
  store: string;
  price: number;
  image: any;
}

const PRODUCTS: Record<string, ProductSummary> = {
  '1': {
    id: '1',
    name: 'New School Physics\nTextbook by J.K. Rowlings',
    store: 'BM Bookstores',
    price: 25000,
    image: require('../../assets/product-book.png'),
  },
  '2': {
    id: '2',
    name: 'PRIMARK Shirt',
    store: 'Shirts and Co',
    price: 15000,
    image: require('../../assets/product-shirt.png'),
  },
  '3': {
    id: '3',
    name: 'Scientific Calculator',
    store: 'TechStore',
    price: 8500,
    image: { uri: 'https://picsum.photos/id/237/200/200' },
  },
};

const getProductsByIds = (ids: string[]): ProductSummary[] =>
  ids.map((id) => PRODUCTS[id]).filter(Boolean) as ProductSummary[];

const SavedItemsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, removeFavorite } = useFavorites();
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  const displayItems = getProductsByIds(favorites);
  React.useEffect(() => {
    setQuantities((prev) => {
      const next = { ...prev };
      displayItems.forEach((item) => {
        if (!next[item.id]) next[item.id] = 1;
      });
      return next;
    });
  }, [favorites, displayItems]);

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader 
        title="Saved Items" 
        showBack={true} 
      />

      {displayItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray text-lg font-plus-medium">
            No current saved items
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
          {displayItems.map((item) => (
            <View 
              key={item.id} 
              className="bg-background-card border border-gray-light rounded-xl p-4 mb-4 relative"
            >
              <TouchableOpacity 
                className="absolute top-3 right-3 z-10 p-1"
                onPress={() => removeFavorite(item.id)}
              >
                <Ionicons name="close" size={20} color={COLORS.gray} />
              </TouchableOpacity>

              <View className="flex-row">
                <View className="w-[100px] h-[100px] items-center justify-center mr-4">
                  <Image 
                    source={item.image} 
                    className="w-full h-full" 
                    resizeMode="contain" 
                  />
                </View>

                <View className="flex-1 justify-center">
                  <Text className="text-text-primary font-plus-bold text-base mb-1 leading-tight">
                    {item.name}
                  </Text>
                  <Text className="text-gray text-sm mb-2">
                    {item.store}
                  </Text>
                  
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-success font-plus-bold text-lg">
                      ₦ {(item.price * (quantities[item.id] ?? 1)).toLocaleString()}
                    </Text>
                    
                    <QuantityBox
                      value={quantities[item.id] ?? 1}
                      onChange={(next) => setQuantities((q) => ({ ...q, [item.id]: next }))}
                    />
                  </View>

                  <TouchableOpacity 
                    className="bg-primary rounded-xl py-2 mt-3 items-center justify-center"
                    onPress={() => navigation.navigate('Cart')}
                  >
                    <Text className="text-white font-plus-bold text-base">Add to cart</Text>
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
