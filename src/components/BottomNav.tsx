import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "home",       path: "/",          icon: "🏠", label: "ホーム" },
  { id: "weather",    path: "/weather",   icon: "☀️", label: "天気" },
  { id: "flowers",    path: "/flowers",   icon: "🌸", label: "花" },
  { id: "facilities", path: "/facilities",icon: "🗺️", label: "施設" },
  { id: "notebook",   path: "/notebook",  icon: "📓", label: "記録帳" },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: 390, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)",
      borderTop: "1px solid #e5e7eb", display: "flex", zIndex: 200,
    }}>
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1, padding: "8px 4px 12px", border: "none", background: "none",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, minHeight: 56,
            }}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? "#2d7a4f" : "#9ca3af",
            }}>
              {item.label}
            </span>
            {active && (
              <div style={{ width: 20, height: 2.5, borderRadius: 2, background: "#2d7a4f" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
