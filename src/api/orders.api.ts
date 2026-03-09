import apiClient from './client';

// ─── Order Types ───

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  deliveryAddress?: string;
  deliveryMethod?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  deliveryAddress: string | null;
  deliveryMethod: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  vendorId: string;
  orderItems: {
    id: string;
    quantity: number;
    price: string;
    product: {
      name: string;
      images: string[];
    };
  }[];
  vendor: {
    storeName: string;
  };
  payment?: {
    status: string;
  };
}

// ─── Dispute Types ───

export interface CreateDisputeInput {
  orderId: string;
  reason: string;
  description?: string;
  accountDetails?: string;
  proofUrls?: string[];
}

export interface Dispute {
  id: string;
  orderId: string;
  reason: string;
  description?: string;
  accountDetails?: string;
  proofUrls: string[];
  status: string;
  resolution?: string;
  createdAt: string;
}

// ─── Payment Types ───

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface PaymentVerifyResponse {
  id: string;
  status: string;
  amount: string;
  reference: string;
  provider: string;
}

// ─── Order API Calls ───

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const response = await apiClient.post<Order>('/orders', data);
  return response.data;
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/orders/my-orders');
  return response.data;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${orderId}`);
  return response.data;
}

// ─── Dispute API Calls ───

export async function createDispute(data: CreateDisputeInput): Promise<Dispute> {
  const response = await apiClient.post<Dispute>('/disputes', data);
  return response.data;
}

// ─── Payment API Calls ───

export async function initializePayment(orderId: string): Promise<PaymentInitResponse> {
  const response = await apiClient.post<PaymentInitResponse>('/payments/initialize', {
    orderId,
  });
  return response.data;
}

export async function verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
  const response = await apiClient.get<PaymentVerifyResponse>(
    `/payments/verify/${reference}`,
  );
  return response.data;
}

export async function getPaymentStatus(orderId: string): Promise<PaymentVerifyResponse> {
  const response = await apiClient.get<PaymentVerifyResponse>(`/payments/${orderId}`);
  return response.data;
}
