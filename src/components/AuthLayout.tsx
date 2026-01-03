import React from 'react';
import { View, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import Logo from './Logo';
import BackgroundPattern from './BackgroundPattern';
import { COLORS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showLogo = true }) => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <BackgroundPattern>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View className="flex-1">
              {showLogo ? (
                <View className="flex-1 items-center justify-center min-h-[120px] py-8">
                  <Logo size="medium" />
                </View>
              ) : (
                <View className="flex-1" />
              )}
              <View className="bg-white rounded-t-2xl">
                {children}
                {/* Safe-area aware bottom spacer to avoid gesture/back conflicts while keeping sheet flush */}
                <View style={{ height: Math.max(8, insets.bottom) }} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BackgroundPattern>
    </View>
  );
};

export default AuthLayout;
