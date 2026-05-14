import { Suspense, lazy } from "react";
import { useMtJson } from "../hooks/useMtJson";
import { useWeather } from "../hooks/useWeather";
import { API } from "../config";
import type { CongestionData } from "../types";
import { getWeatherInfo, CONGESTION_COLOR } from "../utils/weatherCode";
import { CongestionBar } from "../components/CongestionBar";
import { SkeletonCard } from "../components/SkeletonCard";
import { OfflineBanner } from "../components/OfflineBanner";

// recharts を動的インポート（初期バンドルから除外）
const CongestionChart = lazy(() => import("../components/CongestionChart"));

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#2d7a4f", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(45,122,79,.08)", ...style }}>
      {children}
    </div>
  );
}

function Header() {
  return (
    <div style={{ padding: "12px 20px 16px", background: "linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)" }}>
      <div style={{ fontSize: 13, color: "#a8d5b5", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Weather &amp; Congestion
      </div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginTop: 2 }}>天気・混雑情報</div>
    </div>
  );
}

const DAY_LABELS = ["今日", "明日", "明後日"];

export function Weather() {
  const { data: weather, loading, error: weatherError } = useWeather();
  const { data: congestion, status: congStatus, lastFetchedAt: congAt } = useMtJson<CongestionData>(API.congestion, "congestion");

  // 空き時間アドバイス生成
  const adviceTimes = congestion?.forecast
    .filter((f) => f.level <= 2)
    .map((f) => f.time) ?? [];

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      {congStatus === "fallback" && <OfflineBanner lastFetchedAt={congAt} />}

      <div style={{ padding: "16px" }}>

        {/* 3日間予報 */}
        <Card style={{ marginBottom: 14 }}>
          <SectionLabel>📅 3日間の天気予報</SectionLabel>
          {loading && <SkeletonCard lines={2} height={120} />}
          {weatherError && !weather && (
            <div style={{ textAlign: "center", padding: "16px 0", color: "#9ca3af", fontSize: 12 }}>
              天気情報を取得できませんでした
            </div>
          )}
          {weather && (
            <div style={{ display: "flex", gap: 0 }}>
              {weather.daily.map((d, i) => {
                const info = getWeatherInfo(d.weathercode);
                const dateObj = new Date(d.date);
                return (
                  <div key={d.date} style={{
                    flex: 1, textAlign: "center", padding: "8px 4px",
                    borderRight: i < weather.daily.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2d7a4f" }}>{DAY_LABELS[i] ?? d.date}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 6 }}>
                      {(dateObj.getMonth() + 1)}/{dateObj.getDate()}({["日","月","火","水","木","金","土"][dateObj.getDay()]})
                    </div>
                    <div style={{ fontSize: 30 }}>{info.emoji}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>{d.tempMax}°</span>
                      <span style={{ fontSize: 11, color: "#6b7280", margin: "0 2px" }}>/</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>{d.tempMin}°</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#3b82f6", marginTop: 4 }}>
                      💧 {d.precipitationProbability}%
                    </div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, lineHeight: 1.3 }}>
                      {info.label}
                      {info.needsUmbrella && <div>☂️ 傘必須</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* 混雑予測グラフ（recharts lazy load） */}
        {congestion && (
          <Card style={{ marginBottom: 14 }}>
            <SectionLabel>👥 本日の混雑予測（時間別）</SectionLabel>
            <Suspense fallback={
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60, marginBottom: 4 }}>
                {congestion.forecast.map((f, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: CONGESTION_COLOR[f.level], height: f.level * 11 + 4 }} />
                    <div style={{ fontSize: 9, color: "#6b7280" }}>{f.time.replace(":00","")}</div>
                  </div>
                ))}
              </div>
            }>
              <CongestionChart forecast={congestion.forecast} />
            </Suspense>
            {adviceTimes.length > 0 && (
              <div style={{ marginTop: 8, padding: "10px 12px", background: "#f0fdf4", borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>💡 おすすめ来場時間</div>
                <div style={{ fontSize: 12, color: "#166534", marginTop: 4 }}>
                  {adviceTimes.slice(0, 3).join("・")}台が比較的空いています。
                  {congestion.forecast.some(f => f.level >= 4) && "ランチタイムは混雑が予想されます。"}
                </div>
              </div>
            )}
            {congestion.isMock && (
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 8 }}>※参考値（リアルタイムデータではありません）</div>
            )}
          </Card>
        )}

        {/* ゲート別混雑 */}
        {congestion && (
          <Card style={{ marginBottom: 14 }}>
            <SectionLabel>🚪 ゲート別 入場待ち</SectionLabel>
            <CongestionBar data={congestion} />
            {congestion.isMock && (
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>※参考値。リアルタイムではありません</div>
            )}
          </Card>
        )}

        {/* ホットスポット */}
        {congestion && congestion.hotspots.length > 0 && (
          <Card style={{ marginBottom: 14 }}>
            <SectionLabel>📍 エリア別混雑状況</SectionLabel>
            {congestion.hotspots.map((spot) => (
              <div key={spot.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: CONGESTION_COLOR[spot.level], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, color: "#1a2e1a", fontWeight: 600 }}>{spot.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{spot.label}</div>
              </div>
            ))}
          </Card>
        )}

        {/* 雨の日コンテンツ */}
        <Card style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)" }}>
          <SectionLabel>☂️ 雨の日はここへ</SectionLabel>
          {["テーマ館「未来の庭」", "園芸文化館", "日本政府苑 屋内展示"].map((name, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2d7a4f", flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: "#1a2e1a" }}>{name}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
