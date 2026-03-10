import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { AuthLayout, Input, Button } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useAuthStore } from '../store/auth.store';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Connect to auth store instead of local state
  const { login, loginWithBiometric, isBiometricEnabled, checkBiometricStatus, isLoading, error, clearError } = useAuthStore();

  // Re-check biometric status and clear stale errors every time screen is focused
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadBiometricState = async () => {
        await checkBiometricStatus();
        const [hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);

        if (isActive) {
          setBiometricAvailable(hasHardware && isEnrolled);
        }
      };

      loadBiometricState();
      clearError();

      return () => {
        isActive = false;
      };
    }, [checkBiometricStatus, clearError])
  );

  // Clear error when user starts typing
  useEffect(() => {
    if (error) clearError();
  }, [email, pin]);

  const handleLogin = async () => {
    if (!email.trim() || !pin.trim()) {
      useAuthStore.setState({ error: 'Please enter your email and PIN.' });
      return;
    }
    try {
      // Calls POST /api/v1/auth/login with { email, password: pin }
      // On success, isAuthenticated becomes true and navigator
      // automatically switches to MainStack. No manual navigation needed.
      await login(email.trim(), pin);
    } catch {
      // Error is already in the store
    }
  };

  const handleForgotPin = () => navigation.navigate('ForgotPin');

  const handleBiometric = async () => {
    // Check if device supports biometrics
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      navigation.navigate('Success', {
        message: 'Biometric authentication is not available on this device.',
        navigateTo: 'Login',
        variant: 'plain',
      });
      return;
    }

    if (!isBiometricEnabled) {
      navigation.navigate('Success', {
        message: 'Biometric sign-in is not set up yet. Enable it in Account Settings.',
        navigateTo: 'Login',
        variant: 'plain',
      });
      return;
    }

    // Prompt the device biometric (Face ID / fingerprint)
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sign in to Shopa',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
    });

    if (!result.success) return;

    try {
      await loginWithBiometric();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Biometric login failed.';
      navigation.navigate('Success', {
        message: msg,
        navigateTo: 'Login',
        variant: 'plain',
      });
    }
  };

  const handleSignUp = () => navigation.navigate('SignUp');

  return (
    <AuthLayout>
      <View className="px-6 pt-10 pb-4">
        <Text className="mb-2 text-center text-3xl font-satoshi-bold text-text-primary leading-tight">
          LOGIN
        </Text>
        <Text className="mb-2 text-center text-base font-plus-medium text-text-secondary leading-tight">
          Sign in to your Shopa account
        </Text>

        {error && (
          <Text className="mb-2 text-center text-base font-plus-medium text-error">
            {error}
          </Text>
        )}

        <View className="mt-4">
          <Input
            label="Email or Phone"
            placeholder="Enter your email or phone number"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Input
          label="PIN"
          placeholder="Enter your 4-digit PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
        />

        <View className="mt-1 mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`mr-2 h-[18px] w-[18px] items-center justify-center rounded-[3px] border ${
                rememberMe ? 'border-primary bg-primary' : 'border-text-primary'
              }`}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </View>
            <Text className="text-sm text-text-primary">Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPin}>
            <Text className="text-sm font-plus-medium text-accent underline">
              Forgot PIN?
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4 flex-row items-center" style={{ gap: 5 }}>
          <View className="flex-1">
            <Button
              title="LOGIN"
              onPress={handleLogin}
              loading={isLoading}
              className="w-full"
            />
          </View>
          <TouchableOpacity
            className={`h-[56px] w-[56px] items-center justify-center rounded-xl ${
              biometricAvailable ? 'bg-primary-light' : 'bg-gray'
            }`}
            onPress={handleBiometric}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="fingerprint"
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="text-base text-text-primary">
            Don't have an account yet?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text className="text-base text-accent underline">Sign up here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;
