"use client";

import { useEffect, useId, useRef, useState } from "react";

import { formatIsoDateDdMmYyyy, parseDdMmYyyyToIso } from "@/lib/dates";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (isoValue: string) => void;
  min?: string;
  max?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function DateInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  error,
  required,
  disabled,
  placeholder = "DD/MM/YYYY",
}: DateInputProps) {
  const inputId = useId();
  const nativePickerRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState<string | undefined>();

  useEffect(() => {
    setText(value ? formatIsoDateDdMmYyyy(value) : "");
    setLocalError(undefined);
  }, [value]);

  function commitText(nextText: string) {
    const trimmed = nextText.trim();
    if (!trimmed) {
      onChange("");
      setLocalError(undefined);
      return;
    }

    const iso = parseDdMmYyyyToIso(trimmed);
    if (!iso) {
      setLocalError("Enter a valid date (DD/MM/YYYY)");
      return;
    }

    if (min && iso < min) {
      setLocalError(`Date must be on or after ${formatIsoDateDdMmYyyy(min)}`);
      return;
    }
    if (max && iso > max) {
      setLocalError(`Date must be on or before ${formatIsoDateDdMmYyyy(max)}`);
      return;
    }

    onChange(iso);
    setText(formatIsoDateDdMmYyyy(iso));
    setLocalError(undefined);
  }

  function handleNativePickerChange(nextIso: string) {
    if (!nextIso) {
      onChange("");
      return;
    }
    if (min && nextIso < min) return;
    if (max && nextIso > max) return;

    onChange(nextIso);
    setText(formatIsoDateDdMmYyyy(nextIso));
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-ink text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          disabled={disabled}
          required={required}
          onChange={(event) => {
            setText(event.target.value);
            setLocalError(undefined);
          }}
          onBlur={() => commitText(text)}
          className={`border-border bg-surface text-ink placeholder:text-ink-muted focus:border-brand w-full rounded-lg border py-2.5 pr-11 pl-4 text-sm transition-colors outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] ${error ? "border-danger" : ""}`}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => nativePickerRef.current?.showPicker?.()}
          className="text-ink-muted hover:text-ink absolute top-1/2 right-3 -translate-y-1/2 transition-colors disabled:opacity-50"
          aria-label={`Open calendar for ${label}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <input
          ref={nativePickerRef}
          type="date"
          lang="en-GB"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          value={value}
          min={min}
          max={max}
          onChange={(event) => handleNativePickerChange(event.target.value)}
        />
      </div>
      {error || localError ? (
        <p className="text-danger text-xs">{error ?? localError}</p>
      ) : null}
    </div>
  );
}
