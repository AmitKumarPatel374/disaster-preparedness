import React, { useEffect, useState } from "react"
import { getSession } from "../utils/auth"
import { loadAlerts, findRegionAlerts, getSeenAlertIds, addSeenAlertId, loadDisasterTips } from "../utils/alerts"

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([])
  const [tips, setTips] = useState({})

  useEffect(() => {
    (async () => {
      try {
        const session = getSession() || {}
        const all = await loadAlerts()
        const region = findRegionAlerts(all, session.state, session.district)
        setAlerts(region)
        setTips(await loadDisasterTips())
        // Fire browser notification if new
        if (region && region.length) {
          const seen = new Set(getSeenAlertIds())
          for (const a of region) {
            if (!seen.has(a.id) && 'Notification' in window) {
              try {
                if (Notification.permission === 'granted') {
                  new Notification(`Disaster Alert: ${a.type}`, { body: `${a.district}, ${a.state} • ${a.message}` })
                } else if (Notification.permission !== 'denied') {
                  const perm = await Notification.requestPermission()
                  if (perm === 'granted') new Notification(`Disaster Alert: ${a.type}`, { body: `${a.district}, ${a.state} • ${a.message}` })
                }
              } catch {}
              addSeenAlertId(a.id)
            }
          }
        }
      } catch (e) {
        setAlerts([])
      }
    })()
  }, [])

  if (!alerts || alerts.length === 0) return null

  return (
    <div className="container" style={{marginTop:12, marginBottom:12}}>
      {alerts.map(a => (
        <div key={a.id} className="card" style={{borderLeft:"4px solid #ef4444", background:"#fff7ed"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
            <div>
              <div style={{fontWeight:800}}>
                🚨 {a.type.toUpperCase()} alert in {a.district}, {a.state}
              </div>
              <div className="page-subtle">{new Date(a.time).toLocaleString()}</div>
            </div>
            <div style={{fontWeight:700, color:'#b91c1c', textTransform:'capitalize'}}>{a.severity}</div>
          </div>
          <div style={{marginTop:8}}>{a.message}</div>
          {tips[a.type]?.length ? (
            <div className="card" style={{marginTop:8, background:'#fff'}}>
              <div style={{fontWeight:700}}>Safety Instructions</div>
              <ul style={{margin:0, paddingLeft:18}}>
                {tips[a.type].slice(0,3).map((t,i)=> <li key={i}>{t}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}


