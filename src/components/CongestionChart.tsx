import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CONGESTION_COLOR, CONGESTION_LABEL } from "../utils/weatherCode";

interface Props {
  forecast: Array<{ time: string; level: 1 | 2 | 3 | 4 | 5 }>;
}

export default function CongestionChart({ forecast }: Props) {
  const data = forecast.map((f) => ({
    time: f.time.replace(":00", ""),
    level: f.level,
    label: CONGESTION_LABEL[f.level],
  }));

  return (
    <div style={{ height: 80 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#6b7280" }} />
          <YAxis domain={[0, 5]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "4px 10px", fontSize: 11 }}>
                  {d.time}時: {d.label}
                </div>
              );
            }}
          />
          <Bar dataKey="level" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={CONGESTION_COLOR[d.level]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
