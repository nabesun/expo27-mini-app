import type { FlowerItem } from "../types";
import { EXPO_START, EXPO_END } from "../config";

export type BloomStatus = "peak" | "blooming" | "upcoming" | "ended" | "not_open";

/**
 * 今日の日付と flower の開花情報から見頃ステータスを返す。
 */
export function getBloomStatus(
  today: Date,
  flower: Pick<FlowerItem, "bloomStart" | "bloomEnd" | "peakStart" | "peakEnd">
): BloomStatus {
  if (today < EXPO_START) return "not_open";
  if (today > EXPO_END) return "ended";

  const year = today.getFullYear();
  const toDate = (mmdd: string) => new Date(`${year}-${mmdd}`);

  const bloomStart = toDate(flower.bloomStart);
  const bloomEnd   = toDate(flower.bloomEnd);
  const peakStart  = toDate(flower.peakStart);
  const peakEnd    = toDate(flower.peakEnd);

  if (today >= peakStart  && today <= peakEnd)  return "peak";
  if (today >= bloomStart && today <= bloomEnd)  return "blooming";
  if (today < bloomStart) {
    const daysUntil = (bloomStart.getTime() - today.getTime()) / 86400000;
    if (daysUntil <= 14) return "upcoming";
  }
  return "ended";
}

export const BLOOM_BADGE: Record<BloomStatus, {
  label: string;
  bg: string;
  text: string;
  emoji: string;
}> = {
  peak:     { label: "見頃中",   bg: "#22c55e", text: "#fff",     emoji: "🌸" },
  blooming: { label: "開花中",   bg: "#84cc16", text: "#fff",     emoji: "🌿" },
  upcoming: { label: "まもなく", bg: "#eab308", text: "#fff",     emoji: "🌱" },
  ended:    { label: "終了",     bg: "#d1d5db", text: "#6b7280",  emoji: "🍂" },
  not_open: { label: "開幕前",   bg: "#bfdbfe", text: "#1e40af",  emoji: "📅" },
};

/** 月（1-indexed）からその月に見頃を迎える花IDリストを返す */
export function getFlowersByMonth(month: number): string[] {
  const map: Record<number, string[]> = {
    3: ["tulip"],
    4: ["tulip"],
    5: ["rose"],
    6: ["rose", "hydrangea"],
    7: ["hydrangea", "sunflower"],
    8: ["sunflower"],
    9: ["cosmos"],
  };
  return map[month] ?? [];
}
