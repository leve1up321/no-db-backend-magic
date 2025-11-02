'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastCount = 0;
let toastCallbacks: ((toast: Toast) => void)[] = [];

export const toast = {
  success: (message: string) => {
    const newToast = { id: toastCount++, message, type: 'success' as ToastType };
    toastCallbacks.forEach(cb => cb(newToast));
  },
  error: (message: string) => {
    const newToast = { id: toastCount++, message, type: 'error' as ToastType };
    toastCallbacks.forEach(cb => cb(newToast));
  },
  info: (message: string) => {
    const newToast = { id: toastCount++, message, type: 'info' as ToastType };
    toastCallbacks.forEach(cb => cb(newToast));
  },
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const callback = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };

    toastCallbacks.push(callback);

    return () => {
      toastCallbacks = toastCallbacks.filter(cb => cb !== callback);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-up ${getColors(toast.type)}`}
        >
          {getIcon(toast.type)}
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-75 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

