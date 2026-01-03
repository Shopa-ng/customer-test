import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const CategoriesScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View className="bg-primary-light px-6 pb-5 pt-12">
        <Text className="text-xl font-plus-bold text-white">Categories</Text>
      </View>

      {/* Coming Soon Content */}
      <View className="flex-1 items-center justify-center">
        <Ionicons name="construct-outline" size={64} color={COLORS.primary} />
        <Text className="mt-4 text-lg font-plus-bold text-text-primary">Coming Soon</Text>
        <Text className="mt-2 text-sm text-text-secondary text-center px-10">
          We’re working on bringing categories to life. Check back soon!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
