import { useNavigate } from "react-router-dom";
import { useMtJson } from "../hooks/useMtJson";
import { useWeather } from "../hooks/useWeather";
import { API, EXPO_START, EXPO_END, EXPO_TOTAL_DAYS } from "../config";
import type { NewsItem, FlowerItem, CongestionData } from "../types";
import { getBloomStatus, BLOOM_BADGE } from "../utils/bloomCalc";
import { CONGESTION_COLOR } from "../utils/weatherCode";
import { todayJST } from "../utils/dateJST";
import { WeatherWidget } from "../components/WeatherWidget";
import { CongestionBar } from "../components/CongestionBar";
import { SkeletonCard } from "../components/SkeletonCard";
import { OfflineBanner } from "../components/OfflineBanner";

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

export function Home() {
  const navigate = useNavigate();
  const today = todayJST(); // JST固定（システムTZに依存しない）

  // 開催状況バナー計算
  const daysUntil = Math.ceil((EXPO_START.getTime() - today.getTime()) / 86400000);
  const dayNum    = Math.ceil((today.getTime() - EXPO_START.getTime()) / 86400000);
  const isOpen    = today >= EXPO_START && today <= EXPO_END;
  const isEnded   = today > EXPO_END;

  // データ取得
  const { data: news, status: newsStatus, lastFetchedAt: newsAt } = useMtJson<NewsItem[]>(API.news, "news");
  const { data: flowers } = useMtJson<FlowerItem[]>(API.flowers, "flowers");
  const { data: congestion, status: congStatus, lastFetchedAt: congAt } = useMtJson<CongestionData>(API.congestion, "congestion");
  const { data: weather } = useWeather();

  // 今が見頃・まもなくの花
  const bloomFlowers = flowers
    ? flowers
        .map((f) => ({ ...f, status: getBloomStatus(today, f) }))
        .filter((f) => f.status === "peak" || f.status === "blooming" || f.status === "upcoming")
        .slice(0, 5)
    : [];

  const todayWeather = weather?.daily[0];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* フォールバックバナー */}
      {newsStatus === "fallback" && <OfflineBanner lastFetchedAt={newsAt} />}
      {congStatus === "fallback" && <OfflineBanner lastFetchedAt={congAt} />}

      {/* ヒーローヘッダー */}
      <div style={{
        background: "linear-gradient(160deg, #1a4a2e 0%, #2d7a4f 60%, #4a9e6d 100%)",
        padding: "16px 20px 28px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -20, top: -10, fontSize: 80, opacity: .08, transform: "rotate(20deg)" }}>🌿</div>
        <div style={{ position: "absolute", right: 40, bottom: -15, fontSize: 60, opacity: .06, transform: "rotate(-15deg)" }}>🌸</div>

        <div style={{ fontSize: 11, color: "#86d4a3", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>
          GREEN×EXPO 2027
        </div>
        <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginBottom: 2 }}>
          {isEnded
            ? "ありがとうございました 🌿"
            : isOpen
              ? `開催中 🌿 Day ${dayNum} / ${EXPO_TOTAL_DAYS}`
              : `開幕まであと ${daysUntil} 日`}
        </div>
        <div style={{ fontSize: 12, color: "#a8d5b5" }}>
          {today.getFullYear()}.{String(today.getMonth() + 1).padStart(2, "0")}.{String(today.getDate()).padStart(2, "0")}{" "}
          {["日","月","火","水","木","金","土"][today.getDay()]}曜日
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -12 }}>

        {/* 天気 + 混雑 カード */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {/* 天気 */}
          <Card style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)" }}>
            {todayWeather ? (
              <WeatherWidget today={todayWeather} compact />
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0", color: "#9ca3af", fontSize: 12 }}>
                取得中...
              </div>
            )}
          </Card>

          {/* 混雑 */}
          <Card style={{ background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)" }}>
            <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
              現在の混雑
            </div>
            {congestion ? (
              <CongestionBar data={congestion} compact />
            ) : (
              <div style={{ textAlign: "center", padding: "8px 0", color: "#9ca3af", fontSize: 12 }}>取得中...</div>
            )}
            {congestion?.isMock && (
              <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", marginTop: 4 }}>※参考値</div>
            )}
          </Card>
        </div>

        {/* 今が見頃の花 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <SectionLabel>🌸 今が見頃の花</SectionLabel>
            <button onClick={() => navigate("/flowers")} style={{ fontSize: 11, color: "#2d7a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              すべて見る →
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {bloomFlowers.length > 0 ? bloomFlowers.map((f) => {
              const badge = BLOOM_BADGE[f.status];
              return (
                <div key={f.id} style={{ minWidth: 120, background: "#fff", borderRadius: 14, padding: "12px 10px", boxShadow: "0 2px 8px rgba(45,122,79,.1)", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 32 }}>{f.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a", marginTop: 4 }}>{f.name}</div>
                  <div style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.text }}>
                    {badge.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, lineHeight: 1.3 }}>
                    {f.location.split(" ")[0]}
                  </div>
                </div>
              );
            }) : (
              // スケルトン or 空状態
              flowers === null
                ? [1,2,3].map(i => <div key={i} style={{ minWidth: 120, height: 120, background: "#f3f4f6", borderRadius: 14, flexShrink: 0, animation: "pulse 1.4s infinite" }} />)
                : <div style={{ color: "#9ca3af", fontSize: 12, padding: "16px 0" }}>現在見頃の花はありません</div>
            )}
          </div>
        </div>

        {/* 混雑予測バー */}
        {congestion && (
          <Card style={{ marginBottom: 14 }}>
            <SectionLabel>⏰ 本日の混雑予測</SectionLabel>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
              {congestion.forecast.map((f, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", borderRadius: 4, background: CONGESTION_COLOR[f.level], height: f.level * 7 + 5 }} />
                  {i % 2 === 0 && <div style={{ fontSize: 9, color: "#6b7280", whiteSpace: "nowrap" }}>{f.time.replace(":00","")}</div>}
                </div>
              ))}
            </div>
            {(() => {
              const low = congestion.forecast.filter(f => f.level <= 2).map(f => f.time);
              return low.length > 0 && (
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>
                  💡 {low.slice(0, 2).join("・")}台が比較的空いています
                </div>
              );
            })()}
          </Card>
        )}

        {/* 最新ニュース */}
        <Card style={{ marginBottom: 14 }}>
          <SectionLabel>📢 最新ニュース</SectionLabel>
          {newsStatus === "loading" && <SkeletonCard lines={3} height={100} />}
          {newsStatus === "error" && (
            <div style={{ textAlign: "center", padding: "16px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 12 }}>情報を取得できません。接続を確認してください。</div>
            </div>
          )}
          {news && news.slice(0, 2).map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div style={{ height: 1, background: "#f3f4f6", margin: "10px 0" }} />}
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 6, whiteSpace: "nowrap",
                  background: item.category === "イベント" ? "#d1fae5" : "#e0f2fe",
                  color: item.category === "イベント" ? "#065f46" : "#0369a1",
                  fontWeight: 600, flexShrink: 0, marginTop: 2,
                }}>
                  {item.category}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a", lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    {new Date(item.publishedAt).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Card>

        {/* クイックリンク */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "☀️", label: "天気・混雑詳細", path: "/weather",    bg: "#e0f2fe" },
            { icon: "🗺️", label: "おすすめコース",  path: "/courses",    bg: "#dcfce7" },
            { icon: "🍽️", label: "施設・飲食情報",  path: "/facilities", bg: "#fef3c7" },
            { icon: "📓", label: "植物記録帳",       path: "/notebook",   bg: "#fae8ff" },
          ].map((q) => (
            <button
              key={q.path}
              onClick={() => navigate(q.path)}
              style={{
                background: q.bg, border: "none", borderRadius: 14,
                padding: "14px 12px", textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, minHeight: 56,
              }}
            >
              <span style={{ fontSize: 24 }}>{q.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a", lineHeight: 1.3 }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
