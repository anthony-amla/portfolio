/**
 * localStorage access that never throws (private mode, blocked storage, etc.).
 * When storage is unavailable, reads return the fallback and writes are dropped.
 */
export function readStorage(key, fallback = null) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}
