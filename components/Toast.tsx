'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Heart, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'cart' | 'wishlist';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-close after 3 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700); // Start exit animation a bit before closing

    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible && !isExiting 
        ? 'translate-x-0 opacity-100' 
        : isExiting 
          ? 'translate-x-full opacity-0'
          : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-dark-300 to-dark-400 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 min-w-[320px] border-2 border-primary-300/40 backdrop-blur-sm relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-300/5 via-accent-600/5 to-primary-300/5 animate-gradient-x bg-[length:200%_auto]" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            type === 'cart' 
              ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/50' 
              : 'bg-gradient-to-br from-red-500/20 to-pink-600/20 border-2 border-red-500/50'
          }`}>
            {type === 'cart' ? (
              <CheckCircle className="w-7 h-7 text-green-400" strokeWidth={2.5} />
            ) : (
              <Heart className="w-7 h-7 text-red-400 fill-current" strokeWidth={2.5} />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-white">
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="relative z-10 h-1.5 bg-dark-400/50 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              type === 'cart' 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{
              animation: 'progress 3s linear forwards'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
