export const StorageKeys = {
  Users: 'des_users',
  Session: 'des_session',
  GameProgress: 'des_game_progress',
}

export function readJSON(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function upsertArrayItem(key, item, matchFn) {
  const arr = readJSON(key, []) || []
  const idx = arr.findIndex(matchFn)
  if (idx >= 0) arr[idx] = item; else arr.push(item)
  writeJSON(key, arr)
}


