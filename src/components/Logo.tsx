import React from 'react';
import { View, Text } from 'react-native';
import ShopaLogo from '../../assets/shopaLogo.svg';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showTagline = false }) => {
  const getLogoWidth = () => {
    switch (size) {
      case 'small':
        return 120;
      case 'large':
        return 220;
      default:
        return 170;
    }
  };

  const width = getLogoWidth();
  const height = (width * 44) / 162; // preserve original SVG aspect ratio from footer logo

  return (
    <View className="items-center">
      <ShopaLogo width={width} height={height} />
      {showTagline && (
        <Text className="mt-3 text-white text-base font-plus-medium">Buy. Sell. Connect.</Text>
      )}
    </View>
  );
};

export default Logo;
