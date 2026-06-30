import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Home, Phone, Mail } from "lucide-react";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `سياسة الخصوصية | ${siteContent.brand.shortName}`,
  description: `سياسة الخصوصية الخاصة بـ ${siteContent.brand.name}`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f1f3] px-4 py-12 md:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#5f0f40] px-4 py-2 text-sm font-semibold text-white">
          <Home className="h-4 w-4" />
          الرئيسية
        </Link>
        <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f5edf0]">
              <Shield className="h-10 w-10 text-[#5f0f40]" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-[#4d102f]">سياسة الخصوصية</h1>
          </div>

          <div className="mt-10 space-y-8 text-right leading-8 text-[#5d4752]">
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">ما الذي نجمعه؟</h2>
              <p>
                نجمع فقط البيانات اللازمة لإتمام الحجز وتحسين تجربة السفر، مثل الاسم،
                معلومات التواصل، بيانات الجواز، وتفاصيل الرحلة والدفع.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">كيف نستخدم البيانات؟</h2>
              <p>
                نستخدم المعلومات لمعالجة الحجوزات، إرسال التحديثات، تحسين الأداء،
                وتقديم دعم ما بعد الحجز وإدارة الرحلات.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">مشاركة المعلومات</h2>
              <p>
                قد تتم مشاركة البيانات مع مزودي الدفع، أنظمة الحجز، وجهات الامتثال
                القانوني، أو مزودي الخدمة الضروريين فقط لتشغيل الخدمة.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[#4d102f]">الأمان</h2>
              <p>
                نعتمد وسائل حماية تقنية وتنظيمية مناسبة لحماية البيانات أثناء النقل
                والتخزين والوصول.
              </p>
            </section>
            <section className="rounded-2xl bg-[#fcf6f8] p-6">
              <h2 className="text-2xl font-bold text-[#4d102f]">التواصل</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-end gap-3">
                  <span>{siteContent.brand.phone}</span>
                  <Phone className="h-5 w-5 text-[#8a1538]" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span>{siteContent.brand.email}</span>
                  <Mail className="h-5 w-5 text-[#8a1538]" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
