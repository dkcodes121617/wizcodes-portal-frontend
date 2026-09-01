"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { SupportContactNote } from "@/components/support/SupportContactNote";

const PAYMENT_DETAILS = {
  accountName: "Patel Divya Baijukumar",
  upiId: "7862036533@ptaxis",
  upiNumber: "7862036533",
} as const;

const QR_CODE_PATH = "/payment-qrcode.png";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="shrink-0 px-3 py-1.5 text-xs"
      onClick={() => void handleCopy()}
      aria-label={`Copy ${label}`}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function DetailRow({
  label,
  value,
  copyLabel,
}: {
  label: string;
  value: string;
  copyLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">{label}</p>
        <p className="text-ink mt-1 text-sm font-medium break-all">{value}</p>
      </div>
      {copyLabel ? <CopyButton value={value} label={copyLabel} /> : null}
    </div>
  );
}

export function PaymentInstructions() {
  return (
    <div className="bg-surface-raised/60 border-border mt-4 rounded-xl border p-4">
      <p className="text-ink text-sm font-semibold">Pay using these details</p>
      <p className="text-ink-secondary mt-1 text-sm">
        Scan the QR code or use the UPI details below, then upload your payment screenshot.
      </p>

      <div className="border-border bg-surface mt-4 overflow-hidden rounded-lg border p-3">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <Image
            src={QR_CODE_PATH}
            alt="WizCodes payment QR code"
            fill
            className="object-contain"
            sizes="220px"
            priority
          />
        </div>
        <p className="text-ink-muted mt-2 text-center text-xs">Scan to pay via UPI</p>
      </div>

      <dl className="mt-4 space-y-4">
        <DetailRow label="Account name" value={PAYMENT_DETAILS.accountName} />
        <DetailRow label="UPI ID" value={PAYMENT_DETAILS.upiId} copyLabel="UPI ID" />
        <DetailRow
          label="UPI number"
          value={PAYMENT_DETAILS.upiNumber}
          copyLabel="UPI number"
        />
      </dl>

      <SupportContactNote className="border-border mt-4 border-t pt-4" />
    </div>
  );
}
