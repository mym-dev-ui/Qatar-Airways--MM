import type { CabinClass, PassengerType, PromoCodeRecord, SeatMapSeat, TripType } from "@/lib/travel-data";

export interface SearchData {
  from: string;
  to: string;
  departure: string;
  returnDate: string;
  passengers: string;
  tripType: TripType;
  destinationId?: string;
}

export interface FlightSelection {
  destinationId: string;
  destinationCity: string;
  destinationCountry: string;
  fareName: string;
  farePrice: string;
  baseFare: number;
  routeType: string;
  cabinClass: CabinClass;
  passengerType: PassengerType;
  tripType: TripType;
}

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface BookingRecord {
  bookingReference?: string;
  status?: "draft" | "pending" | "confirmed";
  search?: SearchData;
  flight?: FlightSelection;
  passenger?: PassengerDetails;
  extras?: string[];
  seat?: string;
  seatSelection?: SeatMapSeat;
  promoCode?: string;
  promoDiscount?: number;
  appliedPromo?: PromoCodeRecord | null;
  autoDiscounts?: Array<{
    label: string;
    amount: number;
  }>;
  totals?: {
    baseFare: number;
    extrasTotal: number;
    seatTotal: number;
    taxes: number;
    subtotal: number;
    discountTotal: number;
    grandTotal: number;
  };
  payment?: {
    cardholderName: string;
    last4: string;
  };
  createdAt?: string;
}

const BOOKING_STORAGE_KEY = "skyline-booking-draft";
const BOOKING_HISTORY_KEY = "skyline-bookings";

export function readBookingDraft(): BookingRecord {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as BookingRecord;
  } catch {
    return {};
  }
}

export function saveBookingDraft(partial: Partial<BookingRecord>) {
  if (typeof window === "undefined") return;

  const current = readBookingDraft();
  const next = { ...current, ...partial };
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(next));
}

export function clearBookingDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BOOKING_STORAGE_KEY);
}

export function generateBookingReference() {
  const letters = "QTSKY";
  const randomLetters = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)],
  ).join("");
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${randomLetters}${randomDigits}`;
}

export function confirmBooking(payment: PaymentDetails) {
  if (typeof window === "undefined") return null;

  const current = readBookingDraft();
  const bookingReference = current.bookingReference || generateBookingReference();

  const pending: BookingRecord = {
    ...current,
    bookingReference,
    status: "pending",
    createdAt: new Date().toISOString(),
    payment: {
      cardholderName: payment.cardholderName,
      last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
    },
  };

  const history = readBookingHistory();
  const index = history.findIndex(item => item.bookingReference === bookingReference);
  if (index >= 0) history[index]=pending;
  else history.unshift(pending);

  window.localStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(history));
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(pending));
  return pending;
}

export function readBookingHistory(): BookingRecord[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(BOOKING_HISTORY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BookingRecord[];
  } catch {
    return [];
  }
}

export function findBooking(reference: string, email: string) {
  const history = readBookingHistory();
  return history.find(
    (booking) =>
      booking.bookingReference === reference.trim().toUpperCase() &&
      booking.passenger?.email?.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function validatePayment(payment: PaymentDetails) {
  if (!payment.cardholderName.trim()) return "أدخل اسم حامل البطاقة";
  if (payment.cardNumber.replace(/\s/g, "").length !== 16) return "رقم البطاقة يجب أن يكون 16 رقماً";
  if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) return "صيغة تاريخ الانتهاء يجب أن تكون MM/YY";
  if (!/^\d{3,4}$/.test(payment.cvv)) return "رمز CVV غير صحيح";
  return "";
}
