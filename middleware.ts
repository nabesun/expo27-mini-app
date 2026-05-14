/**
 * Vercel Edge Middleware — Basic 認証
 *
 * Vercel ダッシュボード > Project > Settings > Environment Variables に
 *   BASIC_AUTH_USER  : 任意のユーザー名
 *   BASIC_AUTH_PASS  : 任意のパスワード
 * を設定してください。
 *
 * ⚠️ PWA の Service Worker・manifest は認証をスキップします（SW の正常動作のため）。
 */

export const config = {
  // Vercel Edge Middleware が実行されるパスパターン
  matcher: "/(.*)",
};

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);
  const { pathname } = url;

  // --- 認証スキップ対象（PWA / Service Worker 関連ファイル）---
  const SKIP_PATTERNS = [
    /^\/sw\.js(\?.*)?$/,
    /^\/workbox-[^/]+\.js(\?.*)?$/,
    /^\/registerSW\.js(\?.*)?$/,
    /^\/manifest\.webmanifest(\?.*)?$/,
  ];
  if (SKIP_PATTERNS.some((re) => re.test(pathname))) {
    return undefined; // スキップ → そのまま通過
  }

  // --- Basic 認証チェック ---
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  // 環境変数未設定の場合は認証なしで通過（ローカル開発時など）
  if (!expectedUser || !expectedPass) {
    return undefined;
  }

  const authorization = request.headers.get("Authorization") ?? "";

  if (authorization.startsWith("Basic ")) {
    try {
      const encoded  = authorization.slice("Basic ".length);
      const decoded  = atob(encoded);
      const colonIdx = decoded.indexOf(":");
      const user     = decoded.substring(0, colonIdx);
      const pass     = decoded.substring(colonIdx + 1);

      if (user === expectedUser && pass === expectedPass) {
        return undefined; // 認証成功 → 通過
      }
    } catch {
      // Base64 デコード失敗 → 認証失敗として扱う
    }
  }

  // --- 認証失敗 → 401 を返してブラウザにダイアログを表示 ---
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GREEN×EXPO 2027 Preview", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
