import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  LoginScreen,
  ForgotPinScreen,
  CreateNewPinScreen,
  SuccessScreen,
  VerifyEmailScreen,
  SignUpScreen,
  PopularInSchoolScreen,
  HomeScreen,
  ProductDetailScreen,
  CategoriesScreen,
} from '../screens';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PopularInSchool" component={PopularInSchoolScreen} />
        <Stack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

        <Stack.Screen
          name="ForgotPin"
          component={ForgotPinScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="CreateNewPin"
          component={CreateNewPinScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
