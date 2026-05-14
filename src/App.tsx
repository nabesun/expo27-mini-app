import { Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { Home }       from "./pages/Home";
import { Weather }    from "./pages/Weather";
import { Flowers }    from "./pages/Flowers";
import { Courses }    from "./pages/Courses";
import { Facilities } from "./pages/Facilities";
import { Notebook }   from "./pages/Notebook";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#e5e7eb",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "24px 0",
      fontFamily: "-apple-system, 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      {/* スマートフォンフレーム */}
      <div style={{
        width: 390,
        minHeight: 760,
        background: "#f8faf8",
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.2), 0 0 0 8px #1a1a1a, inset 0 0 0 2px #333",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* ステータスバー */}
        <StatusBar />

        {/* ページコンテンツ */}
        <div style={{ flex: 1, overflowY: "auto", background: "#f8faf8" }}>
          <Routes>
            <Route path="/"           element={<Home />}       />
            <Route path="/weather"    element={<Weather />}    />
            <Route path="/flowers"    element={<Flowers />}    />
            <Route path="/courses"    element={<Courses />}    />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/notebook"   element={<Notebook />}   />
          </Routes>
        </div>

        {/* ボトムナビ */}
        <BottomNav />
      </div>

      {/* サイドパネル（デスクトップのみ） */}
      <SidePanel />
    </div>
  );
}

function StatusBar() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)",
      padding: "10px 20px 4px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#fff",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: ".02em",
    }}>
      <span>{h}:{m}</span>
      <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span>📶</span>
        <span>🔋</span>
      </span>
    </div>
  );
}

function SidePanel() {
  return (
    <div style={{ marginLeft: 24, paddingTop: 32 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
        GREEN×EXPO 2027
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
        らくらくガイド<br />PWA プロトタイプ
      </div>
      <div style={{ marginTop: 16, fontSize: 10, color: "#9ca3af", lineHeight: 1.8 }}>
        開催: 2027.3.19〜9.26<br />
        横浜 旧上瀬谷通信施設<br />
        国際園芸博覧会
      </div>
    </div>
  );
}
