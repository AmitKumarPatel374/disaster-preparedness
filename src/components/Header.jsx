import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useSession } from "../hooks/useSession"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const session = useSession()
  
  const role = session?.role?.toLowerCase()
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }
  
  return (
    <header className="site-header">
      <div className="container header">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <span className="brand-mark">🛡️</span>
          <span className="brand-name">Disaster Education</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        {/* Desktop navigation */}
        <nav className="nav desktop-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/awareness" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Awareness</NavLink>
          <NavLink to="/simulations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Simulations</NavLink>
          {!session && <NavLink to="/auth" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Auth</NavLink>}
          {role === 'student' && <NavLink to="/dashboard/student" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Student</NavLink>}
          <NavLink to="/faq" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>FAQ</NavLink>
          {role === 'admin' && <NavLink to="/dashboard/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin Dashboard</NavLink>}
          {session && <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>}
        </nav>
        
        {/* Mobile navigation */}
        <nav className={`nav mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/awareness" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Awareness</NavLink>
          <NavLink to="/simulations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Simulations</NavLink>
          {!session && <NavLink to="/auth" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Auth</NavLink>}
          {role === 'student' && <NavLink to="/dashboard/student" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Student</NavLink>}
          <NavLink to="/faq" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>FAQ</NavLink>
          {role === 'admin' && <NavLink to="/dashboard/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Admin Dashboard</NavLink>}
          {session && <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMobileMenu}>Profile</NavLink>}
        </nav>
      </div>
    </header>
  )
}


