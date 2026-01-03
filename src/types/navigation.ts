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
  };
  Home: undefined;
  PopularInSchool: undefined;
  Categories: undefined;
  ProductDetail: {
    productId: string;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
