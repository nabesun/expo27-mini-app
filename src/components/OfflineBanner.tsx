interface OfflineBannerProps {
  lastFetchedAt: Date | null;
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "たった今";
  if (mins < 60) return `${mins}分前`;
  return `${Math.floor(mins / 60)}時間前`;
}

export function OfflineBanner({ lastFetchedAt }: OfflineBannerProps) {
  return (
    <div style={{
      background: "#fef3c7", borderBottom: "1px solid #fbbf24",
      padding: "8px 16px", display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 14 }}>📡</span>
      <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>
        オフライン中 —{" "}
        {lastFetchedAt
          ? `最終取得: ${formatRelativeTime(lastFetchedAt)}のデータを表示中`
          : "キャッシュデータを表示中"}
      </span>
    </div>
  );
}
