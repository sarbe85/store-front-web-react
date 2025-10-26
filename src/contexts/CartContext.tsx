import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CartItem } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  cartCount: number;
  addToCart: (item: { SKU: string; quantity: number }) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await api.cart.get();
      setCart(response.data || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: { SKU: string; quantity: number }) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await api.cart.add(item);
      await refreshCart();
      toast.success('Item added to cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    }
  };

  const updateQuantity = async (sku: string, quantity: number) => {
    try {
      await api.cart.update(sku, quantity);
      await refreshCart();
    } catch (error: any) {
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const removeFromCart = async (sku: string) => {
    try {
      await api.cart.remove(sku);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.cart.clear();
      setCart([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const cartCount = cart.filter(item => !item.isWishlist).length;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
