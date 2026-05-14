interface SkeletonCardProps {
  lines?: number;
  height?: number;
}

export function SkeletonCard({ lines = 3, height = 80 }: SkeletonCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 16,
      boxShadow: "0 2px 12px rgba(45,122,79,.08)",
      marginBottom: 14, height,
      overflow: "hidden",
    }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14, borderRadius: 7,
            background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.4s infinite",
            marginBottom: i < lines - 1 ? 10 : 0,
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
