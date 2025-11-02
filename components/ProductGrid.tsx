'use client';

import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import products from '@/data/products.json';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductGrid() {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  const getPrice = (product: any) => {
    switch (currency) {
      case 'USD':
        return { amount: product.priceUSD, symbol: '$' };
      case 'EUR':
        return { amount: product.priceEUR, symbol: '€' };
      default:
        return { amount: product.price, symbol: 'ر.س' };
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product) => {
        const { amount, symbol } = getPrice(product);
        const isInWishlist = wishlist.includes(product.id);
        
        return (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Product Image */}
            <Link href={`/products/${product.id}`}>
              <div className="relative h-48 overflow-hidden group cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 z-10">
                  {product.inStock ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      متوفر
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      غير متوفر
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleWishlist(product.id);
                  }}
                  className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  />
                </button>
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 md:p-6 flex flex-col flex-1">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ({product.reviews})
                </span>
              </div>

              {/* Price and Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {amount.toFixed(2)} {symbol}
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    product.inStock
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="whitespace-nowrap">أضف للسلة</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
