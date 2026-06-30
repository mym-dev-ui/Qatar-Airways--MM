"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readBookingDraft, saveBookingDraft, type PassengerDetails } from "@/lib/booking-store";

const defaultPassenger: PassengerDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  passportNumber: "",
};

export default function PassengerDetailsPage() {
  const router = useRouter();
  const [passenger, setPassenger] = useState<PassengerDetails>(defaultPassenger);
  const [error, setError] = useState("");

  useEffect(() => {
    const booking = readBookingDraft();
    if (!booking.flight) {
      router.replace("/insur");
      return;
    }
    if (booking.passenger) {
      setPassenger(booking.passenger);
    }
  }, [router]);

  function updateField(name: keyof PassengerDetails, value: string) {
    setPassenger((current) => ({ ...current, [name]: value }));
  }

  function handleContinue() {
    const values = Object.values(passenger).map((value) => value.trim());
    if (values.some((value) => !value)) {
      setError("أكمل جميع بيانات المسافر أولاً");
      return;
    }

    saveBookingDraft({ passenger });
    router.push("/step3");
  }

  return (
    <main className="min-h-screen bg-[#fcf6f8] px-4 py-10 md:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm tracking-[0.25em] text-[#9a7485]">الخطوة 1</p>
        <h1 className="mt-2 text-4xl font-bold text-[#4d102f]">بيانات المسافرين</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input value={passenger.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="الاسم الأول" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
          <input value={passenger.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="اسم العائلة" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
          <input value={passenger.email} onChange={(event) => updateField("email", event.target.value)} placeholder="البريد الإلكتروني" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
          <input value={passenger.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="رقم الهاتف" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
          <input value={passenger.nationality} onChange={(event) => updateField("nationality", event.target.value)} placeholder="الجنسية" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
          <input value={passenger.passportNumber} onChange={(event) => updateField("passportNumber", event.target.value)} placeholder="رقم الجواز" className="rounded-2xl border border-[#e7d9df] px-4 py-3" />
        </div>
        {error ? <p className="mt-4 text-right text-sm text-red-600">{error}</p> : null}
        <div className="mt-8 flex justify-between">
          <Link href="/insur" className="rounded-full border border-[#d7c0ca] px-5 py-3 text-[#5f0f40]">
            رجوع
          </Link>
          <button onClick={handleContinue} className="rounded-full bg-[#5f0f40] px-5 py-3 text-white">
            متابعة
          </button>
        </div>
      </div>
    </main>
  );
}
