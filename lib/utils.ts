import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalize product image path coming from DB
export function resolveProductImage(rawPath?: string | null): string {
  if (!rawPath) return "/placeholder.jpg"
  let p = rawPath
  // strip /public and /images prefixes
  p = p.replace(/^\/public/i, "")
  p = p.replace(/^\/images\//i, "/")

  // ensure leading slash
  if (!p.startsWith("/")) p = "/" + p

  const filename = p.split("/").pop() || ""

  const map: Record<string, string> = {
    "samsung-s24-ultra.png": "/samsung-galaxy-s24-ultra.png",
    "samsung-s24-plus.png": "/samsung-galaxy-s24-ultra.png",
    "oneplus-12.png": "/oneplus-12-product-shot.png",
    // Fallback iPhone variants to available asset
    "iphone-15-pro.png": "/iphone-15-pro-max.png",
    "iphone-15.png": "/iphone-15-pro-max.png",
  }

  if (filename in map) return map[filename]

  // Known assets in /public should work as-is
  return p
}
