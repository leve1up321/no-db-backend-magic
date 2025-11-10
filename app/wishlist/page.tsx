'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import Link from 'next/link';
import Image from 'next/image';
import products from '@/data/products.json';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, currency } = useApp();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    const filteredProducts = products.filter(p => wishlist.includes(p.product_id));
    setWishlistProducts(filteredProducts);
  }, [wishlist]);

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'AED': return 'د.إ';
      case 'SAR': return 'ر.س';
      case 'BHD': return 'د.ب';
      case 'KWD': return 'د.ك';
      case 'OMR': return 'ر.ع';
      case 'QAR': return 'ر.ق';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      default: return 'ر.س';
    }
  };

  const getPrice = (product: any) => {
    switch (currency) {
      case 'AED': return product.priceAED ?? product.price ?? 0;
      case 'SAR': return product.price ?? 0;
      case 'BHD': return product.priceBHD ?? product.price ?? 0;
      case 'KWD': return product.priceKWD ?? product.price ?? 0;
      case 'OMR': return product.priceOMR ?? product.price ?? 0;
      case 'QAR': return product.priceQAR ?? product.price ?? 0;
      case 'USD': return product.priceUSD ?? product.price ?? 0;
      case 'EUR': return product.priceEUR ?? product.price ?? 0;
      case 'GBP': return product.priceUSD ? product.priceUSD * 0.79 : (product.price ?? 0) * 0.79;
      case 'INR': return product.priceUSD ? product.priceUSD * 83 : (product.price ?? 0) * 83;
      default: return product.price ?? 0;
    }
  };

  const handleAddToCart = (product: any) => {
    const price = getPrice(product);
    addToCart({
      id: product.product_id,
      name: product.product_name,
      price: price,
      image: product.product_image,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    showToast('تمت إزالة المنتج من المفضلة', 'wishlist');
  };

  if (wishlistProducts.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <Heart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                قائمة الأمنيات فارغة
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <ArrowRight className="w-5 h-5" />
                تصفح المنتجات
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              قائمة الأمنيات ❤️
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              لديك {wishlistProducts.length} {wishlistProducts.length === 1 ? 'منتج' : 'منتجات'} في قائمة المفضلة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in group"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.product_image}
                    alt={product.product_name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      مميز
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.product_id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition group/btn"
                  >
                    <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <Link href={`/products/${product.product_id}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition">
                      {product.product_name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({product.reviews} تقييم)
                    </span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {getPrice(product).toFixed(2)} {getCurrencySymbol()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
            >
              <ArrowRight className="w-5 h-5" />
              متابعة التسوق
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
