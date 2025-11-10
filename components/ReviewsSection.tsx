"use client";

import { useEffect, useState } from "react";
import { Star, User, Quote } from "lucide-react";
import { Review } from "@/lib/reviews";

interface ReviewsSectionProps {
  productId?: number; // إذا كان محدد، يعرض تقييمات منتج معين فقط
  limit?: number;
  title?: string;
}

export default function ReviewsSection({
  productId,
  limit = 6,
  title = "آراء عملائنا",
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const url = productId
        ? `/api/reviews?productId=${productId}`
        : `/api/reviews`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // ترتيب حسب الأحدث وتحديد العدد
        const sortedReviews = data.reviews
          .sort(
            (a: Review, b: Review) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, limit);

        setReviews(sortedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
            <Quote size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">
              كن أول من يترك تقييماً! 🌟
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {review.customerName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* اسم المنتج */}
              {!productId && (
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  📦 {review.productName}
                </p>
              )}

              {/* التعليق */}
              <div className="relative">
                <Quote
                  size={24}
                  className="absolute -top-2 -right-2 text-purple-200"
                />
                <p className="text-gray-700 leading-relaxed pr-6">
                  {review.comment}
                </p>
              </div>

              {/* شارة التحقق */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  ✓ عميل موثّق
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة إذا كان هناك المزيد */}
        {reviews.length >= limit && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              وغيرهم الكثير من العملاء السعداء! 🎉
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

