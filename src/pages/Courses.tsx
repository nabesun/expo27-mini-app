import { useState } from "react";
import { useMtJson } from "../hooks/useMtJson";
import { API } from "../config";
import type { CourseItem } from "../types";
import { SkeletonCard } from "../components/SkeletonCard";
import { OfflineBanner } from "../components/OfflineBanner";

const ALL_TAGS = ["初来場","ファミリー","シニア","じっくり派","カップル","一人旅"];

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(45,122,79,.08)", ...style }}>
      {children}
    </div>
  );
}

function Header() {
  return (
    <div style={{ padding: "12px 20px 16px", background: "linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)" }}>
      <div style={{ fontSize: 13, color: "#a8d5b5", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Recommended Routes
      </div>
      <div style={{ fontSize: 20, color: "#fff", fontWeight: 700, marginTop: 2 }}>おすすめコース</div>
    </div>
  );
}

/** コースごとのチェック状態を localStorage に保存するユーティリティ */
function getCourseChecks(courseId: string): boolean[] {
  try {
    const raw = localStorage.getItem(`course_check_${courseId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCourseChecks(courseId: string, checks: boolean[]) {
  localStorage.setItem(`course_check_${courseId}`, JSON.stringify(checks));
}

function CourseCard({ course }: { course: CourseItem }) {
  const [expanded, setExpanded] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(() => {
    const saved = getCourseChecks(course.id);
    return course.steps.map((_, i) => saved[i] ?? false);
  });

  const toggleCheck = (idx: number) => {
    setChecks((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      saveCourseChecks(course.id, next);
      return next;
    });
  };

  const resetChecks = () => {
    const empty = course.steps.map(() => false);
    setChecks(empty);
    saveCourseChecks(course.id, empty);
  };

  const doneCount = checks.filter(Boolean).length;

  return (
    <Card style={{ marginBottom: 14 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer", padding: 0 }}
        aria-expanded={expanded}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 40 }}>{course.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a2e1a" }}>{course.name}</div>
            <div style={{ fontSize: 13, color: "#2d7a4f", fontWeight: 600 }}>{course.duration} · {course.distance}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 8 }}>
                📍 {course.steps.length}スポット
              </span>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {course.tags.map((t) => (
                <span key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 6, background: "#d1fae5", color: "#065f46", fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{expanded ? "▲" : "▼"}</div>
        </div>

        {expanded && doneCount > 0 && (
          <div style={{ marginTop: 8, padding: "6px 10px", background: "#f0fdf4", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#166534", fontWeight: 700 }}>
              進捗: {doneCount} / {course.steps.length} スポット完了 🎉
            </div>
          </div>
        )}
      </button>

      {expanded && (
        <div style={{ marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
          {course.steps.map((step, i) => {
            const done = checks[i];
            return (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {/* タイムライン */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    onClick={() => toggleCheck(i)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
                      border: `2px solid ${done ? "#2d7a4f" : "#d1d5db"}`,
                      background: done ? "#2d7a4f" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    aria-label={`${step.spot} ${done ? "完了解除" : "完了"}`}
                  >
                    {done && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
                  </button>
                  {i < course.steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "#e5e7eb", margin: "4px 0" }} />
                  )}
                </div>

                {/* コンテンツ */}
                <div style={{ flex: 1, paddingBottom: i < course.steps.length - 1 ? 8 : 0, opacity: done ? .5 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2e1a", textDecoration: done ? "line-through" : "none" }}>
                      {String(i + 1).padStart(2, "0")}. {step.spot}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{step.duration}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.4 }}>
                    💡 {step.tip}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={resetChecks}
            style={{
              fontSize: 11, color: "#9ca3af", background: "none",
              border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "6px 12px", cursor: "pointer", marginTop: 4,
            }}
          >
            このコースをリセット
          </button>
        </div>
      )}
    </Card>
  );
}

export function Courses() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const { data: courses, status, lastFetchedAt } = useMtJson<CourseItem[]>(API.courses, "courses");

  const toggleTag = (t: string) =>
    setActiveTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = courses
    ? courses.filter((c) => activeTags.length === 0 || activeTags.some((t) => c.tags.includes(t)))
    : [];

  return (
    <div style={{ paddingBottom: 16 }}>
      <Header />
      {status === "fallback" && <OfflineBanner lastFetchedAt={lastFetchedAt} />}

      <div style={{ padding: "16px" }}>
        {/* タグフィルター */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              style={{
                padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                fontSize: 12, fontWeight: 600, minHeight: 32,
                border: `1.5px solid ${activeTags.includes(t) ? "#2d7a4f" : "#d1d5db"}`,
                background: activeTags.includes(t) ? "#2d7a4f" : "#fff",
                color: activeTags.includes(t) ? "#fff" : "#6b7280",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {status === "loading" && [1,2].map(i => <SkeletonCard key={i} lines={4} height={140} />)}
        {status === "error" && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 13 }}>情報を取得できません。接続を確認してください。</div>
          </div>
        )}

        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {courses && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 32 }}>🗺️</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>条件に一致するコースがありません</div>
          </div>
        )}
      </div>
    </div>
  );
}
