import { getWeatherInfo } from "../utils/weatherCode";
import type { WeatherDaily } from "../types";

interface WeatherWidgetProps {
  today: WeatherDaily;
  compact?: boolean;
}

export function WeatherWidget({ today, compact = false }: WeatherWidgetProps) {
  const info = getWeatherInfo(today.weathercode);

  if (compact) {
    return (
      <div>
        <div style={{ fontSize: 10, color: "#2d7a4f", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
          今日の天気
        </div>
        <div style={{ fontSize: 36, textAlign: "center", margin: "4px 0" }}>{info.emoji}</div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1a4a2e" }}>{today.tempMax}°</span>
          <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>/ {today.tempMin}°</span>
        </div>
        <div style={{ fontSize: 11, color: "#2d7a4f", textAlign: "center", marginTop: 4 }}>
          {info.needsUmbrella ? "☂️ 傘を持って！" : "傘なくてOK ☀️"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>{info.emoji}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a2e1a" }}>{info.label}</div>
        <div>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{today.tempMax}°</span>
          <span style={{ fontSize: 14, color: "#6b7280", margin: "0 4px" }}>/</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#3b82f6" }}>{today.tempMin}°</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
          💧 降水確率 {today.precipitationProbability}%
          {info.needsUmbrella && <span style={{ color: "#ef4444", marginLeft: 8 }}>☂️ 傘を持って！</span>}
        </div>
      </div>
    </div>
  );
}
