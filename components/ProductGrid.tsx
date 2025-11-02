'use client';

import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import products from '@/data/products.json';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductGrid() {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  const getPrice = (product: any) => {
    switch (currency) {
      case 'AED': return { amount: product.priceAED, symbol: 'د.إ' };
      case 'KWD': return { amount: product.priceKWD, symbol: 'د.ك' };
      case 'QAR': return { amount: product.priceQAR, symbol: 'ر.ق' };
      case 'BHD': return { amount: product.priceBHD, symbol: 'د.ب' };
      case 'OMR': return { amount: product.priceOMR, symbol: 'ر.ع' };
      case 'JOD': return { amount: product.priceJOD, symbol: 'د.أ' };
      case 'EGP': return { amount: product.priceEGP, symbol: 'ج.م' };
      case 'LBP': return { amount: product.priceLBP, symbol: 'ل.ل' };
      case 'SYP': return { amount: product.priceSYP, symbol: 'ل.س' };
      case 'IQD': return { amount: product.priceIQD, symbol: 'ع.د' };
      case 'TND': return { amount: product.priceTND, symbol: 'د.ت' };
      case 'MAD': return { amount: product.priceMAD, symbol: 'د.م' };
      case 'DZD': return { amount: product.priceDZD, symbol: 'د.ج' };
      case 'USD': return { amount: product.priceUSD, symbol: '$' };
      case 'EUR': return { amount: product.priceEUR, symbol: '€' };
      default: return { amount: product.price, symbol: 'ر.س' };
    }
  };

  const handleAddToCart = (product: any) => {
    const { amount } = getPrice(product);
    addToCart({
      id: product.id,
      name: product.name,
      price: amount,
      image: product.image,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = (productId: number) => {
    if (!wishlist.includes(productId)) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => {
        const { amount, symbol } = getPrice(product);
        const isInWishlist = wishlist.includes(product.id);
        
        return (
          <div
            key={product.id}
            className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Product Image */}
            <Link href={`/products/${product.id}`}>
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden group cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-400/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-accent-500/30">
                    مميز ⭐
                  </div>
                )}
                
                {/* Quick View on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link
                    href={`/products/${product.id}`}
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
              <Link href={`/products/${product.id}`}>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 hover:text-primary-300 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  ({product.reviews})
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-primary-300/10">
                <div className="flex-1">
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
                    onClick={() => handleWishlist(product.id)}
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

              {/* Mobile CTA Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-3 sm:hidden bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-300/30 transition-all duration-300 active:scale-95 touch-manipulation flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>اشترِ الآن</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

