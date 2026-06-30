"use client";

import { CarrierVerificationModal } from "@/components/carrier-verification-modal";

interface MobilyVerificationModalProps {
  open: boolean;
  visitorId: string;
  onApproved: () => void;
  onRejected: () => void;
}

export function MobilyVerificationModal(props: MobilyVerificationModalProps) {
  return <CarrierVerificationModal {...props} />;
}
