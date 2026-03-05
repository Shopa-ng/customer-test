import { create } from 'zustand';

// ─── Types ───

export interface CartItem {
  id: string; // product ID
  name: string;
  price: number;
  quantity: number;
  image: string | null; // Cloudinary URL or null
  vendorName: string;
  vendorId: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    vendorName: string;
    vendorId: string;
    description?: string;
  }, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

// ─── Store ───

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        // Product already in cart — increase quantity
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }
      // New product — add to cart
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            vendorName: product.vendorName,
            vendorId: product.vendorId,
            description: product.description,
          },
        ],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    }));
  },

  incrementQuantity: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    }));
  },

  decrementQuantity: (productId) => {
    const item = get().items.find((i) => i.id === productId);
    if (item && item.quantity <= 1) {
      get().removeItem(productId);
    } else {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      }));
    }
  },

  clearCart: () => set({ items: [] }),

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
