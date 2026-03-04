import React, { useState } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import * as DocumentPicker from 'expo-document-picker';

const RaiseOrderDisputeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [orderId, setOrderId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; uri?: string }[]>([]);
  const [orderIdError, setOrderIdError] = useState('');

  const handleSubmit = () => {
    if (orderId.length !== 8) {
      setOrderIdError('Incorrect Order ID!');
      return;
    }
    // Navigate to success screen
    navigation.navigate('Success', {
      message: 'Dispute raised! You will get a response in your mail within 72 hours. Thank you!',
      navigateTo: 'Profile',
      variant: 'plain',
    });
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setUploadedFiles((prev) => [
        ...prev,
        { name: asset.name ?? 'Attachment', uri: asset.uri },
      ]);
    }
  };

  const handleRemoveFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <ScreenHeader 
        title="Raise Order Dispute" 
        showBack={true} 
      />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Order ID Error */}
        {orderIdError ? (
          <Text className="text-accent font-plus-medium text-base mb-2">{orderIdError}</Text>
        ) : null}

        {/* Order ID Input */}
        <View className="mb-4">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            Enter Valid 8–digit Order ID <Text className="text-accent">*</Text>
          </Text>
          <TextInput
             className={`border rounded-xl px-3 py-4 text-sm text-text-primary ${orderIdError ? 'border-accent' : 'border-gray-light'}`}
             placeholder="XXXXXXXX"
             placeholderTextColor={COLORS.inputPlaceholder}
             value={orderId}
             onChangeText={(text) => {
               setOrderId(text);
               if (orderIdError) setOrderIdError('');
             }}
             keyboardType="numeric"
             maxLength={8}
          />
        </View>

        {/* Complaint Text Area */}
        <View className="mb-6">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            What is the issue with the order? <Text className="text-accent">*</Text>
          </Text>
          <TextInput
            className="border border-gray-light rounded-xl px-3 py-3 text-sm text-text-primary h-[120px]"
            placeholder="Describe your complaint..."
            placeholderTextColor={COLORS.inputPlaceholder}
            value={complaint}
            onChangeText={setComplaint}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Account Details for Refund */}
        <View className="mb-6">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            Provide account details in case of refund<Text className="text-accent">*</Text>
          </Text>
          <TextInput
            className="border border-gray-light rounded-xl px-3 py-4 text-sm text-text-primary"
            placeholder="e.g 0000000000, UBA bank, Esther Esther"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={accountDetails}
            onChangeText={setAccountDetails}
          />
        </View>

        {/* Upload Proof */}
        <View className="mb-8">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            Upload proof <Text className="text-accent">*</Text>
          </Text>
          
          {uploadedFiles.length === 0 ? (
            <TouchableOpacity 
              className="bg-primary rounded-xl items-center justify-center"
              style={{ height: 53 }}
              onPress={handleUpload}
            >
              <Text className="text-white font-plus-medium text-base">
                Click to upload proof (PDF, JPEG, PNG, etc)
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              {uploadedFiles.map((file) => (
                <View key={file.name} className="flex-row items-center justify-between py-2">
                  <Text className="text-text-primary text-base">{file.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveFile(file.name)}>
                    <Ionicons name="close" size={20} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={handleUpload}>
                <Text className="text-primary font-plus-bold text-base underline mt-2">
                  + Upload additional proof
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
      </ScrollView>
      
      <SafeAreaView
        edges={['bottom']}
        className="bg-main-bg pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
      >
        <View className="px-6" style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}>
          <Button
            title="Submit Order Dispute"
            onPress={handleSubmit}
            className="w-full"
            disabled={!orderId || orderId.length !== 8 || !complaint || !accountDetails || uploadedFiles.length === 0}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RaiseOrderDisputeScreen;
