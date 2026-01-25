import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface QuantityBoxProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

const QuantityBox: React.FC<QuantityBoxProps> = ({ value, onChange, min = 1, max }) => {
  const decrement = () => {
    const next = Math.max(min, value - 1);
    if (next !== value) onChange(next);
  };
  const increment = () => {
    const next = max ? Math.min(max, value + 1) : value + 1;
    if (next !== value) onChange(next);
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity onPress={decrement} className='border border-gray-light rounded-lg p-1' accessibilityRole="button">
        <Ionicons name="remove" size={16} color={COLORS.gray} />
      </TouchableOpacity>
      <Text className="mx-3 text-sm text-text-primary">{value}</Text>
      <TouchableOpacity onPress={increment} className='border border-gray-light rounded-lg p-1' accessibilityRole="button">
        <Ionicons name="add" size={16} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );
};

export default QuantityBox;
