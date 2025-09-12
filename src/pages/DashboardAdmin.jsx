import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardAdmin() {
  return (
    <div>
      <h1 className="page-title">Admin/Teacher Dashboard</h1>
      <div className="grid grid-3">
        <div className="card"><h3 style={{marginTop:0}}>Quiz Results</h3><p className="page-subtle">View student scores.</p><Link className="btn" to="/admin">Open</Link></div>
        <div className="card"><h3 style={{marginTop:0}}>Manage Quizzes</h3><p className="page-subtle">Create and assign quizzes.</p><Link className="btn" to="/admin/quizzes">Open</Link></div>
        <div className="card"><h3 style={{marginTop:0}}>Drills</h3><p className="page-subtle">Schedule practice and announcements.</p><Link className="btn" to="/admin/drills">Open</Link></div>
      </div>
    </div>
  )
}


