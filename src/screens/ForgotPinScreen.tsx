import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthLayout, Input, Button } from '../components';
import { NavigationProp } from '../types/navigation';

const ForgotPinScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Success', {
        message: 'Check your mail inbox for a PIN reset email!',
        navigateTo: 'CreateNewPin',
      });
    }, 1500);
  };

  return (
    <AuthLayout>
      <View className="px-6 pt-8 pb-4">
        {/* Header */}
        <Text className="mb-2 text-center text-2xl font-satoshi-bold text-text-primary leading-tight">
          Forgot PIN
        </Text>
        <Text className="mb-2 text-center text-sm text-text-secondary font-plus-medium leading-tight">
          Recover your PIN
        </Text>

        {/* Email Input */}
        <View className="mt-4">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={isLoading}
          disabled={!email.trim()}
          className="mt-4"
        />
      </View>
    </AuthLayout>
  );
};

export default ForgotPinScreen;
