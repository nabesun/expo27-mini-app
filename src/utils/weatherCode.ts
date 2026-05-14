/**
 * WMO Weather Interpretation Code → 絵文字・テキスト変換
 * https://open-meteo.com/en/docs#weathervariables
 */

export interface WeatherInfo {
  emoji: string;
  label: string;
  needsUmbrella: boolean;
}

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0)            return { emoji: "☀️",  label: "快晴",         needsUmbrella: false };
  if (code <= 2)             return { emoji: "🌤️", label: "晴れ時々曇り", needsUmbrella: false };
  if (code === 3)            return { emoji: "☁️",  label: "曇り",          needsUmbrella: false };
  if (code <= 49)            return { emoji: "🌫️", label: "霧",            needsUmbrella: false };
  if (code <= 59)            return { emoji: "🌦️", label: "霧雨",          needsUmbrella: true  };
  if (code <= 67)            return { emoji: "🌧️", label: "雨",            needsUmbrella: true  };
  if (code <= 77)            return { emoji: "🌨️", label: "雪",            needsUmbrella: true  };
  if (code <= 82)            return { emoji: "🌦️", label: "にわか雨",      needsUmbrella: true  };
  if (code <= 86)            return { emoji: "🌨️", label: "にわか雪",      needsUmbrella: true  };
  if (code <= 99)            return { emoji: "⛈️", label: "雷雨",           needsUmbrella: true  };
  return { emoji: "🌡️", label: "不明", needsUmbrella: false };
}

/** 混雑レベル 1〜5 の色 */
export const CONGESTION_COLOR: Record<number, string> = {
  1: "#4ade80",
  2: "#a3e635",
  3: "#facc15",
  4: "#fb923c",
  5: "#ef4444",
};

/** 混雑レベル 1〜5 のラベル */
export const CONGESTION_LABEL: Record<number, string> = {
  1: "空いています",
  2: "やや空き",
  3: "普通",
  4: "やや混雑",
  5: "混雑",
};
