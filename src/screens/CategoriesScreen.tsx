import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { ScreenHeader, BottomNavBar } from '../components';
import { useSearch } from '../hooks/useSearch';


interface SubCategoryItem {
  id: string;
  name: string;
  image: string;
}

interface SubCategorySection {
  id: string;
  title: string;
  items: SubCategoryItem[];
}

interface MainCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  sections: SubCategorySection[];
}

// Mock Data - Replace with API when backend is ready
const MOCK_CATEGORIES: MainCategory[] = [
  {
    id: '1',
    name: 'Clothing & Accessories',
    icon: 'shirt-outline',
    sections: [
      {
        id: 's1',
        title: "MEN'S FASHION",
        items: [
          { id: '1', name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop' },
          { id: '2', name: 'Trousers', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop' },
          { id: '3', name: 'Shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&h=300&fit=crop' },
          { id: '4', name: 'T-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
          { id: '5', name: 'Underwears', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=300&h=300&fit=crop' },
          { id: '6', name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop' },
          { id: '7', name: 'Sportswear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop' },
          { id: '8', name: 'Watches & Jewelry', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop' },
          { id: '9', name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop' },
          { id: '10', name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop' },
          { id: '11', name: 'Other Male Accessories', image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=300&h=300&fit=crop' },
          { id: '12', name: 'Other Male Clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's2',
        title: "WOMEN'S FASHION",
        items: [
          { id: '13', name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop' },
          { id: '14', name: 'Trousers', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=300&h=300&fit=crop' },
          { id: '15', name: 'Tops', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop' },
          { id: '54', name: 'Skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=300&fit=crop' },
          { id: '55', name: 'Underwears', image: 'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=300&h=300&fit=crop' },
          { id: '56', name: 'Swimwear', image: 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=300&h=300&fit=crop' },
          { id: '57', name: 'Co-od sets', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop' },
          { id: '58', name: 'Jewelry', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop' },
          { id: '59', name: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop' },
          { id: '60', name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop' },
          { id: '61', name: 'Other Women Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=300&fit=crop' },
          { id: '62', name: 'Other Women Clothing', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's10',
        title: 'UNISEX FASHION',
        items: [
          { id: '63', name: 'Unisex Clothing', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop' },
          { id: '64', name: 'Unisex Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop' },
          { id: '65', name: 'Unisex Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Body care & Beauty',
    icon: 'body-outline',
    sections: [
      {
        id: 's3',
        title: 'FRAGRANCES',
        items: [
          { id: '16', name: "Men's Perfumes", image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=300&h=300&fit=crop' },
          { id: '17', name: "Women's Perfume", image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd9?w=300&h=300&fit=crop' },
          { id: '18', name: 'Unisex Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's4',
        title: 'BODY CARE',
        items: [
          { id: '19', name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop' },
          { id: '20', name: 'Body Creams & Lotions', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop' },
          { id: '21', name: 'Deodorants', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop' },
          { id: '22', name: 'Lip Care', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop' },
          { id: '23', name: 'Soap', image: 'https://images.unsplash.com/photo-1600857544200-242c40384d51?w=300&h=300&fit=crop' },
          { id: '24', name: 'Others', image: 'https://images.unsplash.com/photo-1556228852-80c3ccc0b67c?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's5',
        title: 'PERSONAL CARE',
        items: [
          { id: '25', name: 'Oral Care', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop' },
          { id: '26', name: 'Feminine Care', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop' },
          { id: '27', name: "Men's Care", image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&h=300&fit=crop' },
          { id: '74', name: 'Others', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's12',
        title: 'HAIR CARE',
        items: [
          { id: '75', name: 'Hair Products', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop' },
          { id: '76', name: 'Hair Accessories', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop' },
          { id: '77', name: 'Hair Appliances', image: 'https://images.unsplash.com/photo-1585747860019-8342b5a5c95e?w=300&h=300&fit=crop' },
          { id: '78', name: 'Wigs, Weaves & Extensions', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's13',
        title: 'MAKEUP',
        items: [
          { id: '79', name: 'Makeup Products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop' },
          { id: '80', name: 'Makeup Accessories', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop' },
          { id: '81', name: 'Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop' },
          { id: '82', name: 'Others', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Provisions',
    icon: 'cube-outline',
    sections: [
      {
        id: 's6',
        title: 'PROVISIONS',
        items: [
          { id: '28', name: 'Cereal', image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=300&h=300&fit=crop' },
          { id: '29', name: 'Milk & Beverages', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop' },
          { id: '30', name: 'Snacks & Confectioneries', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop' },
          { id: '31', name: 'Others', image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Sports',
    icon: 'football-outline',
    sections: [
      {
        id: 's7',
        title: 'SPORTS',
        items: [
          { id: '66', name: 'Swimming', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop' },
          { id: '32', name: 'Football', image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e26c05d?w=300&h=300&fit=crop' },
          { id: '33', name: 'Basketball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop' },
          { id: '67', name: 'Fitness', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop' },
          { id: '68', name: 'Sportswear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop' },
          { id: '69', name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
          { id: '70', name: 'Other Sports Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Gadgets & Accessories',
    icon: 'phone-portrait-outline',
    sections: [
      {
        id: 's8',
        title: 'GADGETS',
        items: [
          { id: '34', name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
          { id: '35', name: 'Mobile Phones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop' },
          { id: '36', name: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop' },
          { id: '37', name: 'iPads', image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=300&h=300&fit=crop' },
          { id: '38', name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop' },
          { id: '39', name: 'Desktops', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&h=300&fit=crop' },
          { id: '40', name: 'Earphones', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300&h=300&fit=crop' },
          { id: '41', name: 'Headsets', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
          { id: '42', name: 'Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop' },
          { id: '43', name: 'Gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop' },
          { id: '44', name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop' },
          { id: '45', name: 'Other Gadgets', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop' },
        ],
      },
      {
        id: 's9',
        title: 'ACCESSORIES',
        items: [
          { id: '46', name: 'Phone Accessories', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop' },
          { id: '47', name: 'Computer Accessories', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop' },
          { id: '48', name: 'Tablet Accessories', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop' },
          { id: '49', name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop' },
          { id: '50', name: 'Chargers', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop' },
          { id: '51', name: 'Gaming Accessories', image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=300&h=300&fit=crop' },
          { id: '52', name: 'Storage Accessories', image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&h=300&fit=crop' },
          { id: '53', name: 'Other Accessories', image: 'https://images.unsplash.com/photo-1625961332071-f1c6e2e68bb6?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'Stationery',
    icon: 'book-outline',
    sections: [
      {
        id: 's11',
        title: 'STATIONERY',
        items: [
          { id: '71', name: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop' },
          { id: '72', name: 'School Supplies', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&h=300&fit=crop' },
          { id: '73', name: 'Other Stationery', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop' },
        ],
      },
    ],
  },
  {
    id: '7',
    name: 'Others',
    icon: 'basket-outline',
    sections: [
      {
        id: 's14',
        title: 'SEE OTHER PRODUCTS',
        items: [],
      },
    ],
  },
];

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<string>(MOCK_CATEGORIES[1].id);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate backend API call
  useEffect(() => {
    fetchCategories();
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    showSearch,
    toggleSearch: handleSearchToggle,
  } = useSearch<any>({
    data: [],
    searchKeys: [],
  });

  const fetchCategories = async () => {
    try {
      setTimeout(() => {
        setCategories(MOCK_CATEGORIES);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleCategoryPress = (id: string) => {
    setSelectedCategory(id);
  };

  const handleItemPress = (itemId: string) => {
    navigation.navigate('CategoryProducts', {
      categoryId: itemId,
      title: 'Category',
    });
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const filteredSections = currentCategory?.sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const handleSeeAll = (sectionId: string, sectionTitle: string) => {
    navigation.navigate('CategoryProducts', {
      categoryId: sectionId,
      title: sectionTitle,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-main-bg">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader
        title="Categories"
        enableSearch
        isSearchVisible={showSearch}
        onSearchToggle={handleSearchToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <View className="flex-1 flex-row">
        <View
          className="bg-white border-r border-gray-light py-2"
          style={{ width: Math.min(120, Math.max(88, Math.round(width * 0.24))) }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  className={`items-center justify-center py-6 ${
                    isSelected ? 'bg-primary-4' : 'bg-white'
                  }`}
                 
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={isSelected ? COLORS.primaryLight : '#9E9E9E'}
                  />
                  <Text
                    className={`mt-2 text-center text-xs leading-3 px-1 ${
                      isSelected ? 'text-primary-light' : 'text-[#9E9E9E]'
                    }`}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="flex-1 bg-main-bg">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140, paddingTop: 16, paddingHorizontal: 16 }}
          >
            {filteredSections && filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <View key={section.id} className="mb-4 bg-white rounded-lg border border-primary overflow-hidden">
                  <View className="flex-row items-center justify-between px-4 py-3 border-b border-primary">
                    <Text className="text-xs font-plus-bold text-text-primary uppercase">
                      {section.title}
                    </Text>
                    <TouchableOpacity onPress={() => handleSeeAll(section.id, section.title)}>
                      <Text className="text-xs font-plus-bold text-accent underline">
                        See all
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row flex-wrap p-3">
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className="w-1/3 items-center mb-4 px-1"
                        onPress={() => handleItemPress(item.id)}
                      >
                        <View className="w-full aspect-square bg-white border border-primary rounded-lg mb-2 overflow-hidden items-center justify-center p-2">
                          <Image
                            source={{ uri: item.image }}
                            className="w-full h-full"
                            resizeMode="contain"
                          />
                        </View>
                        <Text
                          className="text-[11px] text-center text-text-secondary leading-3 font-plus-medium"
                          numberOfLines={2}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-20">
                <Ionicons name="cube-outline" size={48} color="#BDBDBD" />
                <Text className="mt-3 text-gray-400">No items available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 z-10">
      <BottomNavBar activeTab="Categories" />
      </View>
    </View>
  );
};

export default CategoriesScreen;
