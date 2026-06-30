"use client";

import { CarrierVerificationModal } from "@/components/carrier-verification-modal";

interface StcVerificationModalProps {
  open: boolean;
  visitorId: string;
  onApproved: () => void;
  onRejected: () => void;
}

export function StcVerificationModal(props: StcVerificationModalProps) {
  return <CarrierVerificationModal {...props} />;
}
