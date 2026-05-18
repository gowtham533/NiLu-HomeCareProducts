// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("niluCart")) || []; }
    catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("niluWishlist")) || []; }
    catch { return []; }
  });

  // Persist cart to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem("niluCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem("niluWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add product to cart — stores the FULL product object so Cart page has image, name, price etc.
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) return prev; // already in cart, don't duplicate
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (id) =>
    setCartItems(prev => prev.filter(p => p._id !== id));

  // Toggle — if in cart remove it, if not add it
  const toggleCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) return prev.filter(p => p._id !== product._id);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Increase or decrease qty (minimum 1)
  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(p =>
        p._id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (id) =>
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const isInCart     = (id) => cartItems.some(p => p._id === id);
  const isWishlisted = (id) => wishlist.includes(id);

  // Total price considering qty
  const cartTotal = cartItems.reduce(
    (sum, p) => sum + Number(p.price) * (p.qty || 1), 0
  );

  // Total number of individual items (sum of all qtys)
  const cartCount = cartItems.reduce((sum, p) => sum + (p.qty || 1), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      toggleCart,
      updateQty,
      clearCart,
      wishlist,
      toggleWishlist,
      isInCart,
      isWishlisted,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};