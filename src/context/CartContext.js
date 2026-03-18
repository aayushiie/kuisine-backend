import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems,     setCartItems]     = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const addToCart = (item) => setCartItems(prev => {
    const ex = prev.find(i => i.id === item.id);
    if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...item, qty: 1 }];
  });

  const removeFromCart = (id) => setCartItems(prev => {
    const ex = prev.find(i => i.id === id);
    if (ex?.qty > 1) return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    return prev.filter(i => i.id !== id);
  });

  const deleteFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const clearCart = () => { setCartItems([]); setSelectedCourt(null); };

  const totalItems  = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalAmount = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, selectedCourt, setSelectedCourt, addToCart, removeFromCart, deleteFromCart, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
