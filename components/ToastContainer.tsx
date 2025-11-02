'use client';

import { useState, useCallback } from 'react';
import Toast from './Toast';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'cart' | 'wishlist';
}

let toastId = 0;
let showToastCallback: ((message: string, type: 'cart' | 'wishlist') => void) | null = null;

export function showToast(message: string, type: 'cart' | 'wishlist') {
  if (showToastCallback) {
    showToastCallback(message, type);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleShowToast = useCallback((message: string, type: 'cart' | 'wishlist') => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const handleCloseToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Set the global callback
  if (typeof window !== 'undefined') {
    showToastCallback = handleShowToast;
  }

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => handleCloseToast(toast.id)}
        />
      ))}
    </>
  );
}

