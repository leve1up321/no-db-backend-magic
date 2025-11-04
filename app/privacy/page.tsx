import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, UserCheck, Database, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <Shield className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              سياسة الاستخدام والخصوصية
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              متجر Level Up - حماية بياناتك أولويتنا
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* مقدمة */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                في <strong>متجر Level Up</strong>، نحن ملتزمون بحماية خصوصيتك وأمان بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا وخدماتنا.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                باستخدامك لموقعنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة.
              </p>
            </div>

            <div className="space-y-8">
              {/* المعلومات التي نجمعها */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <div className="flex items-start gap-4 mb-4">
                  <Database className="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    المعلومات التي نجمعها
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      1️⃣ المعلومات الشخصية
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>الاسم الكامل</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>عنوان البريد الإلكتروني</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>رقم الهاتف</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>معلومات الدفع (تُعالج بشكل آمن عبر بوابات دفع مشفرة)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      2️⃣ معلومات الاستخدام
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>عنوان IP</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>نوع المتصفح والجهاز</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>الصفحات التي تزورها</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary-600 dark:text-primary-400">•</span>
                        <span>مدة الزيارة وتاريخها</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* كيفية استخدام المعلومات */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-accent-600 dark:border-accent-400">
                <div className="flex items-start gap-4 mb-4">
                  <Eye className="w-8 h-8 text-accent-600 dark:text-accent-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    كيفية استخدام معلوماتك
                  </h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  نستخدم المعلومات التي نجمعها للأغراض التالية:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✓</span>
                    <span><strong>معالجة الطلبات:</strong> لإتمام عمليات الشراء وتسليم المنتجات الرقمية</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✓</span>
                    <span><strong>التواصل:</strong> لإرسال إشعارات الطلبات والتحديثات المهمة</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✓</span>
                    <span><strong>تحسين الخدمة:</strong> لتطوير وتحسين تجربة المستخدم</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✓</span>
                    <span><strong>الدعم الفني:</strong> للرد على استفساراتك وحل المشاكل</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent-600 dark:text-accent-400">✓</span>
                    <span><strong>الأمان:</strong> لحماية الموقع من الاحتيال والاستخدام غير المصرح به</span>
                  </li>
                </ul>
              </div>

              {/* حماية البيانات */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-green-600 dark:border-green-400">
                <div className="flex items-start gap-4 mb-4">
                  <Lock className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    حماية معلوماتك
                  </h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  نتخذ إجراءات أمنية صارمة لحماية بياناتك:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      🔒 التشفير
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      جميع البيانات الحساسة مشفرة باستخدام SSL/TLS
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      🛡️ جدران الحماية
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      خوادم محمية بجدران حماية متقدمة
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      🔐 المصادقة الآمنة
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      نظام مصادقة قوي لحماية الحسابات
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      📊 النسخ الاحتياطي
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      نسخ احتياطية منتظمة لجميع البيانات
                    </p>
                  </div>
                </div>
              </div>

              {/* مشاركة المعلومات */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-blue-600 dark:border-blue-400">
                <div className="flex items-start gap-4 mb-4">
                  <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    مشاركة المعلومات
                  </h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  نحن <strong>لا نبيع أو نؤجر</strong> معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>مقدمو الخدمات:</strong> مثل معالجات الدفع وخدمات الاستضافة (مع التزامهم بالسرية)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>الامتثال القانوني:</strong> إذا تطلب القانون ذلك</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span><strong>حماية الحقوق:</strong> لحماية حقوقنا وسلامة المستخدمين</span>
                  </li>
                </ul>
              </div>

              {/* ملفات تعريف الارتباط */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-purple-600 dark:border-purple-400">
                <div className="flex items-start gap-4 mb-4">
                  <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ملفات تعريف الارتباط (Cookies)
                  </h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">🍪</span>
                    <span><strong>ملفات ضرورية:</strong> لتشغيل الموقع بشكل صحيح</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">🍪</span>
                    <span><strong>ملفات تحليلية:</strong> لفهم كيفية استخدام الموقع</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">🍪</span>
                    <span><strong>ملفات وظيفية:</strong> لحفظ تفضيلاتك (اللغة، العملة، السلة)</span>
                  </li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  يمكنك إدارة أو حذف ملفات تعريف الارتباط من إعدادات متصفحك.
                </p>
              </div>

              {/* حقوقك */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-orange-600 dark:border-orange-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  حقوقك
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  لديك الحق في:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>الوصول إلى معلوماتك الشخصية</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>تصحيح المعلومات الخاطئة</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>طلب حذف معلوماتك</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>الاعتراض على معالجة معلوماتك</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>طلب نقل معلوماتك</span>
                  </li>
                </ul>
                
              </div>

              {/* التحديثات */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-gray-600 dark:border-gray-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  تحديثات السياسة
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  قد نقوم بتحديث هذه السياسة من وقت لآخر. سنعلمك بأي تغييرات مهمة عبر البريد الإلكتروني أو إشعار على الموقع. تاريخ آخر تحديث: <strong>نوفمبر 2025</strong>
                </p>
              </div>
            </div>
      </section>

      <Footer />
    </main>
  );
}

