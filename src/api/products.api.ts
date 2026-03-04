import apiClient from './client';

// ─── Types ───

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  campusId: string;
  vendorId: string;
  vendor?: {
    id: string;
    storeName: string;
    rating: number;
  };
  category?: {
    id: string;
    name: string;
  };
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

// ─── API Calls ───

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  campusId?: string;
  categoryId?: string;
  search?: string;
}): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products', { params });
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

export async function getCategoryById(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

export async function searchProducts(query: string, campusId?: string): Promise<ProductsResponse> {
  return getProducts({ search: query, campusId });
}
