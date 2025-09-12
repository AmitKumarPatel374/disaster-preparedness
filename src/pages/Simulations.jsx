import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveGameResult } from '../utils/games'

export default function Simulations() {
  const sims = [
    { id:'earthquake', title:'Earthquake Drill', path:'/simulation/earthquake', desc:'Move to safe zone under table.' },
    { id:'flood', title:'Flood Escape Challenge', path:'/simulation/flood', desc:'Reach high ground before water rises.' },
    { id:'fire', title:'Fire Drill Game', path:'/simulation/fire', desc:'Avoid smoke and reach exit safely.' },
  ]
  const [message, setMessage] = useState('')
  return (
    <div>
      <h1 className="page-title">Simulation Games</h1>
      <div className="grid grid-3">
        {sims.map(s => (
          <div key={s.id} className="card">
            <h3 style={{marginTop:0, fontWeight:800}}>{s.title}</h3>
            <p className="page-subtle">{s.desc}</p>
            <Link to={s.path} className="btn" style={{display:'inline-block', padding:'10px 14px', borderRadius:10, marginTop:8}}>Play</Link>
          </div>
        ))}
      </div>
      {message && <div className="reply" style={{marginTop:12, background:'#ecfeff'}}>🎮 {message}</div>}
    </div>
  )
}


