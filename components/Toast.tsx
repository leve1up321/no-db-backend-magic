'use client';

import { useEffect } from 'react';
import { CheckCircle, Heart, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'cart' | 'wishlist';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px] border-2 border-primary-500">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === 'cart' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          {type === 'cart' ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400 fill-current" />
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

