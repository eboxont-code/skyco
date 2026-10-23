// Festival and holiday data for each calendar system.
// This module pulls in the heavier calendar libraries, so it is loaded on
// demand (see the dynamic import in the calendar cards) rather than on first
// paint.

import { HDate, HebrewCalendar } from "@hebcal/core";
import { Solar } from "lunar-javascript";

import {
  gregorianToHijri,
  gregorianToJalali,
  nepaliParts,
  NEPALI_MONTHS,
  type CalendarSystem,
  type Observance,
} from "./calendars";

export type { Observance };

function eachDayOfMonth(anchor: Date): Date[] {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const last = new Date(y, m + 1, 0).getDate();
  return Array.from({ length: last }, (_, i) => new Date(y, m, i + 1));
}

const GREGORIAN_FIXED: Record<string, string> = {
  "1-1": "New Year's Day",
  "2-14": "Valentine's Day",
  "3-8": "International Women's Day",
  "4-22": "Earth Day",
  "5-1": "International Workers' Day",
  "6-21": "June solstice (approx.)",
  "9-21": "International Day of Peace",
  "10-24": "United Nations Day",
  "12-21": "December solstice (approx.)",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

const HIJRI_FIXED: Record<string, string> = {
  "1-1": "Islamic New Year",
  "1-10": "Ashura",
  "3-12": "Mawlid al-Nabi",
  "7-27": "Isra and Mi'raj",
  "8-15": "Mid-Sha'ban",
  "9-1": "First of Ramadan",
  "9-27": "Laylat al-Qadr (commonly observed)",
  "10-1": "Eid al-Fitr",
  "12-9": "Day of Arafah",
  "12-10": "Eid al-Adha",
};

const PERSIAN_FIXED: Record<string, string> = {
  "1-1": "Nowruz, Persian New Year",
  "1-2": "Nowruz holiday",
  "1-13": "Sizdah Bedar",
  "7-16": "Mehregan",
  "10-1": "Start of winter (Dey)",
  "12-29": "Eve of the new year",
};

const NEPALI_FIXED: Record<string, string> = {
  "1-1": "Nepali New Year (Bikram Sambat)",
  "10-1": "Maghe Sankranti",
  "11-7": "Prajatantra Diwas (Democracy Day)",
  "6-3": "Constitution Day",
  "2-15": "Republic Day",
};

// Nepali festivals that follow the lunar month: BS month, paksha and tithi.
const NEPALI_LUNAR: { month: number; paksha: "shukla" | "krishna"; tithi: number; label: string }[] = [
  { month: 1, paksha: "shukla", tithi: 15, label: "Buddha Jayanti" },
  { month: 4, paksha: "shukla", tithi: 15, label: "Janai Purnima / Rakshya Bandhan" },
  { month: 5, paksha: "krishna", tithi: 8, label: "Krishna Janmashtami" },
  { month: 5, paksha: "shukla", tithi: 3, label: "Haritalika Teej" },
  { month: 6, paksha: "shukla", tithi: 1, label: "Ghatasthapana, Dashain begins" },
  { month: 6, paksha: "shukla", tithi: 7, label: "Fulpati" },
  { month: 6, paksha: "shukla", tithi: 10, label: "Vijaya Dashami" },
  { month: 6, paksha: "shukla", tithi: 15, label: "Kojagrat Purnima, Dashain ends" },
  { month: 7, paksha: "krishna", tithi: 13, label: "Kag Tihar, Tihar begins" },
  { month: 7, paksha: "krishna", tithi: 15, label: "Laxmi Puja" },
  { month: 7, paksha: "shukla", tithi: 2, label: "Bhai Tika" },
  { month: 7, paksha: "shukla", tithi: 6, label: "Chhath Parva" },
  { month: 11, paksha: "krishna", tithi: 14, label: "Maha Shivaratri" },
  { month: 11, paksha: "shukla", tithi: 15, label: "Holi (Fagu Purnima)" },
  { month: 12, paksha: "shukla", tithi: 9, label: "Ram Navami" },
];

/* ---------- Hindu lunar day (tithi) ---------- */
// Low-precision solar/lunar longitudes (Meeus). Accurate to about a tenth of a
// degree, which is plenty for naming the tithi that runs at sunrise.
const RAD = Math.PI / 180;

function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function solarLongitude(jd: number): number {
  const t = (jd - 2451545) / 36525;
  const l0 = 280.46646 + 36000.76983 * t;
  const m = (357.52911 + 35999.05029 * t) * RAD;
  const c =
    (1.914602 - 0.004817 * t) * Math.sin(m) +
    0.019993 * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m);
  return (((l0 + c) % 360) + 360) % 360;
}

