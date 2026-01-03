import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthLayout, Input, Button } from '../components';
import { NavigationProp } from '../types/navigation';

const CreateNewPinScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);

    if (!newPin.trim() || !confirmPin.trim()) {
      setError('Please fill in both fields');
      return;
    }

    if (newPin.length !== 4 || confirmPin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Success', {
        message: 'Your PIN has been successfully reset!',
        navigateTo: 'Login',
      });
    }, 1500);
  };

  return (
    <AuthLayout>
      <View className="px-6 pt-8 pb-4">
        {/* Header */}
        <Text className="mb-2 text-center text-2xl font-satoshi-bold text-text-primary leading-tight">
          Create New PIN
        </Text>
        <Text className="mb-2 text-center text-sm text-text-secondary font-plus-medium leading-tight">
          Enter a new PIN
        </Text>

        {/* Error Message */}
        {error && (
          <Text className="mb-2 text-center text-sm font-plus-medium text-error leading-tight">
            {error}
          </Text>
        )}

        {/* Enter New PIN Input */}
        <View className="mt-4">
          <Input
            label="Enter New PIN"
            placeholder="Enter your new 4-digit PIN"
            value={newPin}
            onChangeText={setNewPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            error={error || undefined}
            showErrorText={false}
          />
        </View>

        {/* Confirm New PIN Input */}
        <Input
          label="Confirm New PIN"
          placeholder="Confirm your new 4-digit PIN"
          value={confirmPin}
          onChangeText={setConfirmPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          error={error || undefined}
          showErrorText={false}
        />

        {/* Confirm Button */}
        <Button
          title="CONFIRM"
          onPress={handleConfirm}
          loading={isLoading}
          disabled={!newPin.trim() || !confirmPin.trim()}
          className="mt-4"
        />
      </View>
    </AuthLayout>
  );
};

export default CreateNewPinScreen;
