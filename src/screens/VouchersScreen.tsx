import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';

const VouchersScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Vouchers" showBack={true} />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray text-lg font-plus-medium text-center">
          You don't have any available{'\n'}voucher currently
        </Text>
      </View>
    </View>
  );
};

export default VouchersScreen;
