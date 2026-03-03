import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
  CategoryProductsScreen,
  CartScreen,
  CheckoutScreen,
  ProfileScreen,
  AccountSettingsScreen,
  OrderHistoryScreen,
  ChangePinScreen,
  SavedItemsScreen,
  RaiseOrderDisputeScreen,
  OrderDetailsScreen,
} from '../screens';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/auth.store';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Auth Screens ───
// Shown when user is NOT logged in
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="ForgotPin"
        component={ForgotPinScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="CreateNewPin"
        component={CreateNewPinScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}

// ─── Main App Screens ───
// Shown when user IS logged in
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PopularInSchool" component={PopularInSchoolScreen} />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      <Stack.Screen name="RaiseOrderDispute" component={RaiseOrderDisputeScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

// ─── Root Navigator ───
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing, initializeAuth } = useAuthStore();

  // On app launch, check for a stored session
  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading spinner while checking stored credentials
  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.primary,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
