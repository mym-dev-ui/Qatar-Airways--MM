"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readBookingDraft, saveBookingDraft } from "@/lib/booking-store";
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
import { readTravelDataset } from "@/lib/travel-store";

const validCabinClasses: CabinClass[] = ["economy", "business", "first"];
const validPassengerTypes: PassengerType[] = ["adult", "child", "infant"];

export default function SearchResultsPage() {
  const dataset = useMemo(() => readTravelDataset(), []);
  const [searchSummary, setSearchSummary] = useState("");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [passengerType, setPassengerType] = useState<PassengerType>("adult");

  useEffect(() => {
    const booking = readBookingDraft();
    if (!booking.search) return;

    const { from, to, departure, passengers, destinationId, tripType: bookingTripType } = booking.search;
    setSearchSummary(`${from} ← ${to} | ${departure} | ${passengers}`);
    setTripType(bookingTripType);
    setSelectedDestination(destinationId || dataset.destinations[0]?.id || "");
    if (booking.flight) {
      setCabinClass(
        validCabinClasses.includes(booking.flight.cabinClass)
          ? booking.flight.cabinClass
          : "economy",
      );
      setPassengerType(
        validPassengerTypes.includes(booking.flight.passengerType)
          ? booking.flight.passengerType
          : "adult",
      );
    }
  }, [dataset.destinations]);

  function selectFlight(destination: DestinationRecord, routeType: string) {
    const baseFare = getDestinationPricing(
      dataset,
      destination.id,
      tripType,
      cabinClass,
      passengerType,
    );

    saveBookingDraft({
      search: {
        ...(readBookingDraft().search || {
          from: "عمّان",
          to: destination.city,
          departure: "",
          returnDate: "",
          passengers: "1 مسافر",
          tripType,
        }),
        to: destination.city,
        tripType,
        destinationId: destination.id,
      },
      flight: {
        destinationId: destination.id,
        destinationCity: destination.city,
        destinationCountry: destination.country,
        fareName: cabinClassLabels[cabinClass],
        farePrice: formatCurrency(baseFare),
        baseFare,
        routeType,
        cabinClass,
        passengerType,
        tripType,
      },
    });
  }

  const visibleDestinations = selectedDestination
    ? dataset.destinations.filter((destination) => destination.id === selectedDestination)
    : dataset.destinations;

  return (
    <main className="min-h-screen bg-[#fcf6f8] px-4 py-10 md:px-8" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-right">
          <p className="text-sm tracking-[0.25em] text-[#9a7485]">نتائج البحث</p>
          <h1 className="mt-2 text-4xl font-bold text-[#4d102f]">اختر رحلتك القادمة</h1>
          {searchSummary ? (
            <div className="mt-4 inline-flex rounded-full bg-[#f5edf0] px-4 py-2 text-sm text-[#6d4a5b]">
              {searchSummary}
            </div>
          ) : null}
        </div>

        <div className="mb-6 grid gap-4 rounded-[1.6rem] bg-white p-5 shadow-sm md:grid-cols-4">
          <select value={selectedDestination} onChange={(event) => setSelectedDestination(event.target.value)} className="rounded-2xl border border-[#e7d9df] px-4 py-3">
            {dataset.destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.city} - {destination.country} - {destination.region}
              </option>
            ))}
          </select>
          <select value={tripType} onChange={(event) => setTripType(event.target.value as TripType)} className="rounded-2xl border border-[#e7d9df] px-4 py-3">
            <option value="round-trip">ذهاب وعودة</option>
            <option value="one-way">ذهاب فقط</option>
          </select>
          <select value={cabinClass} onChange={(event) => setCabinClass(event.target.value as CabinClass)} className="rounded-2xl border border-[#e7d9df] px-4 py-3">
            {Object.entries(cabinClassLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select value={passengerType} onChange={(event) => setPassengerType(event.target.value as PassengerType)} className="rounded-2xl border border-[#e7d9df] px-4 py-3">
            {Object.entries(passengerTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          {visibleDestinations.map((destination, index) => {
            const routeType = index % 2 === 0 ? "رحلة مباشرة" : "رحلة مع توقف قصير";
            const baseFare = getDestinationPricing(dataset, destination.id, tripType, cabinClass, passengerType);
            return (
              <article key={destination.id} className="grid gap-4 rounded-[1.6rem] border border-[#eadbe1] bg-white p-5 shadow-sm md:grid-cols-[220px_1fr_auto]">
                <div className="relative h-44 w-full overflow-hidden rounded-[1.2rem]">
                  <Image src={destination.image} alt={destination.city} fill sizes="220px" className="object-cover" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#8a6d7b]">{destination.city}، {destination.country}</p>
                  <h2 className="mt-1 text-2xl font-bold text-[#4d102f]">{routeType}</h2>
                  <p className="mt-2 text-[#6d4a5b]">{destination.description}</p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2 text-sm text-[#6d4a5b]">
                    <span className="rounded-full bg-[#f5edf0] px-3 py-1">{cabinClassLabels[cabinClass]}</span>
                    <span className="rounded-full bg-[#f5edf0] px-3 py-1">{passengerTypeLabels[passengerType]}</span>
                    <span className="rounded-full bg-[#f5edf0] px-3 py-1">{tripType === "round-trip" ? "ذهاب وعودة" : "ذهاب فقط"}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between text-right">
                  <div>
                    <div className="text-sm text-[#8a6d7b]">السعر الأساسي</div>
                    <div className="text-2xl font-bold text-[#4d102f]">{formatCurrency(baseFare)}</div>
                  </div>
                  <Link
                    href="/step2"
                    onClick={() => selectFlight(destination, routeType)}
                    className="rounded-full bg-[#5f0f40] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#7b124d]"
                  >
                    متابعة الحجز
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
