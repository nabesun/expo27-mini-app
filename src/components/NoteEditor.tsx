import { useState } from "react";
import type { NoteTag } from "../types";

const TAG_CONFIG: Record<NoteTag, { label: string; emoji: string; bg: string; color: string }> = {
  flower:  { label: "花",    emoji: "🌸", bg: "#fce7f3", color: "#9d174d" },
  tree:    { label: "樹木",  emoji: "🌲", bg: "#d1fae5", color: "#065f46" },
  scenery: { label: "風景",  emoji: "🏞️", bg: "#e0f2fe", color: "#0369a1" },
  food:    { label: "食べ物",emoji: "🍱", bg: "#fef9c3", color: "#92400e" },
  other:   { label: "その他",emoji: "📝", bg: "#f3f4f6", color: "#374151" },
};

interface NoteEditorProps {
  onSave: (title: string, content: string, tag: NoteTag) => void;
  onCancel: () => void;
}

export function NoteEditor({ onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag]         = useState<NoteTag>("flower");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), content.trim(), tag);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 16,
      border: "2px solid #2d7a4f", marginBottom: 14,
      boxShadow: "0 2px 12px rgba(45,122,79,.12)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#2d7a4f", marginBottom: 12 }}>
        📝 新しいメモ
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル（植物名など）"
        style={{
          width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
          borderRadius: 10, fontSize: 14, outline: "none", marginBottom: 10,
          boxSizing: "border-box", fontFamily: "inherit",
        }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="気づいたこと、場所、感想..."
        rows={3}
        style={{
          width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
          borderRadius: 10, fontSize: 14, outline: "none", resize: "none",
          marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit",
        }}
      />

      {/* タグ選択 */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {(Object.entries(TAG_CONFIG) as [NoteTag, typeof TAG_CONFIG[NoteTag]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setTag(key)}
            style={{
              padding: "4px 10px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${tag === key ? cfg.color : "#e5e7eb"}`,
              background: tag === key ? cfg.bg : "#fff",
              color: tag === key ? cfg.color : "#9ca3af",
            }}
          >
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer",
            background: title.trim() ? "#2d7a4f" : "#d1d5db",
            color: "#fff", fontSize: 14, fontWeight: 700,
          }}
        >
          保存する
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb",
            background: "#fff", color: "#6b7280", fontSize: 14, cursor: "pointer",
          }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

export { TAG_CONFIG };
