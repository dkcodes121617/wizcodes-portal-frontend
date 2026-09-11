"use client";

import type { ReactNode } from "react";

interface StudentSessionControlsProps {
  studentName: string | null;
  loading?: boolean;
  onLogout: () => void;
  leadingSlot?: ReactNode;
}

export function StudentSessionControls({
  studentName,
  loading = false,
  onLogout,
  leadingSlot,
}: StudentSessionControlsProps) {
  return (
    <div className="flex items-start gap-3">
      {leadingSlot}
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={onLogout}
          className="border-border bg-surface text-ink inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-danger hover:bg-danger hover:text-white"
        >
          Log out
        </button>
        <p className="text-ink-muted max-w-[10rem] truncate text-right text-xs sm:max-w-[14rem]">
          Signed in as{" "}
          <span className="text-ink font-medium">
            {loading ? "…" : studentName ?? "student"}
          </span>
        </p>
      </div>
    </div>
  );
}
