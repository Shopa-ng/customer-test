import React, { useState } from 'react';
import { View, Text, TextInput, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
  showErrorText?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  showPasswordToggle = false,
  secureTextEntry,
  showErrorText = true,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={containerStyle} className="mb-4">
      {label && (
        <Text className="mb-2 text-[14px] text-text-primary font-plus-medium">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          className={`rounded-md bg-[#EAEAEA] px-3 py-4 text-[12px] text-text-primary ${
            error ? 'border border-accent' : ''
          } ${showPasswordToggle ? 'pr-10' : ''}`}
          placeholderTextColor={COLORS.inputPlaceholder}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            className="absolute right-0 top-0 bottom-0 justify-center px-2"
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.black}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && showErrorText && <Text className="mt-1 text-xs text-error">{error}</Text>}
    </View>
  );
};

export default Input;
