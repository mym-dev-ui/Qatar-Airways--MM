"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  CircleCheckBig,
  CreditCard,
  Globe,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  confirmBooking,
  formatCardNumber,
  readBookingDraft,
  saveBookingDraft,
  validatePayment,
  type BookingRecord,
  type FawranAliasType,
  type PaymentDetails,
  type PaymentOptionId,
} from "@/lib/booking-store";

const defaultPayment: PaymentDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const paymentOptions: Array<{
  id: PaymentOptionId;
  group: "cards" | "cardless";
}> = [
  { id: "himyan", group: "cards" },
  { id: "naps", group: "cards" },
  { id: "fawran", group: "cardless" },
];

const paymentMethodLabels: Record<PaymentOptionId, string> = {
  himyan: "Himyan",
  naps: "NAPS",
  fawran: "Fawran",
};

const fawranProviders = [
  "Ahli Bank of Qatar",
  "Al Rayyan Bank",
  "Arab Bank",
  "Commercial Bank of Qatar",
  "Doha Bank",
  "Dukhan Bank",
  "Qatar International Islamic Bank",
  "Qatar Islamic Bank",
  "Qatar National Bank",
];

const fawranAliasTypes: FawranAliasType[] = ["Mobile Number", "IBAN", "Other"];

const extrasPricing: Record<string, number> = {
  "أمتعة إضافية": 160,
  "دخول الصالة": 220,
  "إنترنت على متن الطائرة": 55,
  "وجبة خاصة": 35,
};

function buildPaymentReference(booking: BookingRecord) {
  const seed = [
    booking.search?.departure,
    booking.flight?.destinationId,
    booking.passenger?.passportNumber,
    booking.totals?.grandTotal?.toString(),
  ]
    .filter(Boolean)
    .join("");

  const digits = seed.replace(/\D/g, "");
  return (digits || `${Date.now()}${Math.round((booking.totals?.grandTotal || 0) * 100)}`)
    .padEnd(20, "7")
    .slice(0, 20);
}

function buildBookingTotals(booking: BookingRecord) {
  const baseFare = booking.flight?.baseFare || 0;
  const extrasTotal = (booking.extras || []).reduce((sum, extra) => sum + (extrasPricing[extra] || 0), 0);
  const seatTotal = booking.seatSelection?.price || 0;
  const taxes = booking.totals?.taxes ?? 220;
  const subtotal = baseFare + extrasTotal + seatTotal;
  const discountTotal = booking.totals?.discountTotal || 0;

  return {
    baseFare,
    extrasTotal,
    seatTotal,
    taxes,
    subtotal,
    discountTotal,
    grandTotal: Math.max(subtotal + taxes - discountTotal, 0),
  };
}

