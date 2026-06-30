import Link from "next/link";

const fareTypes = [
  {
    name: "Economy Classic",
    price: "1,240 ر.ق",
    features: ["حقيبة يد", "أمتعة 25 كغ", "اختيار مقعد مدفوع"],
  },
  {
    name: "Economy Convenience",
    price: "1,540 ر.ق",
    features: ["أمتعة 30 كغ", "تغيير تاريخ برسوم مخفضة", "اختيار مقعد قياسي"],
  },
  {
    name: "Business Elite",
    price: "4,980 ر.ق",
    features: ["دخول الصالة", "أولوية الصعود", "مقعد سرير كامل"],
  },
];

export default function FareComparisonPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 md:px-8" dir="rtl">
      <div className="mx-auto max-w-6xl text-right">
        <p className="text-sm tracking-[0.25em] text-[#9a7485]">مقارنة الأسعار</p>
        <h1 className="mt-2 text-4xl font-bold text-[#4d102f]">اختر الباقة الأنسب لرحلتك</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {fareTypes.map((fare, index) => (
            <section
              key={fare.name}
              className={`rounded-[1.8rem] border p-6 ${
                index === 1
                  ? "border-[#8a1538] bg-[#fff7fa] shadow-[0_18px_45px_rgba(86,25,55,0.08)]"
                  : "border-[#eadbe1] bg-[#fcf8fa]"
              }`}
            >
              <div className="text-sm text-[#8a6d7b]">فئة السفر</div>
              <h2 className="mt-2 text-2xl font-bold text-[#4d102f]">{fare.name}</h2>
              <div className="mt-3 text-3xl font-extrabold text-[#5f0f40]">{fare.price}</div>
              <ul className="mt-5 space-y-3 text-[#6d4a5b]">
                {fare.features.map((feature) => (
                  <li key={feature} className="rounded-xl bg-white px-4 py-3">
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/step3"
                className="mt-6 block rounded-full bg-[#5f0f40] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#7b124d]"
              >
                اختيار هذه الباقة
              </Link>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
