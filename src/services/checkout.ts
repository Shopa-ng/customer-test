export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'transfer' | 'card';

export interface DeliveryInfo {
  address: string;
  savedAt?: string;
}

export interface PickupLocation {
  id: string;
  name: string;
}

let mockSavedDeliveryInfo: DeliveryInfo | null = null;

export const getSavedDeliveryInfo = async (): Promise<DeliveryInfo | null> => {
  return mockSavedDeliveryInfo;
};

export const saveDeliveryInfo = async (info: DeliveryInfo): Promise<void> => {
  mockSavedDeliveryInfo = info;
};

export const clearSavedDeliveryInfo = async (): Promise<void> => {
  mockSavedDeliveryInfo = null;
};

export const getPickupLocations = async (): Promise<PickupLocation[]> => {
  return [
    { id: 'loc-1', name: 'Main Gate' },
    { id: 'loc-2', name: 'Library Front' },
    { id: 'loc-3', name: 'Student Union' },
  ];
};

