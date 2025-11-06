'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, Users, Shield, Zap, CheckCircle, ShoppingBag, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import testimonials from '@/data/testimonials.json';
import Image from 'next/image';
import WhyBuySection from './WhyBuySection';
import FreeProductModal from './FreeProductModal';

interface ProductSection {
  title?: string;
  items?: string[];
}

interface ProductSections {
  features?: ProductSection;
  whatYouWillLearn?: ProductSection;
  requirements?: ProductSection;
  whatYouWillGet?: ProductSection;
}

interface Product {
  // New schema fields
  product_id?: number;
  product_name?: string;
  product_name_en?: string;
  product_image?: string;
  download_url?: string;
  filename?: string;
  file_size_mb?: number;
  tags?: string[];
  active?: boolean;
  
  // Legacy fields (for backward compatibility)
  id?: number;
  name?: string;
  nameEn?: string;
  shortDescription?: string;
  description?: string;
  sections?: ProductSections;
  price?: number;
  priceAED?: number;
  priceKWD?: number;
  priceQAR?: number;
  priceBHD?: number;
  priceOMR?: number;
  priceJOD?: number;
  priceEGP?: number;
  priceLBP?: number;
  priceSYP?: number;
  priceIQD?: number;
  priceTND?: number;
  priceMAD?: number;
  priceDZD?: number;
  priceUSD?: number;
  priceEUR?: number;
  currency?: string;
  category?: string;
  image?: string;
  rating?: number;
  buyers?: number | string;
  inStock?: boolean;
  featured?: boolean;
  features?: string[];
}

