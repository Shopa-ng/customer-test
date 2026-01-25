import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="py-2 flex-row items-center">
      <View
        className="h-5 w-5 rounded-full mr-3 items-center justify-center"
        style={{
          borderWidth: 1,
          borderColor: COLORS.primaryLight,
        }}
      >
        {selected && (
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: COLORS.primary }}
          />
        )}
      </View>
      <Text className="text-base text-text-primary">{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioOption;
