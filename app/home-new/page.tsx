"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveBookingDraft } from "@/lib/booking-store";
import {
  cabinClassLabels,
  formatCurrency,
  getDestinationPricing,
  passengerTypeLabels,
  type CabinClass,
  type DestinationRecord,
  type PassengerType,
  type TripType,
} from "@/lib/travel-data";
import { getLandingDestinations, readTravelDataset } from "@/lib/travel-store";

const defaultCabinClass: CabinClass = "economy";
const defaultPassengerType: PassengerType = "adult";

export default function HomePage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [cabinClass, setCabinClass] = useState<CabinClass>(defaultCabinClass);
  const [passengerType, setPassengerType] = useState<PassengerType>(defaultPassengerType);
  const [dataset, setDataset] = useState(readTravelDataset());
  const featuredDestinations = useMemo(() => getLandingDestinations(dataset), [dataset]);
  const activeDestination = featuredDestinations[activeIndex] || featuredDestinations[0];
  const popularDestinations = useMemo(
    () =>
      dataset.destinations.filter((destination) =>
        ["باريس", "نيويورك", "لندن", "إسطنبول", "دبي", "الدوحة"].includes(destination.city),
      ),
    [dataset.destinations],
  );
  const commonCountries = useMemo(
    () => ["السعودية", "الكويت", "البحرين", "عُمان", "قطر", "الإمارات"],
    [],
  );
  const [selectedCountry, setSelectedCountry] = useState(activeDestination?.country || "السعودية");
  const [formData, setFormData] = useState({
    to: activeDestination?.city || "",
  });

  useEffect(() => {
    setDataset(readTravelDataset());
  }, []);

  useEffect(() => {
    if (!featuredDestinations.length) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current);
        return (current + 1) % featuredDestinations.length;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [featuredDestinations.length]);

  useEffect(() => {
    if (previousIndex === null) return;
    const timer = window.setTimeout(() => {
      setPreviousIndex(null);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [previousIndex]);

  const filteredDestinations = useMemo(
    () => dataset.destinations.filter((destination) => destination.country === selectedCountry),
    [dataset.destinations, selectedCountry],
  );

  useEffect(() => {
    if (!filteredDestinations.length) return;
    const hasCurrent = filteredDestinations.some((destination) => destination.city === formData.to);
    if (!hasCurrent) {
      setFormData((current) => ({ ...current, to: filteredDestinations[0].city }));
    }
  }, [filteredDestinations, formData.to]);

  function updateField(name: string, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleDestinationBooking(destination: DestinationRecord) {
    saveBookingDraft({
      status: "draft",
      flight: undefined,
      extras: undefined,
      seat: undefined,
      seatSelection: undefined,
      promoCode: undefined,
      promoDiscount: undefined,
      appliedPromo: undefined,
      autoDiscounts: undefined,
      totals: undefined,
      search: {
        from: "عمّان",
        ...formData,
        to: destination.city,
        departure: "",
        returnDate: "",
        passengers: "1 مسافر",
        tripType,
        destinationId: destination.id,
      },
    });
    router.push("/insur");
  }

  if (!activeDestination) return null;

  const startingPrice = getDestinationPricing(
    dataset,
    activeDestination.id,
    tripType,
    cabinClass,
    passengerType,
  );
  const previousDestination =
    previousIndex !== null ? featuredDestinations[previousIndex] : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(138,21,56,0.12),transparent_30%),linear-gradient(180deg,#fffafc_0%,#f7f1f3_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-[#d9c3cc]/50 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
          <Link href="/admin/travel" className="rounded-full border border-[#eadbe1] px-4 py-2 text-sm font-semibold text-[#5b2940]">
            لوحة الإدارة
          </Link>
          <div className="text-right">
            <div className="font-bold text-[#4d102f]">SkyLine Airways</div>
            <div className="text-xs text-[#866474]">نظام رحلات وحجوزات متكامل</div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 md:px-8">
        <div className="hero-fade-container relative grid min-h-[70vh] items-end gap-8 overflow-hidden rounded-[2rem] px-6 py-8 text-white shadow-[0_30px_70px_rgba(67,17,44,0.18)] md:grid-cols-[1.45fr_0.85fr] md:px-10 md:py-12">
          {previousDestination ? (
            <div
              className="hero-fade-layer hero-fade-out absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(33, 5, 26, 0.94) 0%, rgba(33, 5, 26, 0.8) 42%, rgba(33, 5, 26, 0.2) 100%), url(${previousDestination.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : null}
          <div
            key={activeDestination.id}
            className="hero-fade-layer hero-fade-in absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(33, 5, 26, 0.94) 0%, rgba(33, 5, 26, 0.8) 42%, rgba(33, 5, 26, 0.2) 100%), url(${activeDestination.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative text-right">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#e8bbc9]">رحلات مرنة وتسعير حي</p>
            <h1 className="max-w-[12ch] text-4xl font-extrabold leading-[1.05] md:text-7xl">
              احجز إلى {activeDestination.city} بثقة
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
              {activeDestination.description}
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="border-white/25 bg-white/10 text-white hover:border-white hover:bg-white hover:text-[#5f0f40]"
                onClick={() => setActiveIndex((activeIndex + 1) % featuredDestinations.length)}
              >
                تبديل الوجهة
              </Button>
              <Button className="bg-white text-[#5f0f40] shadow-none hover:bg-[#f8e8ef]" asChild>
                <a href="#booking">ابدأ الحجز</a>
              </Button>
            </div>
          </div>

          <div className="relative rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-right backdrop-blur-md">
            <div className="text-sm text-white/70">الوجهة الحالية</div>
            <h2 className="mt-2 text-3xl font-bold">{activeDestination.city}</h2>
            <p className="mt-1 text-white/80">{activeDestination.country}</p>
            <p className="mt-4 text-lg font-semibold">{activeDestination.teaser}</p>
            <p className="mt-2 text-2xl font-extrabold">{formatCurrency(startingPrice)}</p>
          </div>
        </div>

        <section className="rounded-[1.75rem] bg-[linear-gradient(180deg,#fffdfd,#f7eef2)] p-5 md:p-8">
          <div className="flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#9a7485]">البلدان والمناطق</p>
              <h3 className="mt-2 text-3xl font-bold text-[#4d102f]">استكشف الوجهات واحجز مباشرة من البطاقة</h3>
            </div>
            <p className="max-w-2xl text-[#745866]">
              كل صورة تمثل منطقة ومدينة واضحة. عند الضغط على البطاقة يتم تجهيز البحث مباشرة لنفس الوجهة والانتقال إلى صفحة الرحلات.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            {commonCountries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  setSelectedCountry(country);
                  const firstDestination = dataset.destinations.find((destination) => destination.country === country);
                  if (firstDestination) {
                    updateField("to", firstDestination.city);
                    const nextIndex = featuredDestinations.findIndex((item) => item.city === firstDestination.city);
                    if (nextIndex >= 0) {
                      setPreviousIndex(activeIndex);
                      setActiveIndex(nextIndex);
                    }
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedCountry === country
                    ? "bg-[#5f0f40] text-white"
                    : "bg-white text-[#5f0f40] shadow-sm"
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDestinations.map((destination) => {
              const destinationPrice = getDestinationPricing(
                dataset,
                destination.id,
                tripType,
                cabinClass,
                passengerType,
              );

              return (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => handleDestinationBooking(destination)}
                  className="group overflow-hidden rounded-[1.5rem] bg-white text-right shadow-[0_18px_45px_rgba(86,25,55,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(86,25,55,0.14)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.city}
                      fill
                      sizes="(max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#220717] via-[#220717]/35 to-transparent" />
                    <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
                      <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                        {destination.region}
                      </div>
                      <h4 className="mt-3 text-3xl font-extrabold">{destination.city}</h4>
                      <p className="mt-1 text-white/80">{destination.country}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-[#f8edf2] px-4 py-3 text-left">
                        <div className="text-xs text-[#8a6d7b]">يبدأ من</div>
                        <div className="mt-1 text-lg font-extrabold text-[#5f0f40]">{formatCurrency(destinationPrice)}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#8a1538]">{destination.teaser}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#6d4a5b]">{destination.description}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm text-[#7e6470]">
                        {tripType === "round-trip" ? "ذهاب وعودة" : "ذهاب فقط"} · {cabinClassLabels[cabinClass]}
                      </span>
                      <span className="rounded-full bg-[#5f0f40] px-4 py-2 text-sm font-bold text-white">
                        احجز هذه الوجهة
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_45px_rgba(86,25,55,0.08)] md:p-8">
          <div className="flex flex-col gap-3 text-right md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#9a7485]">الأكثر شيوعاً</p>
              <h3 className="mt-2 text-3xl font-bold text-[#4d102f]">الوجهات العالمية الأكثر طلباً</h3>
            </div>
            <p className="max-w-2xl text-[#745866]">
              هذا القسم للوجهات الأشهر فقط مثل باريس ونيويورك ولندن. أما الدول الخليجية ومناطقها فتبقى في القسم الذي تحته.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {popularDestinations.map((destination) => {
              const destinationPrice = getDestinationPricing(
                dataset,
                destination.id,
                tripType,
                cabinClass,
                passengerType,
              );

              return (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => handleDestinationBooking(destination)}
                  className="group overflow-hidden rounded-[1.5rem] bg-[#fcf8fa] text-right transition hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden rounded-[1.4rem]">
                    <Image
                      src={destination.image}
                      alt={destination.city}
                      fill
                      sizes="(max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#220717] via-[#220717]/30 to-transparent" />
                    <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
                      <div className="text-xs font-semibold text-white/80">{destination.region}</div>
                      <h4 className="mt-2 text-3xl font-extrabold">{destination.city}</h4>
                      <p className="mt-1 text-white/80">{destination.country}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-[#745866]">{destination.teaser}</div>
                      <div className="text-lg font-extrabold text-[#5f0f40]">{formatCurrency(destinationPrice)}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
