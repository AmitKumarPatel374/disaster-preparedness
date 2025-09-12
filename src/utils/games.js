import { readJSON, writeJSON, StorageKeys } from './storage'
import { getSession } from './auth'
import { getDB } from './idb'

export function saveLocalGameResult(result) {
  const session = getSession() || {}
  const all = readJSON(StorageKeys.GameProgress, {}) || {}
  const userKey = session.email || 'guest'
  if (!all[userKey]) all[userKey] = []
  all[userKey].push(result)
  writeJSON(StorageKeys.GameProgress, all)
}

export async function saveIndexedGameResult(result) {
  try {
    const db = await getDB()
    if (!db.objectStoreNames.contains('gameResults')) return
    await db.add('gameResults', result)
  } catch {}
}

export async function saveGameResult(type, score, extra = {}) {
  const session = getSession() || {}
  const record = {
    id: `${type}-${Date.now()}`,
    user: session.email || 'guest',
    type,
    score,
    date: new Date().toISOString(),
    ...extra
  }
  saveLocalGameResult(record)
  await saveIndexedGameResult(record)
  return record
}

export function getLocalGameResults() {
  return readJSON(StorageKeys.GameProgress, {}) || {}
}


