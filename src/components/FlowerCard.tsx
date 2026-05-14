import { useState } from "react";
import type { FlowerItem } from "../types";
import { BLOOM_BADGE, getBloomStatus, type BloomStatus } from "../utils/bloomCalc";

interface FlowerCardProps {
  flower: FlowerItem;
  status?: BloomStatus;
  compact?: boolean;
}

export function FlowerCard({ flower, status, compact = false }: FlowerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const bloomStatus = status ?? getBloomStatus(new Date(), flower);
  const badge = BLOOM_BADGE[bloomStatus];

  if (compact) {
    return (
      <div style={{
        minWidth: 120, background: "#fff", borderRadius: 14, padding: "12px 10px",
        boxShadow: "0 2px 8px rgba(45,122,79,.1)", textAlign: "center", flexShrink: 0,
      }}>
        <div style={{ fontSize: 32 }}>{flower.emoji}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a", marginTop: 4 }}>{flower.name}</div>
        <div style={{
          display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 20,
          fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.text,
        }}>
          {badge.label}
        </div>
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, lineHeight: 1.3 }}>
          {flower.location.split(" ")[0]}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 16, marginBottom: 10,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(45,122,79,.08)",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "14px 16px", display: "flex", alignItems: "center",
          gap: 12, border: "none", background: "none", cursor: "pointer", textAlign: "left",
          minHeight: 72,
        }}
        aria-expanded={expanded}
      >
        <div style={{ fontSize: 36 }}>{flower.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e1a" }}>{flower.name}</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{flower.nameEn}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: badge.bg, color: badge.text,
          }}>
            {badge.emoji} {badge.label}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>{expanded ? "▲" : "▼"}</div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, padding: "3px 8px", borderRadius: 8, background: "#f0fdf4", color: "#166534" }}>
              📍 {flower.location}
            </div>
            <div style={{ fontSize: 11, padding: "3px 8px", borderRadius: 8, background: "#f0fdf4", color: "#166534" }}>
              🗓 {flower.bloomStart.replace("-","/")}〜{flower.bloomEnd.replace("-","/")}
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 8 }}>
            {flower.description}
          </div>
          <div style={{ padding: "10px 12px", background: "#fef9c3", borderRadius: 10, fontSize: 12, color: "#92400e" }}>
            💡 {flower.tip}
          </div>
        </div>
      )}
    </div>
  );
}
