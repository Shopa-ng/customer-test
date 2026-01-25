import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPin: undefined;
  CreateNewPin: undefined;
  VerifyEmail: {
    email: string;
  };
  Success: {
    message: string;
    navigateTo: keyof RootStackParamList;
    params?: any;
    variant?: 'default' | 'plain';
  };
  Home: undefined;
  PopularInSchool: undefined;
  Categories: undefined;
  CategoryProducts: {
    categoryId: string;
    title: string;
  };
  Cart: undefined;
  ProductDetail: {
    productId: string;
  };
  Checkout: {
    subtotal: number;
  };
  Profile: undefined;
  AccountSettings: undefined;
  OrderHistory: undefined;
  ChangePin: undefined;
  SavedItems: undefined;
  RaiseOrderDispute: undefined;
  OrderDetails: {
    orderId: string;
    status: 'Completed' | 'Ongoing' | 'Canceled';
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
