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

  const getPrice = (product: any) => {
    let amount, originalAmount, symbol;
    
    switch (currency) {
      case 'AED': 
        amount = product.priceAED ?? product.price ?? 0;
        originalAmount = product.originalPriceAED || (product.priceAED ?? product.price ?? 0) * 2;
        symbol = 'د.إ';
        break;
      case 'KWD': 
        amount = product.priceKWD ?? product.price ?? 0;
        originalAmount = product.originalPriceKWD || (product.priceKWD ?? product.price ?? 0) * 2;
        symbol = 'د.ك';
        break;
      case 'QAR': 
        amount = product.priceQAR ?? product.price ?? 0;
        originalAmount = product.originalPriceQAR || (product.priceQAR ?? product.price ?? 0) * 2;
        symbol = 'ر.ق';
        break;
      case 'BHD': 
        amount = product.priceBHD ?? product.price ?? 0;
        originalAmount = product.originalPriceBHD || (product.priceBHD ?? product.price ?? 0) * 2;
        symbol = 'د.ب';
        break;
      case 'OMR': 
        amount = product.priceOMR ?? product.price ?? 0;
        originalAmount = product.originalPriceOMR || (product.priceOMR ?? product.price ?? 0) * 2;
        symbol = 'ر.ع';
        break;
      case 'JOD': 
        amount = product.priceJOD ?? product.price ?? 0;
        originalAmount = product.originalPriceJOD || (product.priceJOD ?? product.price ?? 0) * 2;
        symbol = 'د.أ';
        break;
      case 'EGP': 
        amount = product.priceEGP ?? product.price ?? 0;
        originalAmount = product.originalPriceEGP || (product.priceEGP ?? product.price ?? 0) * 2;
        symbol = 'ج.م';
        break;
      case 'LBP': 
        amount = product.priceLBP ?? product.price ?? 0;
        originalAmount = product.originalPriceLBP || (product.priceLBP ?? product.price ?? 0) * 2;
        symbol = 'ل.ل';
        break;
      case 'SYP': 
        amount = product.priceSYP ?? product.price ?? 0;
        originalAmount = product.originalPriceSYP || (product.priceSYP ?? product.price ?? 0) * 2;
        symbol = 'ل.س';
        break;
      case 'IQD': 
        amount = product.priceIQD ?? product.price ?? 0;
        originalAmount = product.originalPriceIQD || (product.priceIQD ?? product.price ?? 0) * 2;
        symbol = 'ع.د';
        break;
      case 'TND': 
        amount = product.priceTND ?? product.price ?? 0;
        originalAmount = product.originalPriceTND || (product.priceTND ?? product.price ?? 0) * 2;
        symbol = 'د.ت';
        break;
      case 'MAD': 
        amount = product.priceMAD ?? product.price ?? 0;
        originalAmount = product.originalPriceMAD || (product.priceMAD ?? product.price ?? 0) * 2;
        symbol = 'د.م';
        break;
      case 'DZD': 
        amount = product.priceDZD ?? product.price ?? 0;
        originalAmount = product.originalPriceDZD || (product.priceDZD ?? product.price ?? 0) * 2;
        symbol = 'د.ج';
        break;
      case 'USD': 
        amount = product.priceUSD ?? product.price ?? 0;
        originalAmount = product.originalPriceUSD || (product.priceUSD ?? product.price ?? 0) * 2;
        symbol = '$';
        break;
      case 'EUR': 
        amount = product.priceEUR ?? product.price ?? 0;
        originalAmount = product.originalPriceEUR || (product.priceEUR ?? product.price ?? 0) * 2;
        symbol = '€';
        break;
      default: 
        amount = product.price ?? 0;
        originalAmount = product.originalPrice || (product.price ?? 0) * 2;
        symbol = 'ر.س';
    }
    
    const discountPercentage = Math.round(((originalAmount - amount) / originalAmount) * 100);
    
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
                {product.featured ?? false && (
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
                        i < Math.floor(product.rating ?? 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  {(product.rating ?? 0).toFixed(1)}
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
