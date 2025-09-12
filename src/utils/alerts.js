export async function loadAlerts() {
  const res = await fetch('/data/alerts.json')
  return res.json()
}

export async function loadContacts() {
  const res = await fetch('/data/contacts.json')
  return res.json()
}

export function findRegionAlerts(alerts, state, district) {
  if (!state) return []
  return alerts.filter(a => a.state === state && (!district || a.district === district))
}

const SEEN_KEY = 'des_seen_alert_ids'
export function getSeenAlertIds() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || [] } catch { return [] }
}
export function addSeenAlertId(id) {
  const seen = new Set(getSeenAlertIds())
  seen.add(id)
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)))
}

export async function loadDisasterTips() {
  try {
    const res = await fetch('/data/disasters.json')
    const list = await res.json()
    const map = {}
    for (const d of list) map[d.id] = d.tips || []
    return map
  } catch { return {} }
}

export async function notifyWithSoundAndVibration(title, body) {
  try {
    // Vibration if supported (mobile)
    if (navigator.vibrate) navigator.vibrate([120, 60, 120])
    // Simple beep using Web Audio API
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.4)
  } catch {}
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') new Notification(title, { body })
      else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission()
        if (perm === 'granted') new Notification(title, { body })
      }
    }
  } catch {}
}


