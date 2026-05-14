import { useState } from "react";
import { useMtJson } from "../hooks/useMtJson";
import { API } from "../config";
import type { FlowerItem } from "../types";
import { getBloomStatus, getFlowersByMonth, BLOOM_BADGE } from "../utils/bloomCalc";
import { todayJST } from "../utils/dateJST";
import { FlowerCard } from "../components/FlowerCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { OfflineBanner } from "../components/OfflineBanner";

const MONTHS = [3, 4, 5, 6, 7, 8, 9];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#2d7a4f", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Header() {
  return (
    <div style={{ padding: "12px 20px 16px", background: "linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)" }}>
      <div style={{ fontSize: 13, color: "#a8d5b5", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Flower Season Guide
      </div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginTop: 2 }}>見頃の花カレンダー</div>
    </div>
  );
}

export function Flowers() {
  const today = todayJST(); // JST固定
  const [activeMonth, setActiveMonth] = useState<number>(today.getMonth() + 1 < 3 ? 3 : Math.min(today.getMonth() + 1, 9));

  const { data: flowers, status, lastFetchedAt } = useMtJson<FlowerItem[]>(API.flowers, "flowers");

  const monthFlowerIds = getFlowersByMonth(activeMonth);
  const monthFlowers   = flowers?.filter((f) => monthFlowerIds.includes(f.id)) ?? [];

  return (
    <div style={{ paddingBottom: 16 }}>
      <Header />
      {status === "fallback" && <OfflineBanner lastFetchedAt={lastFetchedAt} />}

      <div style={{ padding: "16px" }}>

        {/* 月別タブ */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", marginBottom: 14 }}>
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 700, minHeight: 36,
                background: activeMonth === m ? "#2d7a4f" : "#fff",
                color: activeMonth === m ? "#fff" : "#6b7280",
                boxShadow: activeMonth === m
                  ? "0 2px 8px rgba(45,122,79,.3)"
                  : "0 1px 4px rgba(0,0,0,.08)",
              }}
            >
              {m}月
            </button>
          ))}
        </div>

        {/* 今月の花 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: "#2d7a4f" }}>{activeMonth}月</span> の見頃
          </div>

          {status === "loading" && <SkeletonCard lines={3} height={100} />}
          {status === "error" && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 13 }}>情報を取得できません。接続を確認してください。</div>
            </div>
          )}

          {flowers && monthFlowers.length > 0 && monthFlowers.map((f) => (
            <FlowerCard key={f.id} flower={f} status={getBloomStatus(today, f)} />
          ))}

          {flowers && monthFlowers.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 32 }}>🌿</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>この月の特集花はありません</div>
            </div>
          )}
        </div>

        {/* 全シーズン一覧 */}
        {flowers && (
          <>
            <SectionLabel>🌸 全シーズンの花</SectionLabel>
            {flowers.map((f) => {
              const status = getBloomStatus(today, f);
              const badge  = BLOOM_BADGE[status];
              return (
                <div key={f.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid #f3f4f6",
                }}>
                  <div style={{ fontSize: 26 }}>{f.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a2e1a" }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {f.bloomStart.replace("-","/")}〜{f.bloomEnd.replace("-","/")} · {f.location.split(" ")[0]}
                    </div>
                  </div>
                  <div style={{
                    padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: badge.bg, color: badge.text, whiteSpace: "nowrap",
                  }}>
                    {badge.emoji} {badge.label}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
