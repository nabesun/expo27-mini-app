/**
 * 日本標準時（JST / UTC+9）ベースの日付ユーティリティ
 *
 * new Date() はシステムのローカルタイムゾーンを使うため、
 * 環境によって JST とズレる場合がある。
 * このモジュールは Intl API を使い、常に JST で日付を返す。
 */

/** 今日の日付を JST で "YYYY-MM-DD" 形式で返す */
export function getTodayJST(): string {
  // sv（スウェーデン語）ロケールは ISO 8601（YYYY-MM-DD）形式で出力する
  return new Intl.DateTimeFormat("sv", { timeZone: "Asia/Tokyo" }).format(new Date());
}

/** 任意の Date を JST の Date に変換して返す（時刻は 00:00:00 に正規化） */
export function toJSTDate(d?: Date): Date {
  const target = d ?? new Date();
  const jstString = new Intl.DateTimeFormat("sv", { timeZone: "Asia/Tokyo" }).format(target);
  return new Date(`${jstString}T00:00:00+09:00`);
}

/** JST での今日の Date オブジェクト（時刻は 00:00:00 JST） */
export function todayJST(): Date {
  return toJSTDate();
}
