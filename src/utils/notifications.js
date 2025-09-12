import { readJSON, writeJSON, StorageKeys } from './storage'
import { getSession } from './auth'

const KEY = 'des_notifications' // array of { id, type, title, body, date, target: 'all' | { state?, district? } }

export function getNotifications() {
  return readJSON(KEY, []) || []
}

export function addNotification(n) {
  const all = getNotifications()
  all.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, date: new Date().toISOString(), ...n })
  writeJSON(KEY, all)
  return all[0]
}

export function getStudentNotifications() {
  const s = getSession() || {}
  const all = getNotifications()
  return all.filter(n => {
    if (n.target === 'all') return true
    if (!n.target) return true
    const okState = !n.target.state || n.target.state === s.state
    const okDist = !n.target.district || n.target.district === s.district
    return okState && okDist
  })
}


