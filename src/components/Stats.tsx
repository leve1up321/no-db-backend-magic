export const Stats = () => {
  const stats = [
    { number: "350+", label: "عميل راضي" },
    { number: "2,500+", label: "زائر شهرياً" },
    { number: "600+", label: "عملية بيع" }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">إحصائيات متجر Level Up</h2>
          <p className="text-muted-foreground text-lg">أرقام حقيقية تتحدث عن نفسها</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-lg text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
