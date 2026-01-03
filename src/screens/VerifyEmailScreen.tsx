import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthLayout, Button } from '../components';
import { NavigationProp, RootStackParamList } from '../types/navigation';

type VerifyEmailRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerifyEmailRouteProp>();
  const { email } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    // Simulate resend code
    setError(null);
    console.log('Resending code to:', email);
  };

  const handleContinue = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      setError('Incorrect OTP!');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo, show error. In real app, verify OTP
      if (otpValue !== '1234') {
        setError('Incorrect OTP!');
      } else {
        navigation.navigate('Success', {
          message:
            'Email verified successfully! You can now proceed to sign in to your Shopa account.',
          navigateTo: 'Login',
        });
      }
    }, 1500);
  };

  return (
    <AuthLayout>
      <View className="px-6 pt-8 pb-4">
        {/* Header */}
        <Text className="mb-2 text-center text-2xl font-satoshi-bold text-text-primary leading-tight">
          Enter OTP
        </Text>
        <Text className="mb-2 text-center text-sm font-plus-medium text-text-secondary leading-tight">
          Enter the 4-digit OTP sent to your mail
        </Text>

        {/* Error Message */}
        {error && (
          <Text className="mb-2 text-center text-sm font-plus-medium text-accent leading-tight">
            {error}
          </Text>
        )}

        {/* OTP Input Boxes */}
        <View className="mt-4 mb-4 flex-row justify-center space-x-3">
          {otp.map((digit, index) => (
            <View key={index} className="mx-1.5">
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className={`h-[56px] w-[56px] rounded-xl border-2 ${
                  error && !digit
                    ? 'border-accent bg-gray-light'
                    : digit
                      ? 'border-accent bg-gray-light'
                      : 'border-gray-light bg-gray-light'
                } text-center text-xl font-plus-semibold text-text-primary`}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        {/* Resend Code */}
        <View className="mb-6 flex-row items-center justify-center">
          <Text className="text-sm text-text-primary">Didn't get a code? </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text className="text-sm font-plus-medium text-accent underline">Resend code</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={isLoading}
          disabled={otp.join('').length !== 4}
        />
      </View>
    </AuthLayout>
  );
};

export default VerifyEmailScreen;
