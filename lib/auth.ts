import { createHmac, timingSafeEqual } from "crypto"

type JwtHeader = {
  alg: "HS256"
  typ: "JWT"
}

type JwtPayload = Record<string, any>

function base64UrlEncode(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64UrlDecode(input: string): Buffer {
  input = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = 4 - (input.length % 4)
  const padded = pad === 4 ? input : input + "=".repeat(pad)
  return Buffer.from(padded, "base64")
}

function getSecret(): Buffer {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not set")
  }
  return Buffer.from(secret)
}

export function signJwt(payload: JwtPayload, expiresInSeconds = 60 * 60 * 24 * 7): string {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds }

  const headerEncoded = base64UrlEncode(JSON.stringify(header))
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload))
  const data = `${headerEncoded}.${payloadEncoded}`

  const signature = createHmac("sha256", getSecret()).update(data).digest()
  const signatureEncoded = base64UrlEncode(signature)

  return `${data}.${signatureEncoded}`
}

export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [headerB64, payloadB64, signatureB64] = parts

  const data = `${headerB64}.${payloadB64}`
  const expected = createHmac("sha256", getSecret()).update(data).digest()
  const actual = base64UrlDecode(signatureB64)

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null
  }

  try {
    const payloadJson = base64UrlDecode(payloadB64).toString("utf8")
    const payload = JSON.parse(payloadJson) as T & { exp?: number }
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null
    }
    return payload as T
  } catch {
    return null
  }
}

export function getAuthCookieName(): string {
  return process.env.AUTH_COOKIE_NAME || "auth_token"
}