function formatGatewayAmount(value: number) {
  return new Intl.NumberFormat("en-QA", {
    style: "currency",
    currency: "QAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function PaymentBrand({ option }: { option: PaymentOptionId }) {
  if (option === "himyan") {
    return (
      <div className="flex items-center gap-3">
        <span className="h-0 w-0 border-y-[11px] border-y-transparent border-r-[19px] border-r-[#8f174f]" />
        <span className="text-[1.68rem] font-black uppercase tracking-[0.16em] text-[#2d1a26]">
          Himyan
        </span>
      </div>
    );
  }

  if (option === "naps") {
    return (
      <div className="flex items-center gap-3">
        <span className="relative h-5 w-5 rotate-45 rounded-[2px] bg-[#9d1e58]">
          <span className="absolute -right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-[2px] bg-[#c44d82]" />
        </span>
        <span className="text-[1.7rem] font-black uppercase tracking-[0.1em] text-[#251b25]">
          NAPS
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#102f49] px-6 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <span className="bg-gradient-to-r from-[#c9fbff] via-white to-[#5fd8ff] bg-clip-text text-[1.68rem] font-black tracking-[0.03em] text-transparent">
        Fawran
      </span>
    </div>
  );
}

function PaymentOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: PaymentOptionId;
  selected: boolean;
  onSelect: (value: PaymentOptionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`flex w-full items-center justify-between rounded-[1.7rem] border bg-white px-5 py-5 text-left transition ${
        selected
          ? "border-[#7b154d] shadow-[0_0_0_2px_rgba(123,21,77,0.08)]"
          : "border-[#ebe6ef] hover:border-[#d9bfd0]"
      }`}
    >
      <PaymentBrand option={option} />
      <span
        className={`grid h-10 w-10 place-items-center rounded-full border ${
          selected
            ? "border-[#7b154d] bg-[#fff6fb] text-[#7b154d]"
            : "border-[#ddd5df] bg-white text-transparent"
        }`}
      >
        <CircleCheckBig className="h-5 w-5" />
      </span>
    </button>
  );
}

function DetailRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[1.35rem] bg-[linear-gradient(90deg,rgba(128,25,85,0.98)_0%,rgba(111,19,74,0.98)_100%)] px-4 py-3.5 text-left">
      <p className="text-sm text-white/75">{label}</p>
      <p
        className={`mt-1 font-extrabold text-white ${
          compact ? "text-[1.05rem]" : "text-[1.2rem] tracking-[0.02em]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PickerModal({
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}: {
  title: string;
  options: string[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-[370px] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(18,12,17,0.35)]">
        <div className="border-b border-[#f0ebf0] px-5 py-4">
          <h3 className="text-xl font-bold text-[#2c1d29]">{title}</h3>
        </div>
        <div className="max-h-[65vh] overflow-y-auto">
          {options.map((option) => {
            const active = selectedValue === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
                className="flex w-full items-center gap-5 border-b border-[#f4eff3] px-5 py-5 text-left last:border-b-0"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 ${
                    active ? "border-[#4aa796]" : "border-[#d6d1d8]"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full ${
                      active ? "bg-[#4aa796]" : "bg-transparent"
                    }`}
                  />
                </span>
                <span className="text-[1.12rem] leading-7 text-[#433447]">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CardPaymentModal({
  option,
  payment,
  error,
  submitting,
  onClose,
  onChange,
  onContinue,
}: {
  option: PaymentOptionId;
  payment: PaymentDetails;
  error: string;
  submitting: boolean;
  onClose: () => void;
  onChange: (name: keyof PaymentDetails, value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[2rem] bg-white p-5 shadow-[0_24px_60px_rgba(18,12,17,0.35)]"
        dir="ltr"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#948693]">
              Secure card payment
            </p>
            <h3 className="mt-2 text-[1.45rem] font-black tracking-tight text-[#251826]">
              Enter {paymentMethodLabels[option]} Card Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#eadfe7] text-[#6f5f6d] transition hover:bg-[#f8f2f6]"
            aria-label="Close payment form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            value={payment.cardholderName}
            onChange={(event) => onChange("cardholderName", event.target.value)}
            placeholder="Cardholder Name"
            className="rounded-[1.4rem] border border-[#e6dee6] px-4 py-4 text-[1rem] text-[#2e2030] outline-none transition focus:border-[#7b154d]"
          />
          <input
            value={payment.cardNumber}
            onChange={(event) => onChange("cardNumber", event.target.value)}
            placeholder="Card Number"
            className="rounded-[1.4rem] border border-[#e6dee6] px-4 py-4 text-[1rem] text-[#2e2030] outline-none transition focus:border-[#7b154d]"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={payment.expiry}
              onChange={(event) => onChange("expiry", event.target.value)}
              placeholder="MM/YY"
              className="rounded-[1.4rem] border border-[#e6dee6] px-4 py-4 text-[1rem] text-[#2e2030] outline-none transition focus:border-[#7b154d]"
            />
            <input
              value={payment.cvv}
              onChange={(event) => onChange("cvv", event.target.value)}
              placeholder="CVV"
              className="rounded-[1.4rem] border border-[#e6dee6] px-4 py-4 text-[1rem] text-[#2e2030] outline-none transition focus:border-[#7b154d]"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-[#c23c61]">{error}</p> : null}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[1.2rem] border border-[#dcc8d4] px-4 py-3 font-bold text-[#5f0f40]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={submitting}
            className="flex-[1.25] rounded-[1.2rem] bg-[#5f0f40] px-4 py-3 font-bold text-white shadow-[0_14px_30px_rgba(95,15,64,0.24)] disabled:opacity-60"
          >
            {submitting ? "جارٍ التأكيد..." : `Continue with ${paymentMethodLabels[option]}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingRecord>({});
  const [selectedOption, setSelectedOption] = useState<PaymentOptionId>("himyan");
  const [payment, setPayment] = useState<PaymentDetails>(defaultPayment);
  const [fawranProvider, setFawranProvider] = useState(fawranProviders[0]);
  const [aliasType, setAliasType] = useState<FawranAliasType>("Other");
  const [aliasValue, setAliasValue] = useState("");
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [aliasModalOpen, setAliasModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const current = readBookingDraft();
    setBooking(current);

    if (current.selectedPaymentOption) {
      setSelectedOption(current.selectedPaymentOption);
    }

    if (current.paymentDraft) {
      setPayment((previous) => ({
        ...previous,
        cardholderName: current.paymentDraft?.cardholderName || "",
        cardNumber: current.paymentDraft?.cardNumber || "",
      }));
    }

    if (current.fawranDraft) {
      setFawranProvider(current.fawranDraft.provider);
      setAliasType(current.fawranDraft.aliasType);
      setAliasValue(current.fawranDraft.aliasValue);
    }
  }, []);

  const hasCheckoutContext = Boolean(booking.passenger && booking.flight);
  const liveTotals = useMemo(
    () => booking.totals || buildBookingTotals(booking),
    [booking],
  );
  const paymentReference = useMemo(
    () => (hasCheckoutContext ? buildPaymentReference(booking) : "17827615699167932161"),
    [booking, hasCheckoutContext],
  );
  const amount = hasCheckoutContext ? liveTotals.grandTotal || 129 : 129;
  const description = booking.flight ? `${booking.flight.destinationCity} Flight Booking` : "Talabat Order";
  const backHref = hasCheckoutContext ? "/step4" : "/";
  const showFawranValueError = selectedOption === "fawran" && error === "Value cannot be empty";

  function updateField(name: keyof PaymentDetails, value: string) {
    if (name === "cardNumber") value = formatCardNumber(value);
    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setPayment((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  }

  function handleSelectOption(option: PaymentOptionId) {
    setSelectedOption(option);
    setCardModalOpen(option !== "fawran");
    setError("");
  }

  function handleCloseCardModal() {
    setCardModalOpen(false);
    setSubmitting(false);
    setError("");
  }

  function handleContinue() {
    const current = readBookingDraft();
    if (!current.passenger || !current.flight) {
      router.push("/step4");
      return;
    }

    const totals = current.totals || buildBookingTotals(current);
    setSubmitting(true);
    setError("");

    if (selectedOption === "fawran") {
      if (!fawranProvider.trim()) {
        setError("Please select Fawran provider");
        setSubmitting(false);
        return;
      }
      if (!aliasValue.trim()) {
        setError("Value cannot be empty");
        setSubmitting(false);
        return;
      }

      saveBookingDraft({
        totals,
        selectedPaymentOption: selectedOption,
        paymentDraft: undefined,
        fawranDraft: {
          provider: fawranProvider,
          aliasType,
          aliasValue: aliasValue.trim(),
        },
      });

      const confirmed = confirmBooking({
        method: selectedOption,
        provider: fawranProvider,
        aliasType,
        aliasValue: aliasValue.trim(),
      });

      if (!confirmed) {
        setError("تعذر تأكيد الدفع");
        setSubmitting(false);
        return;
      }

      router.push("/step6");
      return;
    }

    const validationError = validatePayment(payment);
    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }

    saveBookingDraft({
      totals,
      selectedPaymentOption: selectedOption,
      fawranDraft: undefined,
      paymentDraft: {
        cardholderName: payment.cardholderName.trim(),
        cardNumber: payment.cardNumber,
      },
    });

    const confirmed = confirmBooking({
      method: selectedOption,
      cardholderName: payment.cardholderName.trim(),
      cardNumber: payment.cardNumber,
    });

    if (!confirmed) {
      setError("تعذر تأكيد الدفع");
      setSubmitting(false);
      return;
    }

    router.push("/step6");
  }

  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdfbfe_0%,#f4eef3_35%,#efe8ef_100%)] px-4 py-6">
        <div className="mx-auto max-w-[430px]">
          <div className="overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_90px_rgba(71,18,48,0.16)]">
            <div className="px-5 pt-5 text-[#261927]">
              <div className="flex justify-end">
                <div className="text-xl font-bold">10:33</div>
              </div>
              <div className="mt-5 flex justify-end">
                <Link
                  href={backHref}
                  className="grid h-11 w-11 place-items-center rounded-full text-[#2f2230] transition hover:bg-[#f6f1f5]"
                >
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="mt-5 border-t border-[#f0ebf1] bg-[#fbfafc] px-5 pb-7 pt-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#ebe4eb] bg-white px-4 py-2 text-sm font-semibold text-[#514151] shadow-[0_8px_20px_rgba(53,26,43,0.08)]"
                >
                  <Globe className="h-4 w-4" />
                  العربية
                </button>
              </div>

              <section
                className="mt-5 rounded-[2rem] bg-[linear-gradient(180deg,#720f4f_0%,#5f0f40_100%)] p-4 text-white shadow-[0_18px_40px_rgba(95,15,64,0.32)]"
                dir="ltr"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-14 min-w-[150px] items-center gap-3 rounded-[1.2rem] bg-white px-4 text-[#181217]">
                    <span className="h-0 w-0 border-y-[10px] border-y-transparent border-r-[22px] border-r-[#9d1e58]" />
                    <span className="text-[2.1rem] font-black uppercase tracking-tight">QPAY</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-[1.15rem] border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                    <ShieldCheck className="h-5 w-5 text-[#bdf1ce]" />
                    Secure Payment
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <DetailRow label="Payment Unique Number" value={paymentReference} compact />
                  <DetailRow label="Description" value={description} />
                  <DetailRow label="Amount" value={formatGatewayAmount(amount)} />
                </div>
              </section>

              <section className="mt-6 text-left" dir="ltr">
                <h1 className="text-[1.82rem] font-black tracking-tight text-[#251826]">
                  Payment Option
                </h1>
                <p className="mt-1 text-sm text-[#7d7180]">
                  Select a payment method to continue
                </p>

                <div className="mt-6 flex items-center gap-3 text-[#5f0f40]">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f8edf4]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-[1.55rem] font-bold text-[#261926]">
                    Debit and Prepaid Cards
                  </h2>
                </div>

                <div className="mt-4 space-y-4">
                  {paymentOptions
                    .filter((option) => option.group === "cards")
                    .map((option) => (
                      <PaymentOptionCard
                        key={option.id}
                        option={option.id}
                        selected={selectedOption === option.id}
                        onSelect={handleSelectOption}
                      />
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-3 text-[#5f0f40]">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f8edf4]">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <h2 className="text-[1.55rem] font-bold text-[#261926]">Cardless</h2>
                </div>

                <div className="mt-4">
                  {paymentOptions
                    .filter((option) => option.group === "cardless")
                    .map((option) => (
                      <PaymentOptionCard
                        key={option.id}
                        option={option.id}
                        selected={selectedOption === option.id}
                        onSelect={handleSelectOption}
                      />
                    ))}
                </div>

                {selectedOption === "fawran" ? (
                  <section className="mt-6 rounded-[1.8rem] border border-[#ece3eb] bg-white p-5 shadow-[0_14px_40px_rgba(71,18,48,0.06)]">
                    <h3 className="text-[1.6rem] font-black tracking-tight text-[#251826]">
                      Enter Fawran Details
                    </h3>

                    <div className="mt-5 space-y-5">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#908491]">
                          Fawran Provider
                        </span>
                        <button
                          type="button"
                          onClick={() => setProviderModalOpen(true)}
                          className="flex w-full items-center justify-between rounded-[1.5rem] border border-[#e6dee6] bg-white px-4 py-4 text-[1.05rem] text-[#2e2030] shadow-[0_5px_18px_rgba(64,24,49,0.04)]"
                        >
                          <span>{fawranProvider}</span>
                          <ChevronDown className="h-5 w-5 text-[#9d92a0]" />
                        </button>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#908491]">
                          Alias Type
                        </span>
                        <button
                          type="button"
                          onClick={() => setAliasModalOpen(true)}
                          className="flex w-full items-center justify-between rounded-[1.5rem] border border-[#e6dee6] bg-white px-4 py-4 text-[1.05rem] text-[#2e2030] shadow-[0_5px_18px_rgba(64,24,49,0.04)]"
                        >
                          <span>{aliasType}</span>
                          <ChevronDown className="h-5 w-5 text-[#9d92a0]" />
                        </button>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#908491]">
                          Alias Value
                        </span>
                        <input
                          value={aliasValue}
                          onChange={(event) => {
                            setAliasValue(event.target.value);
                            if (error) setError("");
                          }}
                          placeholder={aliasType === "Mobile Number" ? "Enter mobile number" : aliasType === "IBAN" ? "Enter IBAN" : "Enter alias value"}
                          className="w-full rounded-[1.5rem] border border-[#e6dee6] px-4 py-4 text-[1.02rem] text-[#2e2030] outline-none transition focus:border-[#7b154d]"
                        />
                        {showFawranValueError ? (
                          <span className="mt-2 block text-sm font-medium text-[#c06283]">
                            Value cannot be empty
                          </span>
                        ) : null}
                      </label>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[#7f7180]">
                      By clicking the Continue button you hereby acknowledge accepting the
                      Terms and Conditions of payment.
                    </p>
                  </section>
                ) : null}

                {selectedOption === "fawran" && error && !showFawranValueError ? (
                  <p className="mt-4 text-sm font-medium text-[#c23c61]">{error}</p>
                ) : null}

                <div className="mt-6 rounded-[1.6rem] border border-[#f3e1a4] bg-[#fff8df] px-4 py-4 text-sm leading-7 text-[#8a6f2a]">
                  For proper completion of your transaction, please do not refresh this page
                  or click the browser&apos;s back button.
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={backHref}
                    className="flex-1 rounded-[1.3rem] border border-[#dcc8d4] px-4 py-3 text-center font-bold text-[#5f0f40]"
                  >
                    Cancel
                  </Link>
                  {selectedOption === "fawran" ? (
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={submitting}
                      className="flex-[1.4] rounded-[1.3rem] bg-[#5f0f40] px-4 py-3 font-bold text-white shadow-[0_14px_30px_rgba(95,15,64,0.24)] disabled:opacity-60"
                    >
                      {submitting ? "جارٍ التأكيد..." : "Continue with Fawran"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCardModalOpen(true)}
                      className="flex-[1.4] rounded-[1.3rem] bg-[#5f0f40] px-4 py-3 font-bold text-white shadow-[0_14px_30px_rgba(95,15,64,0.24)]"
                    >
                      Open {paymentMethodLabels[selectedOption]} Form
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {cardModalOpen && selectedOption !== "fawran" ? (
        <CardPaymentModal
          option={selectedOption}
          payment={payment}
          error={error}
          submitting={submitting}
          onClose={handleCloseCardModal}
          onChange={updateField}
          onContinue={handleContinue}
        />
      ) : null}

      {providerModalOpen ? (
        <PickerModal
          title="Select Fawran Provider"
          options={fawranProviders}
          selectedValue={fawranProvider}
          onClose={() => setProviderModalOpen(false)}
          onSelect={(value) => setFawranProvider(value)}
        />
      ) : null}

      {aliasModalOpen ? (
        <PickerModal
          title="Select Alias Type"
          options={fawranAliasTypes}
          selectedValue={aliasType}
          onClose={() => setAliasModalOpen(false)}
          onSelect={(value) => setAliasType(value as FawranAliasType)}
        />
      ) : null}
    </>
  );
}
