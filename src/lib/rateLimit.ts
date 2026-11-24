/**
 * Limitador de solicitudes en memoria (ventana fija).
 * Vive en el proceso del servidor: si hay varios procesos, cada uno cuenta por separado,
 * lo que basta para frenar fuerza bruta y spam de formularios.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  buckets.forEach((b, k) => {
    if (b.resetAt <= now) buckets.delete(k);
  });
}

/** Suma un intento y dice si sigue permitido. */
export function hit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  b.count++;
  return { ok: b.count <= limit, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
}

/** Dice si la clave ya superó el límite, sin sumar un intento. */
export function isBlocked(key: string, limit: number) {
  const b = buckets.get(key);
  return !!b && b.resetAt > Date.now() && b.count >= limit;
}

export function reset(key: string) {
  buckets.delete(key);
}

/** IP del cliente según los encabezados del proxy (Apache/Passenger). */
export function clientIp(headers: Headers) {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") || "sin-ip";
}
