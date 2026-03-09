import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { getMyOrders, Order } from '../api/orders.api';

type SortOption = 'Most recent' | 'Oldest';
type FilterOption = 'All' | 'Completed' | 'Ongoing' | 'Canceled';
type UIStatus = Exclude<FilterOption, 'All'>;

function mapStatus(backendStatus: string): UIStatus {
  if (backendStatus === 'COMPLETED') return 'Completed';
  if (backendStatus === 'CANCELLED') return 'Canceled';
  return 'Ongoing';
}

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('Most recent');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      setError('Failed to load orders. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
    if (showFilterDropdown) setShowFilterDropdown(false);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
    if (showSortDropdown) setShowSortDropdown(false);
  };

  const displayedOrders = orders
    .map((o) => ({ ...o, uiStatus: mapStatus(o.status) }))
    .filter((o) => selectedFilter === 'All' || o.uiStatus === selectedFilter)
    .sort((a, b) =>
      selectedSort === 'Most recent'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

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
          <Text className="ml-2 text-primary-light font-plus-bold text-sm">SORT BY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center bg-[#D4F8D4] px-4 py-2 rounded-lg ml-4"
          onPress={toggleFilterDropdown}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.primary} />
          <Text className="ml-2 text-primary-light font-plus-bold text-sm">FILTER BY</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdowns */}
      {showSortDropdown && (
        <View className="absolute top-[185px] left-6 z-20 bg-white border-2 border-main rounded-xl p-2 shadow-sm w-[160px]">
          {(['Most recent', 'Oldest'] as SortOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              className="flex-row items-center py-2"
              onPress={() => { setSelectedSort(option); setShowSortDropdown(false); }}
            >
              <View className="w-4 h-4 rounded-full border border-gray mr-2 items-center justify-center">
                {selectedSort === option && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </View>
              <Text className="text-text-primary text-base">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showFilterDropdown && (
        <View className="absolute top-[185px] left-[140px] z-20 bg-white border-2 border-main rounded-xl p-2 shadow-sm w-[160px]">
          {(['All', 'Completed', 'Ongoing', 'Canceled'] as FilterOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              className="flex-row items-center py-2"
              onPress={() => { setSelectedFilter(option); setShowFilterDropdown(false); }}
            >
              <View className="w-4 h-4 rounded-full border border-gray mr-2 items-center justify-center">
                {selectedFilter === option && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </View>
              <Text className="text-text-primary text-base">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Overlay to close dropdowns */}
      {(showSortDropdown || showFilterDropdown) && (
        <Pressable
          className="absolute inset-0 z-0"
          onPress={() => { setShowSortDropdown(false); setShowFilterDropdown(false); }}
        />
      )}

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray text-base text-center">{error}</Text>
        </View>
      ) : displayedOrders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray text-base">No orders to be displayed</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              colors={[COLORS.primary]}
            />
          }
        >
          {displayedOrders.map((order) => (
            <View
              key={order.id}
              className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-light"
            >
              <Text className="text-text-primary font-plus-medium mb-1">
                Order #{order.id.slice(-8).toUpperCase()}
              </Text>
              <Text className="text-gray text-sm mb-2 font-plus-medium">
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
              <View className="flex-row items-center justify-between">
                <View
                  className={`px-3 py-1 rounded-full ${
                    order.uiStatus === 'Completed'
                      ? 'bg-[#D4F8D4]'
                      : order.uiStatus === 'Canceled'
                      ? 'bg-red-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-plus-bold ${
                      order.uiStatus === 'Completed'
                        ? 'text-primary-light'
                        : order.uiStatus === 'Canceled'
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.uiStatus}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OrderDetails', {
                      orderId: order.id,
                      status: order.uiStatus,
                    })
                  }
                >
                  <Text className="text-accent text-base underline decoration-accent">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderHistoryScreen;
