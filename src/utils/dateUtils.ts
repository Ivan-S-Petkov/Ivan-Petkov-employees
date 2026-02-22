import { isMatch, isValid, parse } from "date-fns";

export const SUPPORTED_FORMATS = [
  // ISO
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "yyyyMMdd",

  // US (prioritized before EU)
  "MM/dd/yyyy",
  "M/d/yyyy",
  "MM-dd-yyyy",
  "M-d-yyyy",

  // EU
  "dd/MM/yyyy",
  "d/M/yyyy",
  "dd-MM-yyyy",
  "d-M-yyyy",

  // Two-digit year
  "MM/dd/yy",
  "dd/MM/yy",

  // Month names
  "dd MMM yyyy",
  "MMM dd yyyy",
  "dd MMMM yyyy",
  "MMMM dd yyyy",
] as const;

export interface ParseResult {
  date: Date;
  isAmbiguous: boolean;
}

function normalizeToUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

function parseStrict(
  input: string,
  formatStr: string,
  referenceDate: Date,
): Date | null {
  if (!isMatch(input, formatStr)) return null;
  const parsed = parse(input, formatStr, referenceDate);
  return isValid(parsed) ? normalizeToUTC(parsed) : null;
}

export function parseFlexibleDate(input: string | null): ParseResult {
  const raw = input?.trim();

  if (!raw || raw.toUpperCase() === "NULL") {
    return { date: normalizeToUTC(new Date()), isAmbiguous: false };
  }

  const referenceDate = new Date();

  const parsedDates = SUPPORTED_FORMATS.map((f) =>
    parseStrict(raw, f, referenceDate),
  ).filter((d): d is Date => d !== null);

  if (parsedDates.length === 0) {
    throw new Error(`Unsupported date format: ${raw}`);
  }

  const uniqueDates = new Set(parsedDates.map((d) => d.getTime()));

  return {
    date: parsedDates[0], // format priority preserved
    isAmbiguous: uniqueDates.size > 1,
  };
}
