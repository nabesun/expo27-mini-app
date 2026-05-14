/**
 * MT が出力した静的 JSON を取得する汎用フック。
 * - キャッシュ: localStorage にタイムスタンプ付きで保存
 * - フォールバック: 取得失敗時は localStorage の古いデータを返す
 */
import { useState, useEffect, useCallback } from "react";
import { MT_JSON_CACHE_TTL } from "../config";
import type { FetchStatus, UseFetchResult } from "../types";

export function useMtJson<T>(url: string, cacheKey: string): UseFetchResult<T> {
  const [data, setData]               = useState<T | null>(null);
  const [status, setStatus]           = useState<FetchStatus>("idle");
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    const storageKey = `mt_cache_${cacheKey}`;
    const cached = localStorage.getItem(storageKey);

    // キャッシュが新鮮なら再フェッチしない
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached) as {
        data: T; timestamp: number;
      };
      if (Date.now() - timestamp < MT_JSON_CACHE_TTL) {
        setData(cachedData);
        setStatus("success");
        setLastFetchedAt(new Date(timestamp));
        return;
      }
    }

    setStatus("loading");

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: T = await res.json();

      localStorage.setItem(storageKey, JSON.stringify({
        data: json,
        timestamp: Date.now(),
      }));

      setData(json);
      setStatus("success");
      setLastFetchedAt(new Date());
    } catch {
      // フォールバック: 古いキャッシュがあればそれを返す
      if (cached) {
        const { data: staleData, timestamp } = JSON.parse(cached) as {
          data: T; timestamp: number;
        };
        setData(staleData);
        setStatus("fallback");
        setLastFetchedAt(new Date(timestamp));
      } else {
        setStatus("error");
      }
    }
  }, [url, cacheKey]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, status, lastFetchedAt, refetch: fetchData };
}
