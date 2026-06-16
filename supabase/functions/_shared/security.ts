export function clientIdentifier(req: Request, userId?: string | null) {
  if (userId) return `user:${userId}`;
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = req.headers.get('x-real-ip')?.trim();
  const cfIp = req.headers.get('cf-connecting-ip')?.trim();
  return `ip:${forwarded || realIp || cfIp || 'unknown'}`;
}

export function parsePage(value: string | null, maxPage = 50) {
  const page = Number.parseInt(value ?? '1', 10);
  if (!Number.isFinite(page) || page < 1 || page > maxPage) return null;
  return page;
}

export function safeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export async function checkRateLimit(
  db: any,
  functionName: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
) {
  const { data, error } = await db.rpc('consume_edge_rate_limit', {
    p_function_name: functionName,
    p_identifier: identifier,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error('rate limit error:', error);
    return false;
  }

  return data === true;
}

export function publicError(message = 'Internal server error') {
  return { error: message };
}
