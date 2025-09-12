import React, { useState } from 'react'
import { addNotification } from '../utils/notifications'

export default function AdminDrills() {
  const [form, setForm] = useState({ title:'School Drill', date:'', state:'', district:'', note:'' })
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    addNotification({ type:'drill', title: form.title, body: `Drill on ${form.date}. ${form.note}`, target: { state: form.state || undefined, district: form.district || undefined } })
    alert('Drill announcement sent to students in the selected region.')
    setForm({ title:'School Drill', date:'', state:'', district:'', note:'' })
  }
  return (
    <div>
      <h1 className="page-title">Organize Drill / Announcement</h1>
      <div className="card">
        <form onSubmit={submit} style={{display:'grid', gap:8}}>
          <input name="title" placeholder="Title" value={form.title} onChange={handle} required />
          <input type="date" name="date" placeholder="Date" value={form.date} onChange={handle} required />
          <input name="state" placeholder="State (optional to target)" value={form.state} onChange={handle} />
          <input name="district" placeholder="District (optional to target)" value={form.district} onChange={handle} />
          <textarea name="note" placeholder="Notes" value={form.note} onChange={handle} />
          <button className="btn" type="submit">Send Announcement</button>
        </form>
      </div>
    </div>
  )
}


