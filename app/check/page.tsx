"use client";

import { useState } from "react";
import { findBooking, type BookingRecord } from "@/lib/booking-store";

export default function ManageBookingPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState("");

  function handleLookup() {
    const result = findBooking(reference, email);
    if (!result) {
      setBooking(null);
      setError("لم يتم العثور على حجز مطابق");
      return;
    }

    setError("");
    setBooking(result);
  }

  return (
    <main className="min-h-screen bg-[#f7f1f3] px-4 py-10 md:px-8" dir="rtl">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-[0_18px_45px_rgba(86,25,55,0.08)]">
        <p className="text-sm tracking-[0.25em] text-[#9a7485]">إدارة الحجز</p>
        <h1 className="mt-2 text-4xl font-bold text-[#4d102f]">استعرض أو عدّل رحلتك</h1>
        <p className="mt-3 text-[#6d4a5b]">
          أدخل رقم الحجز والبريد الإلكتروني للوصول إلى تفاصيل الرحلة.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            value={reference}
            onChange={(event) => setReference(event.target.value.toUpperCase())}
            placeholder="رقم الحجز"
            className="rounded-2xl border border-[#e7d9df] bg-[#fcfafb] px-4 py-3 outline-none"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="البريد الإلكتروني"
            className="rounded-2xl border border-[#e7d9df] bg-[#fcfafb] px-4 py-3 outline-none"
          />
          <button onClick={handleLookup} className="rounded-full bg-[#5f0f40] px-5 py-3 font-semibold text-white">
            عرض الحجز
          </button>
        </div>

        {error ? <p className="mt-4 text-right text-sm text-red-600">{error}</p> : null}

        {booking ? (
          <div className="mt-8 rounded-[1.5rem] bg-[#fcf6f8] p-6 text-right">
            <h2 className="text-2xl font-bold text-[#4d102f]">{booking.bookingReference}</h2>
            <div className="mt-4 space-y-2 text-[#6d4a5b]">
              <p>المسافر: {booking.passenger?.firstName} {booking.passenger?.lastName}</p>
              <p>البريد: {booking.passenger?.email}</p>
              <p>الرحلة: {booking.search?.from} إلى {booking.flight?.destinationCity}</p>
              <p>تاريخ المغادرة: {booking.search?.departure}</p>
              <p>المقعد: {booking.seat}</p>
              <p>الخدمات الإضافية: {booking.extras?.length ? booking.extras.join("، ") : "لا يوجد"}</p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
