"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import type { StudentProfile } from "@/lib/auth";
import { getToken } from "@/lib/auth";
import {
  PAYMENT_ACCESS_PENDING,
  resolvePaymentScreenshotUrl,
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
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const hasScreenshot = Boolean(student.payment_screenshot_url);
  const storedImageUrl = resolvePaymentScreenshotUrl(student.payment_screenshot_url);
  const displayImageUrl = previewUrl ?? storedImageUrl;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadError(null);
    setImageLoadFailed(false);

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
          Upload a screenshot of your payment (UPI/bank transfer) so an admin can verify it.
        </p>
      )}

      {displayImageUrl && !imageLoadFailed ? (
        <div className="border-border mt-4 overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob or API-relative URL */}
          <img
            src={displayImageUrl}
            alt="Your payment screenshot"
            className="max-h-64 w-full object-contain"
            onError={() => setImageLoadFailed(true)}
          />
        </div>
      ) : hasScreenshot ? (
        <p className="text-ink-muted mt-4 text-xs">
          Preview unavailable. Choose a new image below to replace your screenshot.
        </p>
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
    </section>
  );
}
