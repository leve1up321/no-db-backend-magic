import { Navbar } from "@/components/Navbar";
import { Products as ProductsSection } from "@/components/Products";
import { Footer } from "@/components/Footer";

const Products = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-24">
        <ProductsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Products;
