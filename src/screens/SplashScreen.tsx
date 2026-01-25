import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundPattern, Logo } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleWelcome = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const swipeUpGesture = React.useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY([-10, 10])
      .failOffsetX([-20, 20])
      .onEnd((event) => {
        if (event.translationY < -60) {
          runOnJS(handleWelcome)();
        }
      });
  }, [handleWelcome]);

  return (
    <BackgroundPattern>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <GestureDetector gesture={swipeUpGesture}>
        <View className="flex-1 justify-between pb-12">
          {/* Logo Section */}
          <View className="flex-1 items-center justify-center">
            <Logo size="large" showTagline />
          </View>
          {/* Welcome Button Section */}
          <TouchableOpacity className="items-center py-4" activeOpacity={1}>
            <Ionicons name="chevron-up" size={20} color="white" />
            <Ionicons name="chevron-up" size={20} color="white" style={{ marginTop: -12 }} />
            <Text className="mt-1 text-white text-base font-plus-medium leading-tight">Welcome</Text>
          </TouchableOpacity>
        </View>
      </GestureDetector>
    </BackgroundPattern>
  );
};

export default SplashScreen;
