"use client";

import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/cart-drawer";

export function CartDrawerWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    const handleCloseCart = () => setIsOpen(false);

    window.addEventListener('open-cart', handleOpenCart);
    window.addEventListener('close-cart', handleCloseCart);

    return () => {
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('close-cart', handleCloseCart);
    };
  }, []);

  return <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} />;
}

export function openCart() {
  window.dispatchEvent(new Event('open-cart'));
}

export function closeCart() {
  window.dispatchEvent(new Event('close-cart'));
}