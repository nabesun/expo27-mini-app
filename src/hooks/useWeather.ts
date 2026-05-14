import { useState, useEffect, useCallback } from "react";
import { WEATHER_API, WEATHER_CACHE_TTL } from "../config";
import type { WeatherData, WeatherDaily } from "../types";

const CACHE_KEY = "weather_cache";

export function useWeather() {
  const [data, setData]   = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    // キャッシュ確認
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as WeatherData;
      if (Date.now() - parsed.fetchedAt < WEATHER_CACHE_TTL) {
        setData(parsed);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(WEATHER_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const daily: WeatherDaily[] = json.daily.time.map((date: string, i: number) => ({
        date,
        weathercode: json.daily.weathercode[i],
        tempMax: Math.round(json.daily.temperature_2m_max[i]),
        tempMin: Math.round(json.daily.temperature_2m_min[i]),
        precipitationSum: json.daily.precipitation_sum[i] ?? 0,
        // 各日の最大降水確率を hourly から取得
        precipitationProbability: (() => {
          const hourlyTimes: string[] = json.hourly.time;
          const probs: number[] = json.hourly.precipitation_probability;
          const dayProbs = hourlyTimes
            .map((t, hi) => ({ t, p: probs[hi] }))
            .filter(({ t }) => t.startsWith(date))
            .map(({ p }) => p ?? 0);
          return dayProbs.length ? Math.max(...dayProbs) : 0;
        })(),
      }));

      const result: WeatherData = { daily, fetchedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      setData(result);
    } catch (e) {
      setError((e as Error).message);
      // 古いキャッシュをフォールバック表示
      if (cached) setData(JSON.parse(cached) as WeatherData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather };
}
