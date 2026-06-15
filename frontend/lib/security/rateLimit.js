import { NextResponse } from 'next/server'

const buckets = globalThis.__gayaRateLimitBuckets || new Map()
if (!globalThis.__gayaRateLimitBuckets) {
  globalThis.__gayaRateLimitBuckets = buckets
}

function requestIdentifier(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export function consumeRateLimit(request, name, { limit, windowMs }) {
  const now = Date.now()
  if (buckets.size > 10000) {
    for (const [entryKey, entry] of buckets) {
      if (entry.resetAt <= now || buckets.size > 10000) buckets.delete(entryKey)
      if (buckets.size <= 10000) break
    }
  }
  const key = `${name}:${requestIdentifier(request)}`
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

export function enforceRateLimit(request, name, options) {
  const result = consumeRateLimit(request, name, options)
  if (result.allowed) return null

  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))
  return NextResponse.json(
    { success: false, message: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}
