import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup, login, getSession } from '../utils/auth'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName:'', email:'', password:'', mobile:'', country:'IN', state:'', district:'', role:'student' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    try {
      setError('')
      if (mode === 'signup') {
        const u = signup(form)
        alert('Signup successful! Redirecting...')
        if (u.role === 'admin') navigate('/dashboard/admin')
        else navigate('/dashboard/student')
      } else {
        const u = login(form.email, form.password)
        alert(`Welcome ${u.fullName || u.email}`)
        if (u.role === 'admin') navigate('/dashboard/admin')
        else navigate('/dashboard/student')
      }
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  const session = getSession()

  return (
    <div>
      <h1 className="page-title">{mode === 'signup' ? 'Sign up' : 'Sign in'}</h1>
      {session ? (<div className="card">Logged in as: {session.email} ({session.role})</div>) : null}
      <div className="card">
        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button className="btn" onClick={()=> setMode('login')}>Sign in</button>
          <button className="btn" onClick={()=> setMode('signup')}>Sign up</button>
        </div>
        <form onSubmit={onSubmit} style={{display:'grid', gap:8}}>
          {mode === 'signup' && (
            <>
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handle} required />
              <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handle} required />
              <input name="country" placeholder="Country" value={form.country} onChange={handle} required />
              <input name="state" placeholder="State" value={form.state} onChange={handle} required />
              <input name="district" placeholder="District" value={form.district} onChange={handle} required />
              <select name="role" value={form.role} onChange={handle}>
                <option value="student">Student</option>
                <option value="admin">Admin/Teacher</option>
              </select>
            </>
          )}
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handle} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handle} required />
          {error && <div className="reply" style={{background:'#fee2e2'}}>⚠️ {error}</div>}
          <button className="btn" type="submit">{mode === 'signup' ? 'Create account' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}


