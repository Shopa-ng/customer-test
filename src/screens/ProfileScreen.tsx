import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const openComingSoon = (title: string) => {
    navigation.navigate('Success', {
      message: `${title} is not available yet.`,
      navigateTo: 'Profile',
      variant: 'plain',
    });
  };

  const menuItems = [
    {
      icon: 'settings-outline',
      label: 'Account Settings',
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      icon: 'cube-outline',
      label: 'Order History',
      onPress: () => navigation.navigate('OrderHistory'),
    },
    {
      icon: 'heart-outline',
      label: 'Saved Items',
      onPress: () => navigation.navigate('SavedItems'),
    },
    {
      icon: 'hand-right-outline',
      label: 'Raise Order Dispute',
      onPress: () => navigation.navigate('RaiseOrderDispute'),
    },
    {
      icon: 'ticket-outline',
      label: 'Vouchers',
      onPress: () => navigation.navigate('Vouchers'),
    },
    {
      icon: 'gift-outline',
      label: 'Referrals',
      onPress: () => navigation.navigate('Referrals'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      icon: 'alert-circle-outline',
      label: 'Terms & Policies',
      onPress: () => navigation.navigate('TermsPolicies'),
    },
  ];

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Profile" showBack={false} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-6">
          <Text className="text-2xl font-plus-semibold text-text-primary mb-1">
            Hello, Esther!
          </Text>
          <Text className="text-base text-text-secondary">
            esther@gmail.com
          </Text>
        </View>

        <View className="px-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4"
              onPress={item.onPress}
            >
              <View className="w-8 mr-2">
                <Ionicons name={item.icon as any} size={22} color={COLORS.textPrimary} />
              </View>
              <Text className="text-lg text-text-primary font-plus-medium">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center mt-8 mb-8"
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.accent} />
          <Text className="ml-2 text-2xl font-plus-semibold text-accent">
            SIGN OUT
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar activeTab="Profile" />
    </View>
  );
};

export default ProfileScreen;
