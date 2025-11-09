'use client';

import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice, formatPrice } from '@/lib/currency';
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

  const handleAddToCart = (product: any) => {
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    const productImage = getProductImage(product);
    
    // نحفظ السعر المخفض بـ SAR (discountedPrice) وليس finalPrice
    // لأن AppContext سيحوله تلقائياً للعملة الحالية
    addToCart({
      id: productId,
      name: productName,
      price: priceCalc.discountedPrice, // السعر بـ SAR بعد الخصم
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

  const handleDirectPayment = (product: any) => {
    // التوجيه إلى صفحة checkout مع السعر المحسوب حسب العملة المختارة
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    
    const checkoutUrl = `/checkout?product=${productId}&name=${encodeURIComponent(productName)}&price=${priceCalc.finalPrice.toFixed(2)}&currency=${currency}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => {
        const priceCalc = calculatePrice(product, currency);
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
              <div className="relative h-56 sm:h-64 overflow-hidden group cursor-pointer">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {priceCalc.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    خصم {priceCalc.discountPercentage}%
                  </div>
                )}
                {product.isFree && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    مجاني 🎁
                  </div>
                )}
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              {/* Rating and Wishlist */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-300">{product.rating || '4.5'}</span>
                  <span className="text-xs text-gray-500 mr-1">
                    ({typeof product.buyers === 'string' ? product.buyers : `${product.buyers || 0} مشتري`})
                  </span>
                </div>
                <button
                  onClick={() => handleWishlist(productId)}
                  className="p-2 rounded-full hover:bg-dark-200 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Product Name */}
              <Link href={`/products/${productId}`}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 hover:text-primary-300 transition-colors line-clamp-2 cursor-pointer">
                  {productName}
                </h3>
              </Link>

              {/* Price Section */}
              <div className="mt-auto">
                {priceCalc.finalPrice === 0 ? (
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-green-400">مجاني</p>
                    {priceCalc.originalPrice > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(priceCalc.originalPrice, currency)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl sm:text-3xl font-bold text-primary-300">
                        {priceCalc.finalPrice.toFixed(2)} {priceCalc.symbol}
                      </p>
                    </div>
                    {priceCalc.discountPercentage > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(priceCalc.originalPrice, currency)}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {product.isFree ? (
                    <Link
                      href={`/products/${productId}`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all text-center"
                    >
                      احصل عليه مجاناً
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">أضف للسلة</span>
                      </button>
                      <button
                        onClick={() => handleDirectPayment(product)}
                        className="bg-gradient-to-r from-accent-600 to-primary-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span className="hidden sm:inline">اشترِ الآن</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
