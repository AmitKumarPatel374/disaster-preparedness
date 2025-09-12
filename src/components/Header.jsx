import React, { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { getSession } from "../utils/auth"

export default function Header() {
  const location = useLocation()
  const [session, setSession] = useState(() => getSession())
  useEffect(() => { setSession(getSession()) }, [location])
  useEffect(() => {
    const onStorage = () => setSession(getSession())
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onStorage)
    }
  }, [])
  const role = session?.role?.toLowerCase()
  return (
    <header className="site-header">
      <div className="container header">
        <Link to="/" className="brand">
          <span className="brand-mark">🛡️</span>
          <span className="brand-name">Disaster Education</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/awareness" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Awareness</NavLink>
          <NavLink to="/simulations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Simulations</NavLink>
          {!session && <NavLink to="/auth" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Auth</NavLink>}
          {role === 'student' && <NavLink to="/dashboard/student" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Student</NavLink>}
          <NavLink to="/faq" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>FAQ</NavLink>
          {role === 'admin' && <NavLink to="/dashboard/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin Dashboard</NavLink>}
          {session && <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>}
        </nav>
      </div>
    </header>
  )
}


