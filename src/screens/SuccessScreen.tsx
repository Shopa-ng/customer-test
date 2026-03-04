import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundPattern, Logo } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp, RootStackParamList } from '../types/navigation';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;

const SuccessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { message, navigateTo, params, variant } = route.params;

  const handleClose = () => {
    if (params) {
      navigation.navigate(navigateTo as any, params);
    } else {
      navigation.navigate(navigateTo as any);
    }
  };

  const isPlain = variant === 'plain';

  // Shared content card
  const SuccessCard = (
    <View className={`w-full max-w-sm rounded-2xl bg-white px-8 py-14 shadow-lg shadow-black/20 ${isPlain ? 'border border-main' : ''}`}>
      {/* Close button */}
      <TouchableOpacity className="absolute right-4 top-4" onPress={handleClose}>
        <View className={`h-6 w-6 items-center justify-center rounded-full ${isPlain ? 'border border-primary' : 'border-2 border-primary'}`}>
          <Ionicons name="close" size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>

      {/* Success checkmark */}
      <View className="mb-6 items-center">
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-light">
          <Ionicons name="checkmark" size={40} color={COLORS.white} />
        </View>
      </View>

      {/* Message */}
      <Text className="text-center text-base font-plus-medium leading-6 text-primary-light">
        {message}
      </Text>
    </View>
  );

  if (isPlain) {
    return (
      <View className="flex-1 bg-main-bg">
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundLight} />
        <View className="flex-1 items-center px-4">
          <View className="flex-1" />
          {SuccessCard}
          <View className="flex-1" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <BackgroundPattern>
        <View className="flex-1 items-center px-4">
          {/* Logo Centered in Top Space */}
          <View className="flex-1 w-full items-center justify-center">
            <Logo size="medium" />
          </View>

          {/* Success Modal Card */}
          {SuccessCard}

          {/* Bottom Spacer to balance the layout */}
          <View className="flex-1" />
        </View>
      </BackgroundPattern>
    </View>
  );
};

export default SuccessScreen;