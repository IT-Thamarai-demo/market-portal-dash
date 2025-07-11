import React, { createContext, useContext, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  cloudinaryPublicId?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((product: CartItem) => {
    if (!product.id || !product.price || !product.name) {
      toast({
        title: 'Error',
        description: 'Invalid product data.',
        variant: 'destructive',
      });
      return;
    }
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
      variant: 'default',
    });
  }, [toast]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    if (quantity > 100) {
      toast({
        title: 'Quantity Limit',
        description: 'Maximum quantity is 100.',
        variant: 'destructive',
      });
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [toast]);

  const removeFromCart = useCallback((id: string) => {
    const item = items.find((item) => item.id === id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: 'Removed from Cart',
      description: `${item?.name || 'Item'} has been removed from your cart.`,
      variant: 'destructive',
    });
  }, [items, toast]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart.',
      variant: 'destructive',
    });
  }, [toast]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};