'use client';

import { ShoppingCart, Heart, Star, Check, Users, Shield, Zap, CheckCircle, ShoppingBag } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import testimonials from '@/data/testimonials.json';
import Image from 'next/image';
import WhyBuySection from './WhyBuySection';

interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  priceAED: number;
  priceKWD: number;
  priceQAR: number;
  priceBHD: number;
  priceOMR: number;
  priceJOD: number;
  priceEGP: number;
  priceLBP: number;
  priceSYP: number;
  priceIQD: number;
  priceTND: number;
  priceMAD: number;
  priceDZD: number;
  priceUSD: number;
  priceEUR: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  buyers: number;
  inStock: boolean;
  featured: boolean;
  features: string[];
}

export default function ProductDetail({ product }: { product: Product }) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  const getPrice = () => {
    switch (currency) {
      case 'AED': return product.priceAED;
      case 'KWD': return product.priceKWD;
      case 'QAR': return product.priceQAR;
      case 'BHD': return product.priceBHD;
      case 'OMR': return product.priceOMR;
      case 'JOD': return product.priceJOD;
      case 'EGP': return product.priceEGP;
      case 'LBP': return product.priceLBP;
      case 'SYP': return product.priceSYP;
      case 'IQD': return product.priceIQD;
      case 'TND': return product.priceTND;
      case 'MAD': return product.priceMAD;
      case 'DZD': return product.priceDZD;
      case 'USD': return product.priceUSD;
      case 'EUR': return product.priceEUR;
      default: return product.price;
    }
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'AED': return 'د.إ';
      case 'KWD': return 'د.ك';
      case 'QAR': return 'ر.ق';
      case 'BHD': return 'د.ب';
      case 'OMR': return 'ر.ع';
      case 'JOD': return 'د.أ';
      case 'EGP': return 'ج.م';
      case 'LBP': return 'ل.ل';
      case 'SYP': return 'ل.س';
      case 'IQD': return 'ع.د';
      case 'TND': return 'د.ت';
      case 'MAD': return 'د.م';
      case 'DZD': return 'د.ج';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return 'ر.س';
    }
  };

  const price = getPrice();
  const currencySymbol = getCurrencySymbol();

  // Get testimonials for this product
  const productTestimonials = testimonials.filter(t => t.productId === product.id);

  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(product.id);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  return (
    <section className="pt-24 pb-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Image + Description */}
          <div className="animate-scale-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Description under image */}
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Right Column: Product Info */}
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

        {/* Product Reviews - Mobile & Desktop Optimized */}
        {productTestimonials.length > 0 && (
          <div className="mt-12 sm:mt-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                تقييمات المنتج
              </h2>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-300/10 border border-primary-300/30 rounded-xl">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm sm:text-base font-bold text-white">
                  {(productTestimonials.reduce((acc, t) => acc + t.rating, 0) / productTestimonials.length).toFixed(1)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">
                  ({productTestimonials.length} تقييم)
                </span>
              </div>
            </div>

            {/* Reviews Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {productTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed flex-grow">
                    "{testimonial.text}"
                  </p>
                  
                  {/* User Info */}
                  <div className="pt-4 border-t border-primary-300/10 mt-auto">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm sm:text-base font-bold text-white truncate">
                        {testimonial.name}
                      </p>
                      {testimonial.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-300/20 border border-primary-300/40 rounded-full text-primary-300 text-xs font-bold flex-shrink-0">
                          <CheckCircle className="w-3 h-3 fill-primary-300" />
                          موثق
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      {testimonial.verified && (
                        <span className="text-green-400 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          قام بالشراء
                        </span>
                      )}
                      <span className="text-gray-500">{testimonial.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Buy Section */}
        <WhyBuySection compact />
      </div>
    </section>
  );
}
