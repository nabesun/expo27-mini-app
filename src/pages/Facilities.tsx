import { useState } from "react";
import { useMtJson } from "../hooks/useMtJson";
import { API } from "../config";
import type { FacilitiesData, FacilityItem } from "../types";
import { SkeletonCard } from "../components/SkeletonCard";
import { OfflineBanner } from "../components/OfflineBanner";

const TABS = [
  { id: "food",      label: "🍽️ 飲食",       dataKey: "food" },
  { id: "toilet",    label: "🚻 トイレ",       dataKey: "facilities" },
  { id: "rest",      label: "♿ 休憩・充電",    dataKey: "facilities" },
  { id: "firstaid",  label: "🚑 救護",          dataKey: "firstaid" },
];

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
        Facilities Guide
      </div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginTop: 2 }}>施設・飲食情報</div>
    </div>
  );
}

function FacilityCard({ item }: { item: FacilityItem }) {
  return (
    <Card style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e1a" }}>{item.name}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>📍 {item.area}</div>
          {item.openHours  && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>🕐 {item.openHours}</div>}
          {item.priceRange && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>💴 {item.priceRange}</div>}
          {item.note && (
            <div style={{ fontSize: 12, color: "#2d7a4f", marginTop: 6, padding: "4px 8px", background: "#f0fdf4", borderRadius: 6 }}>
              📝 {item.note}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 8 }}>
          {item.accessible     && <span title="バリアフリー対応" style={{ fontSize: 20 }}>♿</span>}
          {item.babyroom       && <span title="ベビールームあり"  style={{ fontSize: 20 }}>🍼</span>}
          {item.vegetarianMenu && <span title="ベジタリアンメニューあり" style={{ fontSize: 18 }}>🌱</span>}
        </div>
      </div>
    </Card>
  );
}

export function Facilities() {
  const [activeTab, setActiveTab] = useState("food");
  const { data, status, lastFetchedAt } = useMtJson<FacilitiesData>(API.facilities, "facilities");

  // タブに対応するアイテムを抽出
  const getItems = (): FacilityItem[] => {
    if (!data) return [];
    if (activeTab === "food")     return data.food;
    if (activeTab === "firstaid") return data.firstaid;
    // toilet / rest は facilities 配列から type で絞り込む
    if (activeTab === "toilet")   return data.facilities.filter((f) => f.type === "toilet");
    if (activeTab === "rest")     return data.facilities.filter((f) => f.type === "rest");
    return [];
  };

  const items = getItems();

  return (
    <div style={{ paddingBottom: 16 }}>
      <Header />
      {status === "fallback" && <OfflineBanner lastFetchedAt={lastFetchedAt} />}

      <div style={{ padding: "0 16px" }}>
        {/* タブ */}
        <div style={{ display: "flex", gap: 0, marginTop: 14, marginBottom: 14, background: "#f3f4f6", borderRadius: 12, padding: 4 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: "8px 2px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, minHeight: 36,
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#2d7a4f" : "#9ca3af",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,.1)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status === "loading" && [1,2].map(i => <SkeletonCard key={i} lines={3} height={110} />)}
        {status === "error" && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 13 }}>情報を取得できません。接続を確認してください。</div>
          </div>
        )}

        {items.map((item) => <FacilityCard key={item.id} item={item} />)}

        {data && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 32 }}>🏢</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>このカテゴリの施設情報はありません</div>
          </div>
        )}

        {/* 凡例 */}
        <div style={{ padding: "12px 0 4px", display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[["♿","バリアフリー対応"], ["🍼","ベビールーム"], ["🌱","ベジメニュー"]].map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
