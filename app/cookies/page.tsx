import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Home } from "lucide-react";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `سياسة الكوكيز | ${siteContent.brand.shortName}`,
  description: `سياسة ملفات تعريف الارتباط الخاصة بـ ${siteContent.brand.name}`,
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#fcf6f8] px-4 py-12 md:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#5f0f40] px-4 py-2 text-sm font-semibold text-white">
          <Home className="h-4 w-4" />
          الرئيسية
        </Link>
        <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f5edf0]">
              <Cookie className="h-10 w-10 text-[#5f0f40]" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-[#4d102f]">سياسة الكوكيز</h1>
          </div>
          <div className="mt-10 space-y-8 text-right leading-8 text-[#5d4752]">
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">لماذا نستخدم الكوكيز؟</h2>
              <p>
                نستخدمها للحفاظ على الجلسة، تذكر تفضيلاتك، تحليل الاستخدام، وتحسين
                أداء الحجز والتنقل داخل الموقع.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">أنواع الكوكيز</h2>
              <p>
                تشمل كوكيز أساسية لتشغيل الموقع، كوكيز أداء لقياس الاستخدام، وكوكيز
                وظيفية لحفظ اللغة والخيارات المفضلة.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">كيفية التحكم بها</h2>
              <p>
                يمكنك تعديل إعدادات المتصفح لحذف أو تعطيل الكوكيز، مع ملاحظة أن بعض
                وظائف الحجز قد تتأثر بذلك.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
