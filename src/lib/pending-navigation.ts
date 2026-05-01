/**
 * Cross-component handoff for navigation requests that arrive before the
 * React Router is mounted (e.g. push notification taps from a terminated
 * app state). The router consumes the pending path on first render.
 */

const KEY = '__myfarm_pending_nav__';

export function setPendingNavigation(path: string) {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    (window as unknown as Record<string, string>)[KEY] = path;
  }
}

export function consumePendingNavigation(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    if (v) sessionStorage.removeItem(KEY);
    return v;
  } catch {
    const w = window as unknown as Record<string, string | undefined>;
    const v = w[KEY] ?? null;
    if (v) delete w[KEY];
    return v;
  }
}

/**
 * Resolve a destination route from a push notification payload.
 * Defaults to /history (where scan results live) so users always
 * land on a useful screen.
 */
export function resolvePushRoute(data: Record<string, unknown> | undefined): string {
  if (!data) return '/history';
  const explicit = (data.route || data.path || data.url) as string | undefined;
  if (typeof explicit === 'string' && explicit.startsWith('/')) return explicit;
  if (data.scanId || data.scan_id) return '/history';
  if (data.postId || data.post_id) return '/forum';
  if (data.type === 'forum_post') return '/forum';
  if (data.type === 'moderation') return '/moderation';
  return '/history';
}
