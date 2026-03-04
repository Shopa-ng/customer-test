import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

type ScreenHeaderProps = {
  title: string;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  // Search Props
  enableSearch?: boolean;
  isSearchVisible?: boolean;
  onSearchToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  // Cart Props
  showCart?: boolean;
  onCartPress?: () => void;
  // Style Props
  backgroundColor?: string;
};

export const ScreenHeader = ({
  title,
  rightElement,
  showBack,
  onBack,
  enableSearch,
  isSearchVisible,
  onSearchToggle,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search for any item...',
  showCart,
  onCartPress,
  backgroundColor = COLORS.primary,
}: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const headerPaddingTop = 70;
  const headerPaddingBottom = 18;

  return (
    <View
      className="px-6 pb-4 rounded-b-3xl"
      style={{
        backgroundColor,
        paddingTop: insets.top + headerPaddingTop,
        paddingBottom: headerPaddingBottom,
      }}
    >
      {isSearchVisible ? (
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3" onPress={onSearchToggle}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center rounded-xl bg-white px-4">
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              className="ml-2 flex-1 py-3 text-base text-text-primary"
              placeholder={searchPlaceholder}
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus
              style={Platform.select({
                web: { outlineStyle: 'none' },
                default: {},
              }) as any}
            />
          </View>
          {showCart && (
            <TouchableOpacity className="ml-3" onPress={onCartPress}>
              <Ionicons name="cart-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {showBack && (
              <TouchableOpacity
                className="mr-3"
                onPress={() => (onBack ? onBack() : navigation.goBack())}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
            )}
            <Text
              className="text-2xl font-plus-semibold text-white capitalize"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          <View className="flex-row items-center">
            {enableSearch && (
              <TouchableOpacity className="mr-3" onPress={onSearchToggle}>
                <Ionicons name="search" size={24} color={COLORS.white} />
              </TouchableOpacity>
            )}
            {showCart && (
              <TouchableOpacity
                onPress={onCartPress}
                className={rightElement ? 'mr-3' : ''}
              >
                <Ionicons name="cart-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            )}
            {rightElement}
          </View>
        </View>
      )}
    </View>
  );
};