export default function ProductDetail({ product }: { product?: Product }) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();
  const [showFreeModal, setShowFreeModal] = useState(false);

  // Early return if no product
  if (!product) {
    return (
      <section className="pt-20 sm:pt-24 pb-12 bg-dark-500 transition-colors duration-300">
        <div className="container-mobile">
          <div className="text-center text-white">
            <p className="text-xl">المنتج غير موجود</p>
          </div>
        </div>
      </section>
    );
  }

  // Helper function to get unified product ID
  const getProductId = () => product.id ?? product.product_id ?? 0;

  // Helper function to get unified product name
  const getProductName = () => product.name ?? product.product_name ?? 'منتج';

  // Helper function to get unified product image
  const getProductImage = () => product.image ?? product.product_image ?? '/placeholder.jpg';

  const getPrice = () => {
    switch (currency) {
      case 'AED': return product.priceAED ?? product.price ?? 0;
      case 'KWD': return product.priceKWD ?? product.price ?? 0;
      case 'QAR': return product.priceQAR ?? product.price ?? 0;
      case 'BHD': return product.priceBHD ?? product.price ?? 0;
      case 'OMR': return product.priceOMR ?? product.price ?? 0;
      case 'JOD': return product.priceJOD ?? product.price ?? 0;
      case 'EGP': return product.priceEGP ?? product.price ?? 0;
      case 'LBP': return product.priceLBP ?? product.price ?? 0;
      case 'SYP': return product.priceSYP ?? product.price ?? 0;
      case 'IQD': return product.priceIQD ?? product.price ?? 0;
      case 'TND': return product.priceTND ?? product.price ?? 0;
      case 'MAD': return product.priceMAD ?? product.price ?? 0;
      case 'DZD': return product.priceDZD ?? product.price ?? 0;
      case 'USD': return product.priceUSD ?? product.price ?? 0;
      case 'EUR': return product.priceEUR ?? product.price ?? 0;
      default: return product.price ?? 0;
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
  const productId = getProductId();
  const productName = getProductName();
  const productImage = getProductImage();

  // Get testimonials for this product
  const productTestimonials = testimonials.filter(t => t.productId === productId);

  const isInWishlist = wishlist.includes(productId);

  const handleAddToCart = () => {
    // Check if product is free
    if (price === 0 && (product as any).isFree) {
      setShowFreeModal(true);
      return;
    }
    
    addToCart({
      id: productId,
      name: productName,
      price: price,
      image: productImage,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  const handlePayment = async () => {
    try {
      showToast('جاري تحضير صفحة الدفع... ⏳', 'cart');
      
      const response = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: price, 
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
    <section className="pt-20 sm:pt-24 pb-12 bg-dark-500 transition-colors duration-300">
      <div className="container-mobile">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="animate-scale-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-400 shadow-2xl">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="animate-slide-up space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-4 py-2 bg-primary-300/20 border border-primary-300/40 text-primary-300 rounded-xl text-sm font-bold">
                {product.category === 'ebooks' ? 'كتاب رقمي' : product.category ?? 'منتج رقمي'}
              </span>
            </div>

            {/* Product Title - Large & Prominent */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {productName}
            </h1>

            {/* Short Description - Simple & Clear */}
            {product.shortDescription && (
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed" style={{ fontSize: '16px' }}>
                {product.shortDescription}
              </p>
            )}

            {/* Rating and Buyers */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating ?? 0)
                        ? 'text-yellow-400 fill-yellow-400'
                         : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-white font-bold text-lg">
                  {product.rating ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-primary-300" />
                <span className="font-semibold">
                  {typeof product.buyers === 'string' 
                    ? product.buyers 
                    : `${(product.buyers ?? 0).toLocaleString()} مشتري`}
                </span>
              </div>
            </div>

            {/* Price - Prominent */}
            <div className="flex items-center gap-4 p-4 sm:p-6 bg-dark-300/50 border border-primary-300/20 rounded-2xl">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">السعر</p>
                {(product as any).originalPrice && price === 0 ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-lg sm:text-xl text-gray-500 line-through">
                      {(product as any).originalPrice.toFixed(2)} {currencySymbol}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl sm:text-4xl font-extrabold text-green-400">
                        مجاني! 🎉
                      </p>
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm font-bold">
                        خصم 100%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                    {price.toFixed(2)} {currencySymbol}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm">تسليم فوري</span>
              </div>
            </div>

            {/* CTA Buttons - Full Width Mobile */}
            <div className="space-y-3">
              {/* Buy Now / Direct Payment Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handlePayment}
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-green-500/30 active:scale-95 transition-all duration-300 touch-manipulation"
                  style={{ fontSize: '16px' }}
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  استثمر الآن ⚡
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primary-300 to-accent-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-primary-300/30 active:scale-95 transition-all duration-300 touch-manipulation"
                  style={{ fontSize: '16px' }}
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  أضف للسلة
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">دفع آمن</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">تحميل فوري</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">ضمان الجودة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 sm:mt-16">
            <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                عن المنتج
              </h2>
              <div className="prose prose-invert max-w-none">
                {product.description.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  // Check if it's a heading (starts with emoji or bullet)
                  const isHeading = paragraph.match(/^[📘📚💡🎁🧩🎯🚀⚡📦📈📌•]/);
                  
                  if (isHeading) {
                    return (
                      <h3 key={index} className="text-lg sm:text-xl font-bold text-primary-300 mt-6 mb-3 first:mt-0">
                        {paragraph}
                      </h3>
                    );
                  }
                  
                  return (
                    <p key={index} className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sectioned Details - Mobile First */}
        {product.sections && (
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Features Section */}
              {product.sections.features && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.features.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.features.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Will Learn Section */}
              {product.sections.whatYouWillLearn && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.whatYouWillLearn.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.whatYouWillLearn.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements Section */}
              {product.sections.requirements && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.requirements.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.requirements.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Will Get Section */}
              {product.sections.whatYouWillGet && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.whatYouWillGet.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.whatYouWillGet.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Reviews - Mobile & Desktop Optimized */}
        {productTestimonials.length > 0 && (
          <div className="mt-12 sm:mt-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
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
                    <div className="mb-2">
                      <p className="text-sm sm:text-base font-bold text-white truncate">
                        {testimonial.name}
                      </p>
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
        <WhyBuySection />
      </div>

      {/* Free Product Modal */}
      <FreeProductModal
        isOpen={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        productName={productName}
        downloadUrl={(product as any).download_url}
      />
    </section>
  );
}
