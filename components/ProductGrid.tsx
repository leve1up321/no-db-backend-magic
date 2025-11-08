'use client';

import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import products from '@/data/products.json';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductGrid() {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  // Helper function to get unified product ID
  const getProductId = (product: any) => product.id ?? product.product_id ?? 0;

  // Helper function to get unified product name
  const getProductName = (product: any) => product.name ?? product.product_name ?? 'منتج';

  // Helper function to get unified product image
  const getProductImage = (product: any) => product.image ?? product.product_image ?? '/placeholder.jpg';

  // Currency exchange rates (SAR as base currency)
  const exchangeRates: Record<string, number> = {
    'SAR': 1,
    'AED': 0.98,      // 1 SAR = 0.98 AED
    'KWD': 0.082,     // 1 SAR = 0.082 KWD
    'QAR': 0.97,      // 1 SAR = 0.97 QAR
    'BHD': 0.10,      // 1 SAR = 0.10 BHD
    'OMR': 0.10,      // 1 SAR = 0.10 OMR
    'JOD': 0.19,      // 1 SAR = 0.19 JOD
    'EGP': 13.12,     // 1 SAR = 13.12 EGP
    'LBP': 23850,     // 1 SAR = 23,850 LBP
    'SYP': 3360,      // 1 SAR = 3,360 SYP
    'IQD': 349,       // 1 SAR = 349 IQD
    'TND': 0.83,      // 1 SAR = 0.83 TND
    'MAD': 2.66,      // 1 SAR = 2.66 MAD
    'DZD': 35.70,     // 1 SAR = 35.70 DZD
    'USD': 0.27,      // 1 SAR = 0.27 USD
    'EUR': 0.25,      // 1 SAR = 0.25 EUR
  };

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      'AED': 'د.إ',
      'SAR': 'ر.س',
      'BHD': 'د.ب',
      'KWD': 'د.ك',
      'OMR': 'ر.ع',
      'QAR': 'ر.ق',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
    };
    return symbols[curr] || 'ر.س';
  };

  const getPrice = (product: any) => {
    const basePrice = product.price ?? 0;
    const baseOriginalPrice = product.originalPrice || basePrice;
    const rate = exchangeRates[currency] || 1;
    
    const amount = basePrice * rate;
    const originalAmount = baseOriginalPrice * rate;
    const symbol = getCurrencySymbol(currency);
    const discountPercentage = basePrice > 0 
      ? Math.round(((baseOriginalPrice - basePrice) / baseOriginalPrice) * 100)
      : 0;
    
    return { amount, originalAmount, symbol, discountPercentage };
  };

  const handleAddToCart = (product: any) => {
    const { amount } = getPrice(product);
    const productId = getProductId(product);
    const productName = getProductName(product);
    const productImage = getProductImage(product);
    
    addToCart({
      id: productId,
      name: productName,
      price: amount,
      image: productImage,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = (productId: number) => {
    if (!wishlist.includes(productId)) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  const handleDirectPayment = async (product: any) => {
    try {
      const { amount } = getPrice(product);
      const productName = getProductName(product);
      
      showToast('جاري تحضير صفحة الدفع... ⏳', 'cart');
      
      const response = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amount, 
          currency: currency,
          productName: productName,
          message: `دفع مقابل ${productName}`,
          test: true // غيّر إلى false للدفع الحقيقي
        }),
      });

      const data = await response.json();
      
      if (data.redirect_url) {
        // Redirect to Ziina payment page
        window.location.href = data.redirect_url;
      } else {
        showToast('حدث خطأ في إنشاء عملية الدفع. حاول مرة أخرى.', 'cart');
        console.error("Payment error:", data);
      }
    } catch (error) {
      showToast('حدث خطأ في الاتصال. حاول مرة أخرى.', 'cart');
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => {
        const { amount, originalAmount, symbol, discountPercentage } = getPrice(product);
        const productId = getProductId(product);
        const productName = getProductName(product);
        const productImage = getProductImage(product);
        const isInWishlist = wishlist.includes(productId);
        
        return (
          <div
            key={productId}
            className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Product Image */}
            <Link href={`/products/${productId}`}>
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden group cursor-pointer">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-400/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured Badge */}
                {(product as any).featured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-accent-500/30">
                    مميز ⭐
                  </div>
                )}
                
                {/* Quick View on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link
                    href={`/products/${productId}`}
                    className="w-full block text-center bg-primary-300 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors touch-manipulation"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              {/* Title */}
              <Link href={`/products/${productId}`}>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 line-clamp-2 hover:text-primary-300 transition-colors cursor-pointer">
                  {productName}
                </h3>
              </Link>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < Math.floor((product as any).rating ?? 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  {((product as any).rating ?? 0).toFixed(1)}
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-primary-300/10">
                <div className="flex-1">
                  {/* Original Price (Crossed Out) */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm sm:text-base text-gray-500 line-through">
                      {originalAmount.toFixed(2)} {symbol}
                    </span>
                    <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                      خصم {discountPercentage}%
                    </span>
                  </div>
                  {/* Current Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                      {amount.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold">
                      {symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-300" />
                    <span className="text-xs text-primary-300 font-semibold">تسليم فوري</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(productId)}
                    className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 touch-manipulation ${
                      isInWishlist
                        ? 'bg-accent-600 text-white'
                        : 'bg-dark-300/80 text-gray-400 hover:bg-accent-600/20 hover:text-accent-600'
                    }`}
                    aria-label="إضافة إلى المفضلة"
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2.5 sm:p-3 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-primary-300/30 transition-all duration-300 active:scale-95 touch-manipulation"
                    aria-label="إضافة إلى السلة"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="flex gap-2 mt-3 sm:hidden">
                <button
                  onClick={() => handleDirectPayment(product)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 active:scale-95 touch-manipulation flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>دفع مباشر</span>
                </button>
                <Link
                  href={`/products/${productId}`}
                  className="px-4 py-3 bg-primary-300/20 hover:bg-primary-300/30 border border-primary-300/40 text-primary-300 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 touch-manipulation flex items-center justify-center"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
