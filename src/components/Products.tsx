import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "15 فكرة مشروع رقمي مربح",
    price: 57.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop",
    category: "كتب رقمية"
  },
  {
    id: 2,
    title: "الربح من المنتجات الرقمية",
    price: 39.00,
    rating: 4,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=500&fit=crop",
    category: "كتب رقمية"
  },
  {
    id: 3,
    title: "الدليل التمهيدي للربح من المنتجات الرقمية",
    price: 4.00,
    rating: 3,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
    category: "كتب رقمية"
  }
];

export const Products = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            منتجاتنا
          </h2>
          <p className="text-muted-foreground text-lg">
            اختر الكتاب المناسب لك وابدأ رحلتك نحو النجاح
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border">
              <Link to={`/product/${product.id}`}>
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-primary/90">
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
              </Link>

              <CardContent className="p-6 space-y-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground mr-2">({product.rating})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs">🇸🇦</span>
                  <span className="text-2xl font-bold text-foreground">{product.price.toFixed(2)} ر.س</span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={() => window.location.href = `/product/${product.id}`}
                >
                  شراء الآن
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-primary/30 hover:bg-primary/10"
                  onClick={() => alert('تمت إضافة المنتج للسلة')}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
