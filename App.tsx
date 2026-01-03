import './global.css';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  useFonts as useGoogleFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AppNavigator } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';

export default function App() {
  const [googleFontsLoaded] = useGoogleFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [localFontsLoaded] = useFonts({
    'Satoshi-Regular': require('./assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Medium': require('./assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-Bold': require('./assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Black': require('./assets/fonts/Satoshi-Black.otf'),
  });

  const fontsLoaded = googleFontsLoaded && localFontsLoaded;

  if (!fontsLoaded) {
    return null;
  }

  const AppText = Text as any;

  if (!AppText.defaultProps) {
    AppText.defaultProps = {};
  }

  AppText.defaultProps.style = [
    AppText.defaultProps.style,
    { fontFamily: 'PlusJakartaSans_400Regular' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
