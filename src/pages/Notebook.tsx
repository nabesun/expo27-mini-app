import { useState } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { NoteEditor, TAG_CONFIG } from "../components/NoteEditor";
import type { NoteTag } from "../types";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}時間前`;
  return `${Math.floor(hrs / 24)}日前`;
}

function Header() {
  return (
    <div style={{ padding: "12px 20px 16px", background: "linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)" }}>
      <div style={{ fontSize: 13, color: "#a8d5b5", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>
        My Garden Notebook
      </div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginTop: 2 }}>植物記録帳</div>
    </div>
  );
}

export function Notebook() {
  const { notes, addNote, deleteNote } = useNotebook();
  const [filterTag, setFilterTag] = useState<NoteTag | "all">("all");
  const [showForm, setShowForm]   = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = filterTag === "all" ? notes : notes.filter((n) => n.tag === filterTag);

  const handleCopyAll = async () => {
    const text = [
      "=== 花博メモ ===",
      ...notes.map((n) => {
        const d = new Date(n.createdAt);
        const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
        const cfg  = TAG_CONFIG[n.tag as NoteTag];
        return `[${date}] ${n.title}（${cfg?.label ?? n.tag}）\n${n.content}`;
      }),
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("📋 メモをコピーしました！");
    } catch {
      alert("コピーに失敗しました。");
    }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
      <div style={{ padding: "16px" }}>

        {/* プライバシー表示 */}
        <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginBottom: 12 }}>
          📱 メモはこの端末のみに保存されます
        </div>

        {/* タグフィルター */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 14, paddingBottom: 2 }}>
          <button
            onClick={() => setFilterTag("all")}
            style={{
              flexShrink: 0, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              fontSize: 12, fontWeight: 600, minHeight: 32,
              border: `1.5px solid ${filterTag === "all" ? "#2d7a4f" : "#d1d5db"}`,
              background: filterTag === "all" ? "#2d7a4f" : "#fff",
              color: filterTag === "all" ? "#fff" : "#6b7280",
            }}
          >
            すべて ({notes.length})
          </button>
          {(Object.entries(TAG_CONFIG) as [NoteTag, typeof TAG_CONFIG[NoteTag]][]).map(([key, cfg]) => {
            const count = notes.filter((n) => n.tag === key).length;
            if (!count) return null;
            return (
              <button
                key={key}
                onClick={() => setFilterTag(key)}
                style={{
                  flexShrink: 0, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, minHeight: 32,
                  border: `1.5px solid ${filterTag === key ? "#2d7a4f" : "#d1d5db"}`,
                  background: filterTag === key ? "#2d7a4f" : "#fff",
                  color: filterTag === key ? "#fff" : "#6b7280",
                }}
              >
                {cfg.emoji} {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* 新規メモフォーム */}
        {showForm && (
          <NoteEditor
            onSave={(title, content, tag) => {
              addNote(title, content, tag);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* ノート一覧 */}
        {filtered.map((note) => {
          const cfg = TAG_CONFIG[note.tag as NoteTag];
          const isDeleting = deletingId === note.id;
          return (
            <div
              key={note.id}
              style={{
                background: "#fff", borderRadius: 14, padding: "14px 16px",
                marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                borderLeft: `3px solid ${cfg?.color ?? "#d1d5db"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 10,
                      background: cfg?.bg ?? "#f3f4f6", color: cfg?.color ?? "#374151", fontWeight: 700,
                    }}>
                      {cfg?.emoji} {cfg?.label}
                    </span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{formatRelativeTime(note.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e1a", marginBottom: 6 }}>{note.title}</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{note.content}</div>
                </div>

                {/* 削除ボタン */}
                <div style={{ marginLeft: 8, flexShrink: 0 }}>
                  {isDeleting ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => { deleteNote(note.id); setDeletingId(null); }}
                        style={{ fontSize: 11, color: "#fff", background: "#ef4444", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
                      >
                        削除
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(note.id)}
                      style={{ background: "none", border: "none", fontSize: 18, color: "#d1d5db", cursor: "pointer", padding: "0 0 0 8px" }}
                      aria-label="削除"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 40 }}>📓</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>まだメモがありません</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>花との出会いを記録しましょう</div>
          </div>
        )}

        {/* 全メモコピーボタン */}
        {notes.length > 0 && (
          <button
            onClick={handleCopyAll}
            style={{
              display: "block", width: "100%", marginTop: 8, padding: "10px",
              borderRadius: 10, border: "1.5px solid #d1d5db", background: "#fff",
              color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            📋 全メモをコピー
          </button>
        )}
      </div>

      {/* FAB */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            position: "fixed", bottom: 88, right: "calc(50% - 195px + 16px)",
            width: 52, height: 52, borderRadius: "50%", background: "#2d7a4f",
            border: "none", color: "#fff", fontSize: 28, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(45,122,79,.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
          aria-label="新規メモ作成"
        >
          +
        </button>
      )}
    </div>
  );
}
