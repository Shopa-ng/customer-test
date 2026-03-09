import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import * as DocumentPicker from 'expo-document-picker';
import { getMyOrders, createDispute, Order } from '../api/orders.api';

// Only orders that are in a state valid for a dispute
const DISPUTABLE_STATUSES = ['PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const RaiseOrderDisputeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // Order picker state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form state
  const [complaint, setComplaint] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; uri?: string }[]>([]);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then((all) => {
        const disputable = all.filter((o) => DISPUTABLE_STATUSES.includes(o.status));
        setOrders(disputable);
      })
      .catch(() => setOrdersError('Could not load your orders. Please try again.'))
      .finally(() => setOrdersLoading(false));
  }, []);

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

  const handleSubmit = async () => {
    if (!selectedOrder) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      await createDispute({
        orderId: selectedOrder.id,
        reason: complaint.trim(),
        description: complaint.trim(),
        accountDetails: accountDetails.trim() || undefined,
        // proofUrls would be Cloudinary URLs after upload — for now we pass empty
        // until media upload is wired in
        proofUrls: [],
      });

      navigation.navigate('Success', {
        message:
          'Dispute raised! You will get a response in your mail within 72 hours. Thank you!',
        navigateTo: 'Profile',
        variant: 'plain',
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        'Failed to submit dispute. Please try again.';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
    submitting ||
    !selectedOrder ||
    !complaint.trim() ||
    !accountDetails.trim() ||
    uploadedFiles.length === 0;

  // Short label for an order in the picker
  const orderLabel = (order: Order) => {
    const short = order.orderNumber.slice(-8).toUpperCase();
    const store = order.vendor?.storeName ?? '';
    return `#${short}${store ? ` — ${store}` : ''}`;
  };

  return (
    <View className="flex-1 bg-main-bg">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScreenHeader title="Raise Order Dispute" showBack={true} />

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Order Picker ── */}
        <View className="mb-6">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            Select Order <Text className="text-accent">*</Text>
          </Text>

          {ordersLoading ? (
            <View className="border border-gray-light rounded-xl px-4 py-4 items-center">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : ordersError ? (
            <Text className="text-accent text-sm">{ordersError}</Text>
          ) : orders.length === 0 ? (
            <View className="border border-gray-light rounded-xl px-4 py-4">
              <Text className="text-text-secondary text-sm">
                No eligible orders found. Disputes can only be raised for orders that are
                paid, confirmed, shipped, or delivered.
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                className="border border-gray-light rounded-xl px-4 py-4 flex-row items-center justify-between bg-white"
                onPress={() => setPickerOpen((v) => !v)}
              >
                <Text
                  className={
                    selectedOrder ? 'text-text-primary text-sm' : 'text-text-secondary text-sm'
                  }
                >
                  {selectedOrder ? orderLabel(selectedOrder) : 'Choose an order...'}
                </Text>
                <Ionicons
                  name={pickerOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.gray}
                />
              </TouchableOpacity>

              {pickerOpen && (
                <View className="border border-gray-light rounded-xl bg-white mt-1 overflow-hidden">
                  {orders.map((order, idx) => (
                    <TouchableOpacity
                      key={order.id}
                      className={`px-4 py-3 flex-row items-center justify-between ${
                        idx < orders.length - 1 ? 'border-b border-gray-light' : ''
                      }`}
                      onPress={() => {
                        setSelectedOrder(order);
                        setPickerOpen(false);
                      }}
                    >
                      <View className="flex-1">
                        <Text className="text-text-primary text-sm font-plus-medium">
                          {orderLabel(order)}
                        </Text>
                        <Text className="text-gray text-xs mt-0.5">
                          {order.status} · ₦{Number(order.totalAmount).toLocaleString()}
                        </Text>
                      </View>
                      {selectedOrder?.id === order.id && (
                        <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* ── Complaint ── */}
        <View className="mb-6">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            What is the issue with the order?{' '}
            <Text className="text-accent">*</Text>
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

        {/* ── Account Details ── */}
        <View className="mb-6">
          <Text className="mb-2 text-base text-text-primary font-plus-medium">
            Provide account details in case of refund
            <Text className="text-accent">*</Text>
          </Text>
          <TextInput
            className="border border-gray-light rounded-xl px-3 py-4 text-sm text-text-primary"
            placeholder="e.g 0000000000, UBA bank, Esther Esther"
            placeholderTextColor={COLORS.inputPlaceholder}
            value={accountDetails}
            onChangeText={setAccountDetails}
          />
        </View>

        {/* ── Upload Proof ── */}
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
                <View
                  key={file.name}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-text-primary text-base flex-1 mr-2" numberOfLines={1}>
                    {file.name}
                  </Text>
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

        {submitError && (
          <Text className="text-accent text-sm mb-4">{submitError}</Text>
        )}
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        className="bg-main-bg pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}
      >
        <View
          className="px-6"
          style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}
        >
          <Button
            title={submitting ? 'Submitting...' : 'Submit Order Dispute'}
            onPress={handleSubmit}
            className="w-full"
            disabled={isSubmitDisabled}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RaiseOrderDisputeScreen;
