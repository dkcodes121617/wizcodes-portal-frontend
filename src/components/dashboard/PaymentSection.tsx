"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";
import { PaymentInstructions } from "@/components/dashboard/PaymentInstructions";
import { PaymentScreenshotImage } from "@/components/dashboard/PaymentScreenshotImage";
import { SupportContactNote } from "@/components/support/SupportContactNote";
import { ApiError } from "@/lib/api";
import type { StudentProfile } from "@/lib/auth";
import { getToken } from "@/lib/auth";
import {
  PAYMENT_ACCESS_PENDING,
  STUDENT_PAYMENT_SCREENSHOT_VIEW_PATH,
  uploadPaymentScreenshot,
  validatePaymentScreenshotFile,
} from "@/lib/payment";

interface PaymentSectionProps {
  student: StudentProfile;
  onStudentUpdated: (student: StudentProfile) => void;
}

export function PaymentSection({ student, onStudentUpdated }: PaymentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const hasScreenshot = Boolean(student.payment_screenshot_url);
  const authToken = getToken();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validatePaymentScreenshotFile(file);
    if (validationError) {
      setSelectedFile(null);
      setUploadError(validationError);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadError("Choose an image file first.");
      return;
    }

    const validationError = validatePaymentScreenshotFile(selectedFile);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const token = getToken();
    if (!token) {
      setUploadError("You are not signed in.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const updated = await uploadPaymentScreenshot(selectedFile, token);
      onStudentUpdated(updated);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setUploadError(
        error instanceof ApiError ? error.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  if (student.access_status !== PAYMENT_ACCESS_PENDING) {
    return null;
  }

  return (
    <section className="border-border mt-8 rounded-xl border px-5 py-4 text-left">
      <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">Payment</p>

      {hasScreenshot ? (
        <p className="bg-success-bg text-success mt-3 rounded-lg px-4 py-3 text-sm">
          Screenshot uploaded — waiting for admin review.
        </p>
      ) : (
        <p className="text-ink-secondary mt-3 text-sm">
          Pay using the UPI details below, then upload a screenshot of your successful payment.
        </p>
      )}

      <PaymentInstructions />

      {hasScreenshot || previewUrl ? (
        <div className="border-border mt-4 overflow-hidden rounded-lg border">
          <PaymentScreenshotImage
            token={authToken}
            apiPath={STUDENT_PAYMENT_SCREENSHOT_VIEW_PATH}
            hasScreenshot={hasScreenshot}
            localPreviewUrl={previewUrl}
            alt="Your payment screenshot"
            className="max-h-64 w-full object-contain"
          />
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="border-border bg-surface text-ink file:bg-surface-raised file:text-ink w-full rounded-lg border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploadError ? (
          <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
            {uploadError}
          </p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          loading={uploading}
          disabled={!selectedFile || uploading}
          onClick={() => void handleUpload()}
        >
          {hasScreenshot ? "Replace payment screenshot" : "Upload payment screenshot"}
        </Button>
      </div>

      <SupportContactNote className="mt-4" />
    </section>
  );
}
