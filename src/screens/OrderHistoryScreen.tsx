import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

type SortOption = 'Most recent' | 'Oldest';
type FilterOption = 'All' | 'Completed' | 'Ongoing' | 'Canceled';
type OrderStatus = Exclude<FilterOption, 'All'>;

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('Most recent');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');

  const orders: { id: string; status: OrderStatus; date: string }[] = [
    { id: '12345678', status: 'Completed', date: '2026-10-22T14:00:00Z' },
    { id: '87654321', status: 'Ongoing', date: '2026-10-21T12:00:00Z' },
    { id: '56781234', status: 'Canceled', date: '2026-10-20T18:00:00Z' },
    { id: '11223344', status: 'Completed', date: '2026-10-23T09:00:00Z' },
    { id: '99887766', status: 'Ongoing', date: '2026-10-24T10:00:00Z' },
  ];

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
    if (showFilterDropdown) setShowFilterDropdown(false);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
    if (showSortDropdown) setShowSortDropdown(false);
  };

  return (
    <View className="flex-1 bg-main-bg">
      {/* Header */}
      <ScreenHeader title="Order History" showBack={true} />

      {/* Toolbar */}
      <View className="px-6 py-4 flex-row z-10">
        <TouchableOpacity
          className="flex-row items-center bg-[#D4F8D4] px-4 py-2 rounded-lg"
          onPress={toggleSortDropdown}
        >
          <Ionicons name="swap-vertical" size={16} color={COLORS.primary} />
          <Text className="ml-2 text-primary-light font-plus-bold text-xs">SORT BY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-[#D4F8D4] px-4 py-2 rounded-lg ml-4"
          onPress={toggleFilterDropdown}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
          <Text className="ml-2 text-primary-light font-plus-bold text-xs">FILTER BY</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdowns */}
      {showSortDropdown && (
        <View className="absolute top-[185px] left-6 z-20 bg-white border-2 border-main rounded-xl p-2 shadow-sm w-[160px]">
          <TouchableOpacity 
            className="flex-row items-center py-2"
            onPress={() => {
              setSelectedSort('Most recent');
              setShowSortDropdown(false);
            }}
          >
            <View className="w-4 h-4 rounded-full border border-gray mr-2 items-center justify-center">
               {selectedSort === 'Most recent' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </View>
            <Text className="text-text-primary text-sm">Most recent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center py-2"
            onPress={() => {
              setSelectedSort('Oldest');
              setShowSortDropdown(false);
            }}
          >
            <View className="w-4 h-4 rounded-full border border-gray mr-2 items-center justify-center">
               {selectedSort === 'Oldest' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </View>
            <Text className="text-text-primary text-sm">Oldest</Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilterDropdown && (
        <View className="absolute top-[185px] left-[140px] z-20 bg-white border-2 border-main rounded-xl p-2 shadow-sm w-[160px]">
          {(['All', 'Completed', 'Ongoing', 'Canceled'] as FilterOption[]).map((option) => (
            <TouchableOpacity 
              key={option}
              className="flex-row items-center py-2"
              onPress={() => {
                setSelectedFilter(option);
                setShowFilterDropdown(false);
              }}
            >
              <View className="w-4 h-4 rounded-full border border-gray mr-2 items-center justify-center">
                 {selectedFilter === option && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </View>
              <Text className="text-text-primary text-sm">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Overlay to close dropdowns */}
      {(showSortDropdown || showFilterDropdown) && (
        <Pressable 
          className="absolute inset-0 z-0" 
          onPress={() => {
            setShowSortDropdown(false);
            setShowFilterDropdown(false);
          }}
        />
      )}

      {/* Order List */}
      {(
        (selectedFilter === 'All'
          ? orders
          : orders.filter((o) => o.status === selectedFilter)
        ).length === 0
      ) ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray text-sm">No orders to be displayed</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 20 }}>
          {(selectedFilter === 'All'
            ? orders
            : orders.filter((o) => o.status === selectedFilter)
          )
            .sort((a, b) =>
              selectedSort === 'Most recent'
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((order, index) => (
            <View key={index} className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-light">
              <Text className="text-text-primary font-plus-medium mb-1">
                Order #{order.id}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: order.id, status: order.status })}>
                <Text className="text-accent text-sm underline decoration-accent">
                  View Order Details
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderHistoryScreen;
