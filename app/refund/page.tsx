import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function RefundPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              سياسة الاستبدال والاسترجاع
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              متجر Level Up - المنتجات الرقمية
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* تنبيه مهم */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-r-4 border-yellow-500 p-6 rounded-xl mb-8 flex gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  تنبيه مهم
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  نود أن نلفت انتباهكم إلى أن منتجاتنا جميعها <strong>رقمية</strong>، وبناءً على ذلك، نود توضيح سياسة استرداد الأموال والاستبدال لدينا.
                </p>
              </div>
            </div>

            {/* السياسة الأساسية */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-8">
              <div className="flex items-start gap-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    السياسة الأساسية
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold mb-4">
                    يرجى العلم أنه <span className="text-red-600 dark:text-red-400">بمجرد إتمام عملية الدفع، لا يمكن استرداد الأموال</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    نظراً لطبيعة المنتجات الرقمية التي يتم تسليمها فوراً، فإنه لا يمكن إرجاعها أو استردادها بعد التحميل أو الوصول إليها.
                  </p>
                </div>
              </div>
            </div>

            {/* حالات الاستبدال المقبولة */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-green-600 dark:border-green-400 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    حالات الاستبدال المقبولة
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    يمكن استبدال المنتج في الحالات التالية فقط:
                  </p>
                  
                  <div className="space-y-4">
                    {/* الحالة الأولى */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        1️⃣ وجود خلل في المنتج
                      </h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex gap-3">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span>إذا كان المنتج تالفاً أو لا يعمل بشكل صحيح</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span>إذا كان الكود أو الحساب غير صالح للاستخدام</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span>إذا كان المنتج مختلفاً عن الوصف</span>
                        </li>
                      </ul>
                    </div>

                    {/* الحالة الثانية */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        2️⃣ ضمن المدة المحددة
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        يجب الاتصال بنا خلال <strong className="text-blue-600 dark:text-blue-400">يوم واحد (24 ساعة)</strong> من تاريخ الشراء لطلب استبدال المنتج.
                      </p>
                      <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          ⚠️ يُرجى التأكد من عدم تجاوز تاريخ الشراء (1 يوم)، حيث لن يتم قبول أي طلبات استرداد أو استبدال بعد هذه المدة.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-r-4 border-gray-600 dark:border-gray-400 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                إخلاء المسؤولية
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="flex gap-3">
                  <span className="text-gray-600 dark:text-gray-400">•</span>
                  <span>
                    المتجر <strong>غير مسؤول</strong> في حال طرأ تغيير في قوانين الموقع الرسمي للمنتج أو الخدمة المقدمة.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-gray-600 dark:text-gray-400">•</span>
                  <span>
                    جميع اشتراكاتنا <strong>رسمية ومن موقع الشركة نفسها</strong>.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-gray-600 dark:text-gray-400">•</span>
                  <span>
                    أي تغييرات تحدث من قبل الشركة المزودة للخدمة خارجة عن سيطرتنا.
                  </span>
                </p>
              </div>
            </div>

            {/* ملاحظة ختامية */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl text-center text-white">
              <p className="text-xl font-bold mb-4">
                💙 نقدر تفهمك ونتطلع إلى تقديم خدمة عالية الجودة ومنتجات ذات قيمة لك
              </p>
              <p className="text-lg">
                رضاك هو هدفنا الأول!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
