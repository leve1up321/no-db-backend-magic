import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">اتصل بنا</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نحب أن نسمع منك! لا تتردد في التواصل معنا عبر أي من الطرق التالية. فريق الدعم جاهز لمساعدتك في كل خطوة من رحلتك الرقمية
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold">🎯 جاهز للبدء؟</h3>
            <p className="text-xl text-muted-foreground">
              كل يوم تأجّله هو فرصة ضائعة! ابدأ مشروعك الرقمي اليوم واحصل على دخلك الأول
            </p>
            <Button 
              size="lg"
              className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              <span>ابدأ الآن</span>
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
