/**
 * Centralized API service layer for SignBridge AI.
 *
 * Every network call the app makes goes through this file. Nothing else in
 * the codebase should call `fetch` directly. That keeps the app "API-ready":
 * when a real backend is deployed, only VITE_API_BASE_URL (and, if needed,
 * the paths below) need to change — no component rewrites required.
 *
 * IMPORTANT — no fake AI:
 * If VITE_API_BASE_URL is not set, or the backend is unreachable, every
 * function here throws an ApiError with `offline: true` instead of
 * returning invented data. Screens are responsible for showing an honest
 * "not connected" state in that case (see StatusIndicator / error copy).
 *
 * Secrets: this file never reads or embeds a secret API key. If a
 * downstream recognition/translation provider requires one, that key
 * belongs on a backend proxy, not in this frontend.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, { offline = false, status = null, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.offline = offline
    this.status = status
    if (cause) this.cause = cause
  }
}

function ensureConfigured() {
  if (!BASE_URL) {
    throw new ApiError('No backend is configured (VITE_API_BASE_URL is empty).', {
      offline: true,
    })
  }
}

async function request(path, { method = 'GET', body, headers, signal, timeoutMs = 15000 } = {}) {
  ensureConfigured()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  if (signal) signal.addEventListener('abort', () => controller.abort())

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        Accept: 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    // A network-level failure (DNS, refused connection, CORS, timeout) —
    // treat this as "backend not connected", never as a recognized result.
    throw new ApiError('Could not reach the SignBridge backend.', {
      offline: true,
      cause: err,
    })
  }
  clearTimeout(timeout)

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message || `Request failed (${response.status}).`, {
      offline: false,
      status: response.status,
    })
  }

  return data
}

/** GET /health — used to drive the API status indicator across the app. */
export async function checkHealth() {
  return request('/health')
}

/**
 * POST /sign-to-text — send a single captured camera frame for ISL
 * recognition. `imageBase64` is a data URL or raw base64 JPEG/PNG frame.
 * Expected response: { sign, englishText, confidence } (confidence 0-1).
 */
export async function signToText(imageBase64) {
  return request('/sign-to-text', {
    method: 'POST',
    body: { image: imageBase64 },
  })
}

/**
 * POST /text-to-sign — convert English text into an ISL sign sequence.
 * Expected response:
 * { text, sign_sequence: [{ sign, motion_id }, ...] }
 */
export async function textToSign(text) {
  return request('/text-to-sign', {
    method: 'POST',
    body: { text },
  })
}

/**
 * GET /vocabulary — fetch the real ISL vocabulary dataset (150-200+ signs).
 * Falls back to the local static schema (src/data/signSchema.js) at the
 * call site when this is unavailable — the local schema is UI-only sample
 * vocabulary, not a substitute recognition source.
 */
export async function getVocabulary(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/vocabulary${query ? `?${query}` : ''}`)
}

/** POST /communication — log or relay a two-way communication turn. */
export async function sendCommunicationTurn(payload) {
  return request('/communication', {
    method: 'POST',
    body: payload,
  })
}

/** POST /auth/login */
export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

/** POST /auth/signup */
export async function signup({ fullName, email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: { fullName, email, password },
  })
}

export const isBackendConfigured = () => Boolean(BASE_URL)
