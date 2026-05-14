/**
 * MT が出力する静的 JSON の URL を管理する。
 *
 * 開発時  : VITE_API_BASE_URL 未設定 → /mock/ 以下のローカルモックを使用
 * 本番時  : VITE_API_BASE_URL=https://expo2027yokohama.or.jp/api を .env に設定
 *
 * Cloudflare 側で /api/*.json に Access-Control-Allow-Origin: * を付与すること。
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/mock";

export const API = {
  news:       `${BASE}/news.json`,
  events:     `${BASE}/events.json`,
  flowers:    `${BASE}/flowers.json`,
  facilities: `${BASE}/facilities.json`,
  courses:    `${BASE}/courses.json`,
  congestion: `${BASE}/congestion.json`,
} as const;

export const WEATHER_API =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=35.3996" +
  "&longitude=139.4897" +
  "&hourly=temperature_2m,precipitation_probability,weathercode" +
  "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum" +
  "&timezone=Asia%2FTokyo" +
  "&forecast_days=3";

/** 天気データのキャッシュ時間（ミリ秒） */
export const WEATHER_CACHE_TTL = 30 * 60 * 1000; // 30分

/** MT JSON のキャッシュ時間（ミリ秒） */
export const MT_JSON_CACHE_TTL = 5 * 60 * 1000; // 5分

/** 博覧会会期 */
export const EXPO_START = new Date("2027-03-19");
export const EXPO_END   = new Date("2027-09-26");
export const EXPO_TOTAL_DAYS = 192;
