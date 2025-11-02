import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const reviews = [
  { name: "عبدالله الحربي", date: "منذ أسبوعين", text: "كنت دايم أقول \"المنتجات الرقمية مو لي\"، بس بعد ما جربت الطريقة اللي بشرحها الكتاب فهمت السالفة، وبديت فعلاً أشتغل على أول منتج لي." },
  { name: "نورة الشهراني", date: "منذ 3 أيام", text: "أول مرة أشتري كتاب أونلاين وأطبّق منه فعليًا! الشرح بسيط كأنك تتعلم من أخوك الكبير اللي فاهم السوق." },
  { name: "فهد الغامدي", date: "منذ 5 أيام", text: "ما راح أكذب، بالبداية شكّيت، بس والله المعلومات اللي فيه تستاهل كل ريال، فيها تفاصيل ما تحصلها في اليوتيوب أبد." },
  { name: "ريم القحطاني", date: "منذ أسبوع", text: "ما توقعت أستفيد لهالدرجة، صرت أعرف أبيع قوالب رقمية وسويتها فعلاً وبدأت أبيع كم نسخة." },
  { name: "خالد الزهراني", date: "منذ 4 أيام", text: "حبيت إن المحتوى مرتب، مو حوسة. كل شي خطوة بخطوة ومو معقد، حتى للي ما عنده خبرة." },
  { name: "مشاعل المطيري", date: "منذ 6 أيام", text: "أكثر شي أعجبني إن كل فكرة قابلة للتطبيق، مو بس كلام تحفيزي فاضي، فعلاً تقدر تبدأ." }
];

export const Reviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const autoScroll = setInterval(() => {
      scrollAmount += scrollStep;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = scrollAmount;
      }
    }, scrollInterval);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">التقييمات</h2>
          <p className="text-muted-foreground text-lg">
            أكثر من 300 شخص جرّبوا الدليل وبدأوا مشاريعهم الرقمية 💡
          </p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden px-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Duplicate reviews for seamless loop */}
        {[...reviews, ...reviews].map((review, index) => (
          <Card key={index} className="min-w-[350px] bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <p className="text-foreground mb-4 leading-relaxed">{review.text}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">{review.name}</span>
                <span className="text-muted-foreground">{review.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
