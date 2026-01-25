import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  className,
  textClassName,
  style,
}) => {
  const baseClasses = 'rounded-xl items-center justify-center';
  const sizeClasses =
    size === 'small' ? 'py-2 px-4' : size === 'medium' ? 'py-3 px-5' : 'py-4 px-6';

  let variantClasses = '';
  switch (variant) {
    case 'secondary':
      variantClasses = 'bg-gray';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border border-primary';
      break;
    default:
      variantClasses = 'bg-primary-light';
  }

  const disabledClasses = disabled || loading ? 'opacity-60' : '';

  const buttonClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${
    className ?? ''
  }`.trim();

  const baseTextClasses = 'text-base font-plus-semibold text-center';
  const colorClasses = variant === 'outline' ? 'text-primary' : 'text-white';
  const textClasses = `${baseTextClasses} ${colorClasses} ${textClassName ?? ''}`.trim();

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
