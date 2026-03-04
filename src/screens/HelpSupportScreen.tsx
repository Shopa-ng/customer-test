import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';

const HelpSupportScreen: React.FC = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:shopanigeria@gmail.com');
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Help & Support" showBack={true} />

      <View className="px-6 pt-6">
        <Text className="text-xl font-plus-bold text-text-primary mb-4">
          Need help?
        </Text>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleEmail}
        >
          <View className="h-14 w-14 rounded-full bg-primary items-center justify-center mr-4">
            <Ionicons name="mail" size={24} color={COLORS.white} />
          </View>
          <View>
            <Text className="text-base font-plus-medium text-text-primary">
              Send us an email
            </Text>
            <Text className="text-base font-plus-bold text-text-primary">
              shopanigeria@gmail.com
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpSupportScreen;
