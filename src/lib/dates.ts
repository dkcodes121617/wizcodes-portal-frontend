const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  if (!ISO_DATE_RE.test(iso)) return null;

  const [y, m, d] = iso.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;

  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }

  return { y, m, d };
}

export function toIsoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY. */
export function formatIsoDateDdMmYyyy(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;

  const { y, m, d } = parsed;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

/** Parse DD/MM/YYYY or D/M/YY into ISO YYYY-MM-DD. */
export function parseDdMmYyyyToIso(input: string): string | null {
  const trimmed = input.trim();
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(trimmed);
  if (!match) return null;

  const d = Number(match[1]);
  const m = Number(match[2]);
  let y = Number(match[3]);
  if (y < 100) y += 2000;

  const iso = toIsoDate(y, m, d);
  return parseIsoDate(iso) ? iso : null;
}

export function addDaysToIsoDate(iso: string, days: number): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;

  const date = new Date(parsed.y, parsed.m - 1, parsed.d);
  date.setDate(date.getDate() + days);
  return toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** Latest allowed end date for the chosen duration (inclusive). */
export function getMaxInternshipEndDateIso(startIso: string, durationWeeks: number): string {
  return addDaysToIsoDate(startIso, durationWeeks * 7);
}

export function isInternshipEndDateValid(
  startIso: string,
  endIso: string,
  durationWeeks: number,
): boolean {
  if (!parseIsoDate(startIso) || !parseIsoDate(endIso)) return false;
  if (endIso < startIso) return false;

  const maxEnd = getMaxInternshipEndDateIso(startIso, durationWeeks);
  return endIso <= maxEnd;
}

export function formatInternshipDateRange(
  startDate: string | null,
  endDate: string | null,
): string | null {
  if (!startDate || !endDate) return null;
  if (!parseIsoDate(startDate) || !parseIsoDate(endDate)) return null;

  return `${formatIsoDateDdMmYyyy(startDate)} – ${formatIsoDateDdMmYyyy(endDate)}`;
}
