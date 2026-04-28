"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CarEntry } from "@/components/shared/InventoryCard";

interface CartContextType {
  cartItems: CarEntry[];
  addToCart: (car: CarEntry) => void;
  removeFromCart: (carId: string) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CarEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("greenrev-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("greenrev-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (car: CarEntry) => {
    setCartItems((prev) => {
      // Check if already in cart to avoid duplicates
      if (prev.some((item) => item.id === car.id)) return prev;
      return [...prev, car];
    });
    // Open cart when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (carId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== carId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  // Helper to format price strings like "₦270,000,000" to calculate total
  const cartTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(
    cartItems.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
      return total + (isNaN(priceNum) ? 0 : priceNum);
    }, 0),
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
