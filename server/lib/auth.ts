import { createHmac, timingSafeEqual } from "node:crypto";

export type AuthPayload = {
  sub: string;
  email: string;
  exp: number;
};

const toBase64Url = (value: string) =>
  Buffer.from(value, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const withPadding = pad ? normalized + "=".repeat(4 - pad) : normalized;
  return Buffer.from(withPadding, "base64").toString("utf-8");
};

const sign = (payloadB64: string, secret: string) =>
  createHmac("sha256", secret).update(payloadB64).digest("base64url");

export const signAuthToken = (payload: AuthPayload, secret: string): string => {
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
};

export const verifyAuthToken = (token: string, secret: string): AuthPayload | null => {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64, secret);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payloadB64)) as AuthPayload;
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (!parsed.sub || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
};
