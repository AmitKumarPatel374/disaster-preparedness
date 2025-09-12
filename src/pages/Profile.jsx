import React from 'react'
import { getSession, logout } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const session = getSession()
  const navigate = useNavigate()
  if (!session) return <div className="card">Not signed in.</div>
  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <div className="card">
        <div><strong>Email:</strong> {session.email}</div>
        <div><strong>Role:</strong> {session.role}</div>
        <div><strong>Region:</strong> {session.state || '-'}, {session.district || '-'}</div>
      </div>
      <button className="btn" onClick={()=> { logout(); navigate('/auth') }}>Logout</button>
    </div>
  )
}


