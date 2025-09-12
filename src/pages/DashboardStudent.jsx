import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSession } from '../utils/auth'
import { getStudentNotifications } from '../utils/notifications'

export default function DashboardStudent() {
  const s = getSession() || {}
  const [notifs, setNotifs] = useState([])
  useEffect(() => { setNotifs(getStudentNotifications()) }, [])
  return (
    <div>
      <h1 className="page-title">Student Dashboard</h1>
      <div className="card">Hello, {s.email}. Region: {s.state || '-'}, {s.district || '-'}</div>
      <div className="card">
        <h3 style={{marginTop:0}}>Notifications</h3>
        {notifs.length === 0 ? (
          <p className="page-subtle">No notifications yet.</p>
        ) : (
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {notifs.map(n => (
              <li key={n.id} style={{borderBottom:'1px solid var(--border)', padding:'6px 0'}}>
                <div style={{fontWeight:700}}>{n.title}</div>
                <div className="page-subtle">{new Date(n.date).toLocaleString()} — {n.type}</div>
                <div>{n.body}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-3">
        <div className="card"><h3 style={{marginTop:0}}>Awareness</h3><p className="page-subtle">Learn safety and response.</p><Link className="btn" to="/awareness">Open</Link></div>
        <div className="card"><h3 style={{marginTop:0}}>Simulations</h3><p className="page-subtle">Practice drills.</p><Link className="btn" to="/simulations">Open</Link></div>
        <div className="card"><h3 style={{marginTop:0}}>Quizzes</h3><p className="page-subtle">Test knowledge.</p><Link className="btn" to="/">Open</Link></div>
      </div>
    </div>
  )
}


