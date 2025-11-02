import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              متجر لفل اب
            </span>
          </h1>

          {/* Subtitle with Icon */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">💡</span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              ابدأ من الصفر وابنِ أول دخل رقمي لك اليوم!
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            حوّل مهاراتك ووقتك إلى دخل حقيقي. انضم لآلاف الأشخاص اللي حققوا حلمهم في العمل الحر والربح من الإنترنت.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              onClick={() => window.location.href = '/contact'}
            >
              <span>ابدأ رحلتك الآن</span>
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              onClick={() => window.location.href = '/products'}
            >
              تسوق الآن
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
    </section>
  );
};
