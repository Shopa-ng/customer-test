import React, { useState } from 'react';
import { View, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    fullName: 'Esther Esther',
    phoneNumber: '08012345678',
    email: 'example@mail.com'
  });

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <ScreenHeader 
        title="Account Settings" 
        showBack={true} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Full Name */}
        <Input
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({...formData, fullName: text})}
          className=" border border-gray-light rounded-lg"
          placeholder="Enter full name"
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
          keyboardType="phone-pad"
          className="border border-gray-light rounded-lg"
          placeholder="Enter phone number"
        />

        {/* Email Address - Disabled */}
        <Input
          label="Email Address"
          value={formData.email}
          editable={false}
          className="bg-gray-light/30 border-transparent text-gray"
          placeholder="example@mail.com"
        />

        {/* Change PIN Button */}
        <View className="mt-2 mb-12">
          <Button
            title="Change PIN"
            variant="outline"
            className="self-start items-start pl-4 border border-gray-light bg-white"
            textClassName="text-text-primary font-plus-medium text-left"
            onPress={() => navigation.navigate('ChangePin')} 
            size="medium"
            style={{ borderColor: COLORS.grayLight, borderWidth: 1, borderRadius:8 }}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <SafeAreaView
        edges={['bottom']}
        className="bg-main-bg pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
      >
        <View className="px-6" style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}>
          <Button
            title="Save Changes"
            onPress={() => navigation.goBack()}
            className="w-full"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AccountSettingsScreen;
