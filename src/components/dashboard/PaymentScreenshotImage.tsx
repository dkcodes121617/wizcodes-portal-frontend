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

function RemotePaymentScreenshotImage({
  token,
  apiPath,
  hasScreenshot,
  alt,
  className,
}: Omit<PaymentScreenshotImageProps, "localPreviewUrl"> & { token: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hasScreenshot) {
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadScreenshot() {
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
  }, [apiPath, hasScreenshot, token]);

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

export function PaymentScreenshotImage({
  token,
  apiPath,
  hasScreenshot,
  alt,
  className = "",
  localPreviewUrl = null,
}: PaymentScreenshotImageProps) {
  if (localPreviewUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local file preview blob URL
      <img src={localPreviewUrl} alt={alt} className={className} />
    );
  }

  if (!hasScreenshot || !token) {
    return null;
  }

  return (
    <RemotePaymentScreenshotImage
      token={token}
      apiPath={apiPath}
      hasScreenshot={hasScreenshot}
      alt={alt}
      className={className}
    />
  );
}
