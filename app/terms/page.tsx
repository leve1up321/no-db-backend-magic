import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧾 اتفاقية الاستخدام
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              متجر Level Up
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                مرحبًا بكم في متجر Level Up، المتخصص ببيع الألعاب الرقمية، الأكواد، الحسابات والمنتجات الإلكترونية.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                باستخدامك لهذا المتجر، فأنت توافق على الشروط والأحكام التالية وتُقرّ أنك تملك الأهلية القانونية الكاملة للتعامل الإلكتروني وفق القوانين المعمول بها في دولة الإمارات العربية المتحدة.
              </p>
            </div>

            <div className="space-y-8">
              {/* المادة الأولى */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الأولى – التعريفات
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>المتجر:</strong> متجر Level Up الإلكتروني بكافة قنواته (الموقع الإلكتروني – التطبيق – الدعم الفني).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>المستهلك:</strong> كل شخص يقوم بشراء منتج أو خدمة رقمية من المتجر.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>الاتفاقية:</strong> جميع الشروط والأحكام الموضحة في هذه الوثيقة.</span>
                  </li>
                </ul>
              </div>

              {/* المادة الثانية */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الثانية – أهلية المستخدم
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يشترط أن يكون عمر المستخدم 18 سنة أو أكثر.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>في حال الشراء من قبل قاصر، يتحمل ولي أمره كامل المسؤولية القانونية عن العملية.</span>
                  </li>
                </ul>
              </div>

              {/* المادة الثالثة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الثالثة – طبيعة الخدمات
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  يقدم المتجر منتجات رقمية تشمل:
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">🔹</span>
                    <span>ألعاب فيديو، اشتراكات، بطاقات رقمية، أكواد تفعيل، حسابات رسمية.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>جميع المنتجات رقمية وغير مادية، ويتم تسليمها إلكترونيًا.</span>
                  </li>
                </ul>
              </div>

              {/* المادة الرابعة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الرابعة – استخدام المنصة
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يُمنع استخدام الموقع في أي نشاط غير قانوني أو يتعارض مع القوانين المحلية أو الشريعة الإسلامية.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يُمنع إساءة استخدام المنتجات الرقمية أو إعادة بيعها بطرق مخالفة.</span>
                  </li>
                </ul>
              </div>

              {/* المادة الخامسة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الخامسة – الحسابات والمسؤولية
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات حسابه وكلمة المرور.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>لا يتحمل المتجر أي أضرار ناتجة عن سوء استخدام الحساب أو مشاركته مع الآخرين.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>في حال ثبوت تقديم بيانات غير صحيحة، يحق للمتجر تعليق أو إلغاء الحساب دون إشعار مسبق.</span>
                  </li>
                </ul>
              </div>

              {/* المادة السادسة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة السادسة – الدفع والتسليم
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>تتم عمليات الدفع إلكترونيًا عبر الوسائل المتاحة في المتجر.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>بعد إتمام الدفع يتم تسليم المنتج خلال مدة تتراوح بين 5 دقائق إلى 6 ساعات كحد أقصى.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>جميع الأسعار معروضة بالعملة المحلية، وقد تتغير حسب العرض أو الضريبة.</span>
                  </li>
                </ul>
              </div>

              {/* المادة السابعة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-accent-600 dark:border-accent-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة السابعة – سياسة الضمان والاستبدال
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✨</span>
                    <span>جميع الحسابات والأكواد تشمل ضمان ذهبي لمدة 6 أشهر ضد أي مشكلة في التفعيل أو الوصول.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>لا يمكن استرجاع أو استبدال المنتج بعد التسليم نظرًا لطبيعته الرقمية.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>في حال وجود مشكلة حقيقية بالمنتج، يتم مراجعة الحالة من قبل الدعم الفني خلال 24 ساعة.</span>
                  </li>
                </ul>
              </div>

              {/* المواد المتبقية */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الثامنة – الملكية الفكرية
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>جميع محتويات الموقع والعلامة التجارية Level Up مملوكة بالكامل للمتجر.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يُمنع نسخ أو إعادة نشر أي محتوى أو شعار دون إذن رسمي.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة التاسعة – التواصل الرسمي
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>التواصل الرسمي يكون عبر البريد الإلكتروني المسجّل في المنصة أو من خلال صفحة اتصل بنا.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>أي إشعارات تُرسل عبر المنصة تعتبر قانونية ونافذة.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة العاشرة – تعديل الاتفاقية
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>يحق لإدارة المتجر تعديل أو تحديث هذه الاتفاقية في أي وقت دون إشعار مسبق.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span>استمرار استخدامك للمتجر بعد التعديل يعني موافقتك على البنود الجديدة.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  المادة الحادية عشر – النظام المعمول به
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  تخضع هذه الاتفاقية لأنظمة دولة الإمارات العربية المتحدة، وأي نزاع يُحال للجهات المختصة.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl text-center text-white">
              <p className="text-xl font-bold">
                🛡 بإتمامك عملية الشراء فإنك تؤكد موافقتك الكاملة على جميع الشروط والأحكام المذكورة أعلاه.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

