import { ShoppingCart, Heart, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              متجر لفل اب
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              المنتجات
            </Link>
            <Link to="/reviews" className="text-foreground hover:text-primary transition-colors">
              الشبكات
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-colors">
              الأسئلة الشائعة
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              اتصل بنا
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">العربية</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 bg-muted/50">
              <span>SAR</span>
              <span className="text-xs">🇸🇦</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
