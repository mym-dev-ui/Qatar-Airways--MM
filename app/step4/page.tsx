"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { readBookingDraft, saveBookingDraft } from "@/lib/booking-store";
import { formatCurrency, seatTypeLabels, type SeatMapSeat } from "@/lib/travel-data";
import { readTravelDataset } from "@/lib/travel-store";

export default function SeatsPage() {
  const router = useRouter();
  const dataset = useMemo(() => readTravelDataset(), []);
  const [selectedSeat, setSelectedSeat] = useState<SeatMapSeat | null>(null);

  useEffect(() => {
    const booking = readBookingDraft();
    if (!booking.passenger) {
      router.replace("/step2");
      return;
    }
    const seatId = booking.seatSelection?.id || booking.seat;
    const seat = dataset.seatMap.find((item) => item.id === seatId) || dataset.seatMap.find((item) => item.available) || null;
    setSelectedSeat(seat);
  }, [dataset.seatMap, router]);

  function handleContinue() {
    if (!selectedSeat) return;
    saveBookingDraft({
      seat: selectedSeat.id,
      seatSelection: selectedSeat,
    });
    router.push("/step5");
  }

  return (
    <main className="min-h-screen bg-[#f7f1f3] px-4 py-10 md:px-8" dir="rtl">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm tracking-[0.25em] text-[#9a7485]">الخطوة 3</p>
        <h1 className="mt-2 text-4xl font-bold text-[#4d102f]">اختيار المقاعد</h1>
        <p className="mt-3 text-right text-[#6d4a5b]">
          خريطة الطائرة تقسم المقاعد إلى مجانية، مساحة أرجل إضافية، نافذة، وممر برسوم مختلفة.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="rounded-[1.6rem] bg-[#fcf8fa] p-6">
            <div className="mb-6 text-center text-sm text-[#8a6d7b]">مقدمة الطائرة</div>
            <div className="grid grid-cols-6 gap-3">
              {dataset.seatMap.map((seat) => {
                const active = selectedSeat?.id === seat.id;
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={!seat.available}
                    onClick={() => setSelectedSeat(seat)}
                    className={`rounded-2xl border px-3 py-4 text-center transition ${
                      !seat.available
                        ? "cursor-not-allowed border-[#e3d3da] bg-[#eee4e8] text-[#9d8290]"
                        : active
                          ? "border-[#5f0f40] bg-[#5f0f40] text-white"
                          : "border-[#eadbe1] bg-white text-[#4d102f] hover:border-[#8a1538]"
                    }`}
                  >
                    <div className="font-bold">{seat.label}</div>
                    <div className="mt-1 text-[11px]">{seatTypeLabels[seat.type]}</div>
                    <div className="mt-2 text-xs">{seat.price ? formatCurrency(seat.price) : "مجاني"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[1.6rem] bg-[#4b0d31] p-6 text-white">
            <h2 className="text-xl font-bold">ملخص المقعد</h2>
            {selectedSeat ? (
              <>
                <div className="mt-4 text-3xl font-extrabold">{selectedSeat.label}</div>
                <div className="mt-2 text-white/80">{seatTypeLabels[selectedSeat.type]}</div>
                <div className="mt-4 rounded-2xl bg-white/10 p-4">
                  <div className="text-sm text-white/70">رسوم المقعد</div>
                  <div className="mt-2 text-2xl font-bold">{selectedSeat.price ? formatCurrency(selectedSeat.price) : "مجاني"}</div>
                </div>
              </>
            ) : null}
          </aside>
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/step3" className="rounded-full border border-[#d7c0ca] px-5 py-3 text-[#5f0f40]">
            رجوع
          </Link>
          <button onClick={handleContinue} className="rounded-full bg-[#5f0f40] px-5 py-3 text-white">
            متابعة الدفع
          </button>
        </div>
      </div>
    </main>
  );
}
