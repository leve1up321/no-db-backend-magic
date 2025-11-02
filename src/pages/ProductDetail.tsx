import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useParams } from "react-router-dom";

const productData: Record<string, any> = {
  "1": {
    title: "15 فكرة مشروع رقمي مربح",
    price: 57.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop",
    category: "كتب رقمية",
    description: "دليل شامل يحتوي على 15 فكرة مشروع رقمي مربح يمكنك البدء بها اليوم. كل فكرة مشروحة بالتفصيل مع خطوات التنفيذ والأدوات المطلوبة."
  },
  "2": {
    title: "الربح من المنتجات الرقمية",
    price: 39.00,
    rating: 4,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop",
    category: "كتب رقمية",
    description: "تعلم كيف تربح من المنتجات الرقمية بطريقة احترافية. من إنشاء المنتج إلى التسويق والبيع."
  },
  "3": {
    title: "الدليل التمهيدي للربح من المنتجات الرقمية",
    price: 4.00,
    rating: 3,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop",
    category: "كتب رقمية",
    description: "دليل تمهيدي للمبتدئين الذين يريدون الدخول إلى عالم المنتجات الرقمية."
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const product = productData[id || "1"];

  if (!product) {
    return <div>المنتج غير موجود</div>;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full rounded-2xl shadow-2xl"
              />
              <Badge className="absolute top-4 right-4 bg-primary text-lg px-4 py-2">
                {product.category}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{product.title}</h1>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.rating} تقييمات)</span>
              </div>

              <div className="flex items-center gap-3 text-4xl font-bold">
                <span className="text-2xl">🇸🇦</span>
                <span>{product.price.toFixed(2)} ر.س</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4 pt-4">
                <Button 
                  size="lg" 
                  className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  شراء الآن
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                  >
                    إضافة للسلة
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>✓</span>
                  <span>تحميل فوري بعد الشراء</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>✓</span>
                  <span>ضمان استرجاع المبلغ خلال 14 يوم</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>✓</span>
                  <span>دعم فني متواصل</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
