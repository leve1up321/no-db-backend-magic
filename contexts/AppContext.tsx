'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'SAR' | 'AED' | 'USD' | 'EUR';
type Theme = 'light' | 'dark';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (id: number) => {
    setWishlist(prev => [...prev, id]);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(itemId => itemId !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
