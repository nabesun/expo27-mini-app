import type { CongestionData } from "../types";
import { CONGESTION_COLOR } from "../utils/weatherCode";

interface CongestionBarProps {
  data: CongestionData;
  compact?: boolean;
}

export function CongestionBar({ data, compact = false }: CongestionBarProps) {
  // 北ゲートや空いているゲートのアドバイスを自動生成
  const bestGate = Object.entries(data.gates).reduce((best, [name, gate]) =>
    gate.level < best.level ? { name, ...gate } : best,
    { name: "", level: 5 as 1|2|3|4|5, label: "", waitMinutes: 99 }
  );

  if (compact) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#92400e" }}>
          {data.overallLabel}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "8px 0" }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: 4,
              background: i <= data.overall ? CONGESTION_COLOR[data.overall] : "#e5e7eb",
            }} />
          ))}
        </div>
        {bestGate.name && (
          <div style={{ fontSize: 11, color: "#92400e", textAlign: "center" }}>
            {bestGate.name}が空き ✅
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {Object.entries(data.gates).map(([name, gate]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a", width: 100, flexShrink: 0 }}>
            {name}
          </div>
          <div style={{ flex: 1, height: 8, borderRadius: 8, background: "#f3f4f6", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${gate.level * 20}%`,
              borderRadius: 8, background: CONGESTION_COLOR[gate.level],
              transition: "width .3s",
            }} />
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
            約{gate.waitMinutes}分待ち
          </div>
        </div>
      ))}
    </div>
  );
}
