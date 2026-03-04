import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';

const ReferralsScreen: React.FC = () => {
  const referralLink = 'https://shoppa.ng/ref/esther123';

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Referrals" showBack={true} />

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-[300px] h-[300px] items-center justify-center">
          <Ionicons name="gift" size={120} color={COLORS.primary} />
          <Text className="text-text-secondary text-lg font-plus-medium mt-4 text-center">
            Refer friends and earn rewards!
          </Text>
        </View>
      </View>

      <View className="px-6 pb-10">
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
          onPress={handleCopyLink}
          activeOpacity={0.8}
        >
          <Ionicons name="copy-outline" size={20} color={COLORS.white} />
          <Text className="text-white font-plus-bold text-base ml-2 tracking-wider">
            COPY REFERRAL LINK
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferralsScreen;
