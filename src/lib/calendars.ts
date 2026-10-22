// Multi-calendar conversion utilities.
// Gregorian is the source of truth (JS Date).
//
// Everything here is small, dependency-light and safe to ship on first paint.
// The heavier festival/observance data lives in ./calendars.observances and is
// loaded on demand.

import NepaliDate from "nepali-date-converter";

export type CalendarSystem =
  | "gregorian"
  | "hijri"
  | "chinese"
  | "persian"
  | "nepali"
  | "hebrew";

// Ordered by how many people live by each system day to day.
export const SYSTEM_ORDER: CalendarSystem[] = [
  "gregorian",
  "hijri",
  "chinese",
  "persian",
  "nepali",
  "hebrew",
];

export const CALENDAR_META: Record<
  CalendarSystem,
  { name: string; token: string; description: string; reach: string; type: string }
> = {
  gregorian: {
    name: "Gregorian",
    token: "cal-gregorian",
    description: "The civil standard almost every country uses for business and law.",
    reach: "Global civil use",
    type: "Solar",
  },
  hijri: {
    name: "Hijri",
    token: "cal-hijri",
    description: "Islamic lunar year, used for Ramadan, Hajj and religious dates.",
    reach: "~2 billion people",
    type: "Lunar",
  },
  chinese: {
    name: "Chinese",
    token: "cal-chinese",
    description: "Lunisolar calendar behind Lunar New Year and the 24 solar terms.",
    reach: "~1.4 billion people",
    type: "Lunisolar",
  },
  persian: {
    name: "Persian",
    token: "cal-persian",
    description: "Solar Hijri (Jalali), the official calendar of Iran and Afghanistan.",
    reach: "~110 million people",
    type: "Solar",
  },
  nepali: {
    name: "Nepali (Bikram Sambat)",
    token: "cal-nepali",
    description: "Nepal's official calendar, running roughly 56 to 57 years ahead of Gregorian.",
    reach: "~30 million people",
    type: "Lunisolar (solar months)",
  },
  hebrew: {
    name: "Hebrew",
    token: "cal-hebrew",
    description: "Jewish lunisolar calendar that sets Shabbat cycles and the festivals.",
    reach: "~15 million people",
    type: "Lunisolar",
  },
};

/* ---------- Persian (Jalali) ---------- */
// Public-domain algorithm by Kazimierz M. Borkowski.
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 + 365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd + g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

const PERSIAN_MONTHS = [
  "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
  "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand",
];

/* ---------- Hijri (Umm al-Qura arithmetic approximation) ---------- */
export function gregorianToHijri(gy: number, gm: number, gd: number): [number, number, number] {
  let jd: number;
  if (gy > 1582 || (gy === 1582 && gm > 10) || (gy === 1582 && gm === 10 && gd > 14)) {
    jd = Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
      Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
      Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
      gd - 32075;
  } else {
    jd = 367 * gy - Math.floor((7 * (gy + 5001 + Math.floor((gm - 9) / 7))) / 4) +
      Math.floor((275 * gm) / 9) + gd + 1729777;
  }
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return [hy, hm, hd];
}

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

/* ---------- Chinese lunisolar (uses the runtime's own calendar data) ---------- */
const ZODIAC = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

const CN_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function chineseDayNumeral(day: number): string {
  if (day === 10) return "初十";
  if (day === 20) return "二十";
  if (day === 30) return "三十";
  const tens = ["初", "十", "廿", "三"];
  return `${tens[Math.floor(day / 10)]}${CN_DIGITS[day % 10]}`;
}

const chineseFormat = new Intl.DateTimeFormat("zh-u-ca-chinese", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function chineseParts(date: Date) {
  const parts = chineseFormat.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const relatedYear = Number(get("relatedYear")) || date.getFullYear();
  const dayNumber = Number(get("day")) || date.getDate();
  return {
    ganZhi: get("yearName"),
    zodiac: ZODIAC[(((relatedYear - 4) % 12) + 12) % 12],
    month: get("month"),
    day: chineseDayNumeral(dayNumber),
    year: relatedYear,
  };
}

/* ---------- Hebrew (uses the runtime's own calendar data) ---------- */
const hebrewFormat = new Intl.DateTimeFormat("en-u-ca-hebrew", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function hebrewParts(date: Date) {
  const parts = hebrewFormat.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: Number(get("day")) || date.getDate(),
    month: get("month"),
    year: get("year").replace(/\D/g, ""),
  };
}

/* ---------- Nepali (Bikram Sambat) ---------- */
export const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

export function nepaliParts(date: Date) {
  const nd = new NepaliDate(date);
  return {
    year: nd.getYear(),
    month: nd.getMonth() + 1,
    day: nd.getDate(),
    native: nd.format("DD MMMM YYYY", "np") as string,
  };
}

/* ---------- Public formatters ---------- */
export function formatCalendar(system: CalendarSystem, date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  switch (system) {
    case "gregorian":
      return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    case "hijri": {
      const [hy, hm, hd] = gregorianToHijri(y, m, d);
      return `${hd} ${HIJRI_MONTHS[hm - 1]} ${hy} AH`;
    }
    case "hebrew": {
      const h = hebrewParts(date);
      return `${h.day} ${h.month} ${h.year}`;
    }
    case "chinese": {
      const c = chineseParts(date);
      return `${c.month}${c.day} · ${c.ganZhi} (Year of the ${c.zodiac})`;
    }
    case "persian": {
      const [jy, jm, jd] = gregorianToJalali(y, m, d);
      return `${jd} ${PERSIAN_MONTHS[jm - 1]} ${jy}`;
    }
    case "nepali": {
      const n = nepaliParts(date);
      return `${n.day} ${NEPALI_MONTHS[n.month - 1]} ${n.year} BS`;
    }
  }
}

// A second line in the calendar's own script, where one is worth showing.
export function nativeCalendarLabel(system: CalendarSystem, date: Date): string | null {
  if (system === "nepali") return nepaliParts(date).native;
  return null;
}

export function shortCalendarLabel(system: CalendarSystem, date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  switch (system) {
    case "gregorian":
      return `${d}`;
    case "hijri": {
      const [, hm, hd] = gregorianToHijri(y, m, d);
      return `${hd}·${hm}`;
    }
    case "hebrew": {
      const h = hebrewParts(date);
      return `${h.day} ${h.month.slice(0, 3)}`;
    }
    case "chinese":
      return chineseParts(date).day;
    case "persian": {
      const [, jm, jd] = gregorianToJalali(y, m, d);
      return `${jd}·${jm}`;
    }
    case "nepali": {
      const n = nepaliParts(date);
      return `${n.day}·${n.month}`;
    }
  }
}

export type Observance = { date: Date; label: string; note?: string };
