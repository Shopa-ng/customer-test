import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ScreenHeader } from '../components/ScreenHeader';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useAuthStore } from '../store/auth.store';
import { updateProfile } from '../api/auth.api';

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { user, setUser, isBiometricEnabled, checkBiometricStatus, enableBiometrics, disableBiometrics } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: user?.phone ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [togglingBiometric, setTogglingBiometric] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
    LocalAuthentication.hasHardwareAsync().then((has) => {
      LocalAuthentication.isEnrolledAsync().then((enrolled) => {
        setBiometricAvailable(has && enrolled);
      });
    });
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      setTogglingBiometric(true);
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric sign-in',
          cancelLabel: 'Cancel',
        });
        if (!result.success) return;
        await enableBiometrics();
        Alert.alert('Success', 'Biometric sign-in enabled.');
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to enable biometrics.';
        Alert.alert('Error', msg);
      } finally {
        setTogglingBiometric(false);
      }
    } else {
      Alert.alert(
        'Disable Biometrics',
        'Are you sure you want to disable biometric sign-in?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              setTogglingBiometric(true);
              try {
                await disableBiometrics();
              } catch (e: any) {
                Alert.alert('Error', e?.message ?? 'Failed to disable biometrics.');
              } finally {
                setTogglingBiometric(false);
              }
            },
          },
        ],
      );
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updated = await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phoneNumber.trim() || undefined,
      });
      setUser(updated);
      navigation.goBack();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? 'Failed to save changes. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Account Settings" showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Input
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            inputClassName="bg-white border border-gray-light"
            placeholder="Enter first name"
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            inputClassName="bg-white border border-gray-light"
            placeholder="Enter last name"
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="phone-pad"
            inputClassName="bg-white border border-gray-light"
            placeholder="Enter phone number"
          />

          {/* Email — read only */}
          <Input
            label="Email Address"
            value={user?.email ?? ''}
            editable={false}
            inputClassName="bg-gray-light/40 border border-gray-light text-text-secondary"
            placeholder="example@mail.com"
          />

          {error && (
            <Text className="text-red-500 text-sm mt-1 mb-2">{error}</Text>
          )}

          {/* Biometric Toggle */}
          {biometricAvailable && (
            <View className="mb-4 flex-row items-center justify-between rounded-xl bg-white border border-gray-light px-4 py-4">
              <View className="flex-1 mr-4">
                <Text className="text-base text-text-primary font-plus-medium">Biometric Sign-in</Text>
                <Text className="text-sm text-text-secondary mt-0.5">Use Face ID or fingerprint to log in</Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={handleBiometricToggle}
                disabled={togglingBiometric}
                trackColor={{ false: COLORS.grayLight, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          )}

          {/* Change PIN */}
          <View className="mt-2 mb-12">
            <Button
              title="Change PIN"
              variant="outline"
              className="w-full border border-gray-light bg-white"
              textClassName="text-text-primary font-plus-medium"
              onPress={() => navigation.navigate('ChangePin')}
              size="large"
              style={{ borderColor: COLORS.grayLight, borderWidth: 1, borderRadius: 16 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView
        edges={['bottom']}
        className="bg-main-bg pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
      >
        <View
          className="px-6"
          style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}
        >
          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
            className="w-full"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AccountSettingsScreen;
