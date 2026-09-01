"use client";

import { useEffect, useState } from "react";

import { fetchPaymentScreenshotObjectUrl } from "@/lib/payment";

interface PaymentScreenshotImageProps {
  token: string | null;
  apiPath: string;
  hasScreenshot: boolean;
  alt: string;
  className?: string;
  localPreviewUrl?: string | null;
}

export function PaymentScreenshotImage({
  token,
  apiPath,
  hasScreenshot,
  alt,
  className = "",
  localPreviewUrl = null,
}: PaymentScreenshotImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(localPreviewUrl);
  const [loading, setLoading] = useState(Boolean(hasScreenshot && token && !localPreviewUrl));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (localPreviewUrl) {
      setImageUrl(localPreviewUrl);
      setLoading(false);
      setFailed(false);
      return;
    }

    if (!hasScreenshot || !token) {
      setImageUrl(null);
      setLoading(false);
      setFailed(false);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadScreenshot() {
      if (!token) return;

      setLoading(true);
      setFailed(false);

      try {
        objectUrl = await fetchPaymentScreenshotObjectUrl(token, apiPath);
        if (!cancelled) {
          setImageUrl(objectUrl);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          setImageUrl(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadScreenshot();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [apiPath, hasScreenshot, localPreviewUrl, token]);

  if (loading) {
    return <p className="text-ink-muted text-sm">Loading screenshot…</p>;
  }

  if (imageUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- authenticated blob URL from API
      <img src={imageUrl} alt={alt} className={className} onError={() => setFailed(true)} />
    );
  }

  if (hasScreenshot) {
    return (
      <p className="text-ink-secondary text-sm">
        Screenshot uploaded but could not be displayed.
      </p>
    );
  }

  return null;
}
