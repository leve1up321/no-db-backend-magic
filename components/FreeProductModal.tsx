'use client';

import { useState } from 'react';
import { X, Mail, Phone, Download } from 'lucide-react';

interface FreeProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  downloadUrl?: string;
}

export default function FreeProductModal({ isOpen, onClose, productName, downloadUrl }: FreeProductModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would normally send the data to your backend
    console.log('Free product request:', { email, phone, productName });

    setSubmitted(true);
    setIsSubmitting(false);

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
      setPhone('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-dark-400 rounded-2xl border border-primary-300/20 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                احصل على المنتج مجاناً! 🎉
              </h2>
              <p className="text-gray-400">
                {productName}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pr-10 pl-4 py-3 bg-dark-300 border border-primary-300/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-300/50 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رقم الهاتف (اختياري)
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 XXX XXX XXX"
                    className="w-full pr-10 pl-4 py-3 bg-dark-300 border border-primary-300/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-300/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : (
                  'احصل على المنتج مجاناً'
                )}
              </button>

              {/* Note */}
              <p className="text-xs text-gray-500 text-center">
                سيتم إرسال رابط التحميل إلى بريدك الإلكتروني
              </p>
            </form>
          </div>
        ) : (
          /* Success Message */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              تم بنجاح! ✅
            </h3>
            <p className="text-gray-400 mb-4">
              تم إرسال رابط التحميل إلى بريدك الإلكتروني
            </p>
            <p className="text-sm text-gray-500">
              سيتم إغلاق هذه النافذة تلقائياً...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

