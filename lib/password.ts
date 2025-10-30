import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scrypt = promisify(_scrypt)

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const keyLen = 32
  const N = 16384 // CPU/memory cost
  const r = 8
  const p = 1
  const derivedKey = (await scrypt(password, salt, keyLen, { N, r, p })) as Buffer
  return `scrypt$${N}.${r}.${p}$${salt.toString("hex")}$${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, params, saltHex, hashHex] = stored.split("$")
    if (scheme !== "scrypt") return false
    const [Nstr, rstr, pstr] = params.split(".")
    const N = Number(Nstr)
    const r = Number(rstr)
    const p = Number(pstr)
    const salt = Buffer.from(saltHex, "hex")
    const hash = Buffer.from(hashHex, "hex")
    const derived = (await scrypt(password, salt, hash.length, { N, r, p })) as Buffer
    return derived.length === hash.length && timingSafeEqual(derived, hash)
  } catch {
    return false
  }
}


