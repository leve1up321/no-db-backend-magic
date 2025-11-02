import ProductGrid from './ProductGrid';

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            منتجاتنا المميزة
          </h2>
          <p className="text-lg text-gray-600">
            اختر من بين مجموعة واسعة من المنتجات الرقمية عالية الجودة
          </p>
        </div>
        <ProductGrid />
      </div>
    </section>
  );
}
