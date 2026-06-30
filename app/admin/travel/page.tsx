"use client";

import { useEffect, useState } from "react";
import {
  cabinClassLabels,
  defaultTravelDataset,
  formatCurrency,
  passengerTypeLabels,
  seatTypeLabels,
  type CabinClass,
  type PassengerType,
  type TravelDataset,
} from "@/lib/travel-data";
import { readTravelDataset, resetTravelDataset, saveTravelDataset } from "@/lib/travel-store";

const cabinClasses = Object.keys(cabinClassLabels) as CabinClass[];
const passengerTypes = Object.keys(passengerTypeLabels) as PassengerType[];

export default function AdminTravelPage() {
  const [dataset, setDataset] = useState<TravelDataset>(defaultTravelDataset);

  useEffect(() => {
    setDataset(readTravelDataset());
  }, []);

  function persist(next: TravelDataset) {
    setDataset(next);
    saveTravelDataset(next);
  }

  function updateDestination(id: string, field: string, value: string | boolean) {
    const next = {
      ...dataset,
      destinations: dataset.destinations.map((destination) =>
        destination.id === id ? { ...destination, [field]: value } : destination,
      ),
    };
    persist(next);
  }

  function updateFare(
    destinationId: string,
    tripKey: "oneWay" | "roundTrip",
    cabinClass: CabinClass,
    passengerType: PassengerType,
    value: string,
  ) {
    const numeric = Number(value || 0);
    const next = {
      ...dataset,
      pricing: dataset.pricing.map((record) =>
        record.destinationId === destinationId
          ? {
              ...record,
              fares: {
                ...record.fares,
                [tripKey]: {
                  ...record.fares[tripKey],
                  [cabinClass]: {
                    ...record.fares[tripKey][cabinClass],
                    [passengerType]: numeric,
                  },
                },
              },
            }
          : record,
      ),
    };
    persist(next);
  }

  function updatePromo(index: number, field: string, value: string | boolean | number) {
    const promos = [...dataset.promoCodes];
    promos[index] = { ...promos[index], [field]: value };
    persist({ ...dataset, promoCodes: promos });
  }

  function updateAutoDiscount(index: number, field: string, value: string | number) {
    const autoDiscounts = [...dataset.autoDiscounts];
    autoDiscounts[index] = { ...autoDiscounts[index], [field]: value };
    persist({ ...dataset, autoDiscounts });
  }

  return (
    <main className="min-h-screen bg-[#f7f2f4] px-4 py-8 md:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-[#4d102f] p-8 text-white">
          <p className="text-sm tracking-[0.3em] text-white/70">لوحة تحكم الرحلات</p>
          <h1 className="mt-3 text-4xl font-bold">إدارة الوجهات والتسعير والمقاعد والعروض</h1>
          <p className="mt-3 max-w-3xl text-white/80">
            التعديلات هنا تنعكس مباشرة على صفحات الحجز داخل نفس المتصفح عبر الحفظ المحلي.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => persist(defaultTravelDataset)}
              className="rounded-full bg-white px-5 py-3 font-semibold text-[#4d102f]"
            >
              تحميل البيانات الافتراضية
            </button>
            <button
              type="button"
              onClick={() => {
                resetTravelDataset();
                setDataset(defaultTravelDataset);
              }}
              className="rounded-full border border-white/20 px-5 py-3"
            >
              إعادة الضبط
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4d102f]">إدارة البلدان والمدن</h2>
          <div className="mt-6 grid gap-5">
            {dataset.destinations.map((destination) => (
              <article key={destination.id} className="rounded-[1.5rem] border border-[#eadbe1] p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={destination.country} onChange={(event) => updateDestination(destination.id, "country", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="البلد" />
                  <input value={destination.city} onChange={(event) => updateDestination(destination.id, "city", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="المدينة" />
                  <input value={destination.teaser} onChange={(event) => updateDestination(destination.id, "teaser", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="نبذة مختصرة" />
                  <input value={destination.image} onChange={(event) => updateDestination(destination.id, "image", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="رابط الصورة" />
                </div>
                <textarea value={destination.description} onChange={(event) => updateDestination(destination.id, "description", event.target.value)} className="mt-4 min-h-28 w-full rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="الوصف الكامل" />
                <label className="mt-4 flex items-center justify-end gap-3 text-sm text-[#5c3145]">
                  <span>إظهار كوجهة بارزة في الصفحة الرئيسية</span>
                  <input type="checkbox" checked={destination.featured} onChange={(event) => updateDestination(destination.id, "featured", event.target.checked)} className="h-5 w-5 accent-[#8a1538]" />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4d102f]">نظام تسعير الحجوزات</h2>
          <div className="mt-6 space-y-6">
            {dataset.pricing.map((record) => {
              const destination = dataset.destinations.find((item) => item.id === record.destinationId);
              return (
                <article key={record.destinationId} className="rounded-[1.5rem] border border-[#eadbe1] p-5">
                  <h3 className="text-xl font-bold text-[#4d102f]">{destination?.city}</h3>
                  <div className="mt-4 grid gap-6 xl:grid-cols-2">
                    {(["oneWay", "roundTrip"] as const).map((tripKey) => (
                      <div key={tripKey} className="rounded-[1.25rem] bg-[#fcf7f9] p-4">
                        <div className="mb-4 font-semibold text-[#5c3145]">
                          {tripKey === "oneWay" ? "ذهاب فقط" : "ذهاب وعودة"}
                        </div>
                        <div className="space-y-4">
                          {cabinClasses.map((cabinClass) => (
                            <div key={cabinClass}>
                              <div className="mb-2 text-sm font-semibold text-[#7b5b69]">
                                {cabinClassLabels[cabinClass]}
                              </div>
                              <div className="grid gap-3 md:grid-cols-3">
                                {passengerTypes.map((passengerType) => (
                                  <label key={passengerType} className="text-right">
                                    <span className="mb-2 block text-sm text-[#7e6470]">
                                      {passengerTypeLabels[passengerType]}
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={record.fares[tripKey][cabinClass][passengerType]}
                                      onChange={(event) =>
                                        updateFare(record.destinationId, tripKey, cabinClass, passengerType, event.target.value)
                                      }
                                      className="w-full rounded-2xl border border-[#e7d9df] px-4 py-3"
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#4d102f]">خريطة المقاعد والرسوم</h2>
            <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
              {dataset.seatMap.map((seat) => (
                <div
                  key={seat.id}
                  className={`rounded-2xl border p-4 text-center ${
                    seat.available ? "border-[#eadbe1] bg-[#fcf7f9]" : "border-[#e3d3da] bg-[#f0e7eb] opacity-60"
                  }`}
                >
                  <div className="font-bold text-[#4d102f]">{seat.label}</div>
                  <div className="mt-1 text-xs text-[#7e6470]">{seatTypeLabels[seat.type]}</div>
                  <div className="mt-2 text-sm font-semibold text-[#5f0f40]">{formatCurrency(seat.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#4d102f]">أكواد الخصم</h2>
              <div className="mt-5 space-y-4">
                {dataset.promoCodes.map((promo, index) => (
                  <article key={promo.code} className="rounded-[1.25rem] border border-[#eadbe1] p-4">
                    <div className="grid gap-3">
                      <input value={promo.code} onChange={(event) => updatePromo(index, "code", event.target.value.toUpperCase())} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="الكود" />
                      <input value={promo.label} onChange={(event) => updatePromo(index, "label", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="اسم العرض" />
                      <input type="number" value={promo.value} onChange={(event) => updatePromo(index, "value", Number(event.target.value || 0))} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="قيمة الخصم" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#4d102f]">الخصومات التلقائية</h2>
              <div className="mt-5 space-y-4">
                {dataset.autoDiscounts.map((rule, index) => (
                  <article key={rule.id} className="rounded-[1.25rem] border border-[#eadbe1] p-4">
                    <div className="grid gap-3">
                      <input value={rule.label} onChange={(event) => updateAutoDiscount(index, "label", event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="اسم القاعدة" />
                      <input type="number" value={rule.value} onChange={(event) => updateAutoDiscount(index, "value", Number(event.target.value || 0))} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="نسبة الخصم" />
                      {rule.type === "early-bird" ? (
                        <input type="number" value={rule.minDaysBeforeDeparture || 0} onChange={(event) => updateAutoDiscount(index, "minDaysBeforeDeparture", Number(event.target.value || 0))} className="rounded-2xl border border-[#e7d9df] px-4 py-3" placeholder="عدد الأيام قبل الرحلة" />
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
