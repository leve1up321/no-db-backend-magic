'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, Users, Shield, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import testimonials from '@/data/testimonials.json';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  priceAED: number;
  priceUSD: number;
  priceEUR: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  buyers: number;
  inStock: boolean;
  featured: boolean;
  features: string[];
}

export default function ProductDetail({ product }: { product: Product }) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();
  const [quantity, setQuantity] = useState(1);

  const price = currency === 'AED' ? product.priceAED : currency === 'USD' ? product.priceUSD : currency === 'EUR' ? product.priceEUR : product.price;
  const currencySymbol = currency === 'AED' ? 'د.إ' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'ر.س';

  // Get testimonials for this product
  const productTestimonials = testimonials.filter(t => t.productId === product.id);

  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
      });
    }
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(product.id);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="animate-scale-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slide-up">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Rating and Buyers */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {product.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviews} تقييم)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Users className="w-5 h-5" />
                <span>{product.buyers.toLocaleString()} مشتري</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {price.toFixed(2)} {currencySymbol}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المميزات:
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                الكمية:
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <ShoppingCart className="w-5 h-5" />
                أضف للسلة
              </button>
              <button
                onClick={handleWishlist}
                className={`p-4 border-2 rounded-lg transition ${
                  isInWishlist
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-600 dark:hover:border-primary-400'
                }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-center">
                <Zap className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">تسليم فوري</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">دفع آمن</p>
              </div>
              <div className="text-center">
                <Check className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">ضمان الجودة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        {productTestimonials.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              تقييمات المنتج
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">"{testimonial.text}"</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(testimonial.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
