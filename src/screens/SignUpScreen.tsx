import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthLayout, Input, Button } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { useAuthStore } from '../store/auth.store';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [university, setUniversity] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Connect to auth store — signup auto-logs in on success
  const { signup, isLoading, error: storeError, clearError } = useAuthStore();

  // Combine local validation errors with API errors
  const error = localError || storeError;

  // Clear errors when user types
  useEffect(() => {
    if (localError) setLocalError(null);
    if (storeError) clearError();
  }, [fullName, phoneNumber, email, pin, confirmPin, university]);

  const universities = [
    'Crawford University',
    'University of Lagos',
    'University of Ibadan',
    'Obafemi Awolowo University',
    'University of Nigeria',
    'Ahmadu Bello University',
  ];

  const handleSignUp = async () => {
    // Client-side validation
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !pin.trim() || !confirmPin.trim() || !university || !agreedToTerms) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (pin !== confirmPin) {
      setLocalError('PINs do not match');
      return;
    }

    if (pin.length !== 4) {
      setLocalError('PIN must be exactly 4 digits');
      return;
    }

    try {
      const [firstName, ...rest] = fullName.trim().split(' ');
      const lastName = rest.join(' ') || firstName;

      // This calls POST /api/v1/auth/register and auto-logs in on success.
      // The auth store sets isAuthenticated = true, which triggers the
      // navigator to switch to MainStack automatically.
      await signup({
        firstName,
        lastName,
        email: email.trim(),
        password: pin,
        phone: phoneNumber.trim(),
      });

      // If we get here, registration succeeded and user is auto-logged in.
      // The navigator will switch to MainStack automatically.
      // No need for navigation.navigate('Home').
    } catch {
      // Error is already set in the store
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const openComingSoon = (title: string) => {
    navigation.navigate('Success', {
      message: `${title} is not available yet.`,
      navigateTo: 'SignUp',
      variant: 'plain',
    });
  };

  return (
    <AuthLayout showLogo={false}>
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <Text className="mb-2 text-center text-3xl font-satoshi-bold text-text-primary leading-tight">
          SIGN UP
        </Text>
        <Text className="mb-2 text-center text-base text-text-secondary font-plus-medium leading-tight">
          Create a new Shopa account
        </Text>

        {/* Error Message */}
        {error && (
          <Text className="mb-2 text-center text-sm font-plus-medium text-error">
            {error}
          </Text>
        )}

        {/* Full Name Input */}
        <View className="mt-4">
          <Text className="mb-2 text-base text-text-primary">
            Enter your full name<Text className="text-accent">*</Text>
          </Text>
          <Input
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        {/* Phone Number Input */}
        <View>
          <Text className="mb-2 text-base text-text-primary">
            Enter your contact phone number<Text className="text-accent">*</Text>
          </Text>
          <Input
            placeholder="0XXXXXXXXXX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>

        {/* Email Input */}
        <View>
          <Text className="mb-2 text-base text-text-primary">
            Enter your contact email address<Text className="text-accent">*</Text>
          </Text>
          <Input
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* PIN Input */}
        <View>
          <Text className="mb-2 text-base text-text-primary">
            Create PIN<Text className="text-accent">*</Text>
          </Text>
          <Input
            placeholder="Enter your 4-digit PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>

        {/* Confirm PIN Input */}
        <View>
          <Text className="mb-2 text-base text-text-primary">
            Confirm PIN<Text className="text-accent">*</Text>
          </Text>
          <Input
            placeholder="Confirm your 4-digit PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            error={pin && confirmPin && pin !== confirmPin ? 'PINs do not match' : undefined}
            showErrorText={true}
          />
        </View>

        {/* University Dropdown */}
        <View>
          <Text className="mb-2 text-base text-text-primary">
            Select your university<Text className="text-accent">*</Text>
          </Text>
          <TouchableOpacity
            className="h-[56px] flex-row items-center justify-between rounded-xl border border-gray-light bg-gray-light px-4"
            onPress={() => setShowUniversityDropdown(!showUniversityDropdown)}
          >
            <Text className={university ? 'text-text-primary' : 'text-text-secondary'}>
              {university || 'Select your university'}
            </Text>
            <Ionicons
              name={showUniversityDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {showUniversityDropdown && (
            <View className="mt-2 rounded-xl border border-gray-light bg-white">
              {universities.map((uni, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-3 ${index !== universities.length - 1 ? 'border-b border-gray-light' : ''}`}
                  onPress={() => {
                    setUniversity(uni);
                    setShowUniversityDropdown(false);
                  }}
                >
                  <Text className="text-text-primary">{uni}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Terms and Conditions Checkbox */}
        <TouchableOpacity
          className="mb-6 mt-4 flex-row items-start"
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View
            className={`mr-3 mt-1 h-[18px] w-[18px] items-center justify-center rounded-[3px] border ${
              agreedToTerms ? 'border-primary bg-primary' : 'border-text-primary'
            }`}
          >
            {agreedToTerms && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
          </View>
          <Text className="flex-1 text-base text-text-primary flex-wrap">
            Yes, I agree to the{' '}
            <Text
              className="text-accent underline"
              onPress={() => openComingSoon('Terms and Conditions')}
            >
              Terms and Conditions
            </Text>{' '}
            <Text className="text-accent">{'&'}</Text>{' '}
            <Text
              className="text-accent underline"
              onPress={() => openComingSoon('Privacy Policy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <Button
          title="SIGN UP"
          onPress={handleSignUp}
          loading={isLoading}
          disabled={
            !fullName.trim() ||
            !phoneNumber.trim() ||
            !email.trim() ||
            !pin.trim() ||
            !confirmPin.trim() ||
            !university ||
            !agreedToTerms
          }
          className="mb-4"
        />

        {/* Sign In Link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-base text-text-primary">Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text className="text-base text-accent underline">Sign in here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default SignUpScreen;
