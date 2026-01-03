import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import ShopaSectionBackground from '../../assets/bg.svg';

interface BackgroundPatternProps {
  children?: React.ReactNode;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ children }) => {
  return (
    <View className="flex-1 bg-primary">
      {/** Use live window dimensions so the pattern scales on rotation/tablets */}
      <ShopaSectionBackground
        width={useWindowDimensions().width}
        height={useWindowDimensions().height}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      {children}
    </View>
  );
};

export default BackgroundPattern;
