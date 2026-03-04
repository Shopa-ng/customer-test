import React from 'react';
import { View, StatusBar } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';

const TermsPoliciesScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScreenHeader title="Terms & Policies" showBack={true} />
    </View>
  );
};

export default TermsPoliciesScreen;
