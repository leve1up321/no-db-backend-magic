"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface ReviewFormProps {
  orderId: string;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  orderId,
  productId,
  productName,
  customerName,
  customerEmail,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage({
        type: "error",
        text: "يرجى اختيار تقييم",
      });
      return;
    }

    if (comment.trim().length < 10) {
      setMessage({
        type: "error",
        text: "يرجى كتابة تعليق لا يقل عن 10 أحرف",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          productId,
          productName,
          customerName,
          customerEmail,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message,
        });
        
        // إعادة تعيين النموذج
        setRating(0);
        setComment("");
        
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setMessage({
          type: "error",
          text: data.message || "حدث خطأ أثناء إرسال التقييم",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "حدث خطأ في الاتصال. يرجى المحاولة لاحقاً",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        ⭐ قيّم تجربتك
      </h2>
      <p className="text-gray-600 mb-6">
        منتج: <span className="font-semibold">{productName}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اختيار التقييم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التقييم <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={36}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && "⭐ ممتاز!"}
              {rating === 4 && "👍 جيد جداً"}
              {rating === 3 && "😊 جيد"}
              {rating === 2 && "😐 مقبول"}
              {rating === 1 && "😞 ضعيف"}
            </p>
          )}
        </div>

        {/* التعليق */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            تعليقك <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شاركنا تجربتك مع المنتج..."
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length} / 500 حرف
          </p>
        </div>

        {/* رسالة النجاح أو الخطأ */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              جاري الإرسال...
            </span>
          ) : (
            "إرسال التقييم"
          )}
        </button>

        {/* ملاحظة */}
        <p className="text-xs text-gray-500 text-center">
          💡 سيتم مراجعة تقييمك قبل نشره في الموقع
        </p>
      </form>
    </div>
  );
}

