import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

interface BottomNavBarProps {
  activeTab: 'Home' | 'Categories' | 'Cart' | 'Profile';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handlePress = (tab: string) => {
    if (tab === 'Home') {
      navigation.navigate('Home');
    } else if (tab === 'Categories') {
      navigation.navigate('Categories');
    } else if (tab === 'Cart') {
      navigation.navigate('Cart');
    } else if (tab === 'Profile') {
      navigation.navigate('Profile');
    }
  };

  const tabs = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Categories', icon: 'grid-outline' },
    { name: 'Cart', icon: 'cart-outline' },
    { name: 'Profile', icon: 'person-outline' },
  ];

  return (
    <View style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
      <View className="mx-8 flex-row border border-gray-light rounded-full bg-white p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              className={`flex-1 items-center py-2 rounded-full ${
                isActive ? 'bg-[#F4F4F4]' : ''
              }`}
              onPress={() => handlePress(tab.name)}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={isActive ? COLORS.primary : COLORS.textPrimary}
              />
              <Text
                className={`mt-1 text-sm font-plus-bold ${
                  isActive ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