function lunarLongitude(jd: number): number {
  const d = jd - 2451545;
  const lp = 218.316 + 13.176396 * d;
  const m = (134.963 + 13.064993 * d) * RAD;
  const ms = (357.529 + 0.98560028 * d) * RAD;
  const dd = (297.85 + 12.190749 * d) * RAD;
  const f = (93.272 + 13.2293505 * d) * RAD;
  const lon =
    lp +
    6.289 * Math.sin(m) +
    1.274 * Math.sin(2 * dd - m) +
    0.658 * Math.sin(2 * dd) +
    0.214 * Math.sin(2 * m) -
    0.186 * Math.sin(ms) -
    0.114 * Math.sin(2 * f);
  return ((lon % 360) + 360) % 360;
}

function elongationAtSunrise(day: Date): number {
  // Sunrise in Nepal is roughly 06:00 NPT = 00:15 UTC.
  const jd = julianDay(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), 0, 15)));
  return ((lunarLongitude(jd) - solarLongitude(jd)) % 360 + 360) % 360;
}

export function tithiAtSunrise(day: Date): { paksha: "shukla" | "krishna"; tithi: number } {
  const index = Math.floor(elongationAtSunrise(day) / 12); // 0..29
  return index < 15
    ? { paksha: "shukla", tithi: index + 1 }
    : { paksha: "krishna", tithi: index - 14 };
}

// The lunar month a day belongs to: bright half looks back to the new moon it
// started from, dark half looks forward to the new moon it ends on.
function lunarMonthBs(day: Date, paksha: "shukla" | "krishna"): number | null {
  const step = paksha === "shukla" ? -1 : 1;
  const probe = new Date(day);
  for (let i = 0; i < 32; i++) {
    if (elongationAtSunrise(probe) < 12) return nepaliParts(probe).month;
    probe.setDate(probe.getDate() + step);
  }
  return null;
}

export function observancesForMonth(system: CalendarSystem, anchor: Date): Observance[] {
  const days = eachDayOfMonth(anchor);
  const out: Observance[] = [];

  if (system === "hebrew") {
    const events = HebrewCalendar.calendar({
      start: new HDate(days[0]),
      end: new HDate(days[days.length - 1]),
      candlelighting: false,
      sedrot: false,
    });
    for (const ev of events) {
      out.push({ date: ev.getDate().greg(), label: ev.render("en") });
    }
    return out;
  }

  for (const day of days) {
    const y = day.getFullYear();
    const m = day.getMonth() + 1;
    const d = day.getDate();

    if (system === "gregorian") {
      const label = GREGORIAN_FIXED[`${m}-${d}`];
      if (label) out.push({ date: day, label });
    } else if (system === "hijri") {
      const [, hm, hd] = gregorianToHijri(y, m, d);
      const label = HIJRI_FIXED[`${hm}-${hd}`];
      if (label) out.push({ date: day, label, note: "Local moon sighting may shift this by a day." });
    } else if (system === "persian") {
      const [, jm, jd] = gregorianToJalali(y, m, d);
      const label = PERSIAN_FIXED[`${jm}-${jd}`];
      if (label) out.push({ date: day, label });
    } else if (system === "nepali") {
      const n = nepaliParts(day);
      const label = NEPALI_FIXED[`${n.month}-${n.day}`];
      if (label) out.push({ date: day, label });
      else if (n.day === 1) {
        out.push({ date: day, label: `Sankranti, first of ${NEPALI_MONTHS[n.month - 1]}` });
      }

      const { paksha, tithi } = tithiAtSunrise(day);
      const lunarMonth = lunarMonthBs(day, paksha);
      for (const f of NEPALI_LUNAR) {
        if (f.paksha !== paksha || f.tithi !== tithi) continue;
        if (f.month !== lunarMonth) continue;
        if (out.some((o) => o.label === f.label)) continue;
        out.push({
          date: day,
          label: f.label,
          note: "Set by the lunar day at sunrise; local panchang can differ by a day.",
        });
      }
    } else if (system === "chinese") {
      const lunar = Solar.fromDate(day).getLunar();
      for (const f of lunar.getFestivals() as string[]) out.push({ date: day, label: f });
      const jieQi = lunar.getJieQi() as string;
      if (jieQi) out.push({ date: day, label: `Solar term: ${jieQi}` });
    }
  }
  return out;
}
