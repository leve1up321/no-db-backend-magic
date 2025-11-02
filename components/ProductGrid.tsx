'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';
import products from '@/data/products.json';

export default function ProductGrid() {
  const handleAddToCart = (productName: string) => {
    toast.success(`تمت إضافة ${productName} إلى السلة`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          {/* Product Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4">
              {product.inStock ? (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  متوفر
                </span>
              ) : (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  غير متوفر
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews} تقييم)
              </span>
            </div>

            {/* Price and Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {product.price} ر.س
                </p>
              </div>
              <button
                onClick={() => handleAddToCart(product.name)}
                disabled={!product.inStock}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  product.inStock
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                أضف للسلة
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

