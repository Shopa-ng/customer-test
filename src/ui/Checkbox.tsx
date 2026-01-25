import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8} className="flex-row items-center py-2">
      <View
  className="mr-3 h-4 w-4"
  style={{
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    padding: 1,
  }}
>
  {checked && (
    <View
      className="flex-1"
      style={{ backgroundColor: COLORS.primary }}
    />
  )}
</View>

      <Text className="text-sm text-text-primary font-plus-medium">{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
