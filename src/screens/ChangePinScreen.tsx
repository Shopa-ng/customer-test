import React, { useState } from 'react';
import { View, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets  } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

const ChangePinScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
    const insets = useSafeAreaInsets();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const handleSave = () => {
    // Logic to validate and change PIN would go here
    navigation.navigate('Success', {
      message: 'Your PIN has been successfully changed!',
      navigateTo: 'Profile',
      variant: 'plain',
    });
  };

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
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Enter Old PIN */}
        <Input
          label="Enter Old PIN"
          value={oldPin}
          onChangeText={setOldPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          showPasswordToggle
          inputClassName="bg-white border border-gray-light"
          placeholder="Enter old PIN"
        />

        {/* Enter New PIN */}
        <Input
          label="Enter New PIN"
          value={newPin}
          onChangeText={setNewPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          showPasswordToggle
          inputClassName="bg-white border border-gray-light"
          placeholder="XXXX"
        />

        {/* Confirm New PIN */}
        <Input
          label="Confirm New PIN"
          value={confirmNewPin}
          onChangeText={setConfirmNewPin}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          showPasswordToggle
          inputClassName="bg-white border border-gray-light"
          placeholder="XXXX"
        />

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
          onPress={handleSave}
          className="w-full"
          disabled={!oldPin || !newPin || !confirmNewPin}
        />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ChangePinScreen;
