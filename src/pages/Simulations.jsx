import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveGameResult } from '../utils/games'

export default function Simulations() {
  const sims = [
    { 
      id:'earthquake', 
      title:'Earthquake Drill', 
      path:'/simulation/earthquake', 
      desc:'Practice earthquake safety by moving to safe zones under tables and avoiding dangerous areas.',
      icon: '🌍',
      difficulty: 'Easy'
    },
    { 
      id:'flood', 
      title:'Flood Escape Challenge', 
      path:'/simulation/flood', 
      desc:'Navigate through rising floodwaters to reach high ground and safety.',
      icon: '🌊',
      difficulty: 'Medium'
    },
    { 
      id:'fire', 
      title:'Fire Drill Game', 
      path:'/simulation/fire', 
      desc:'Learn fire safety by avoiding smoke and finding the safest exit routes.',
      icon: '🔥',
      difficulty: 'Hard'
    },
  ]
  const [message, setMessage] = useState('')
  
  return (
    <div className="simulations-page">
      <div className="hero-section">
        <h1 className="page-title">Simulation Games</h1>
        <p className="page-subtle">Practice disaster preparedness through interactive simulations and games.</p>
      </div>
      
      <div className="simulations-grid">
        {sims.map(s => (
          <div key={s.id} className="simulation-card">
            <div className="simulation-header">
              <div className="simulation-icon">{s.icon}</div>
              <div className="simulation-meta">
                <h3 className="simulation-title">{s.title}</h3>
                <span className={`difficulty-badge difficulty-${s.difficulty.toLowerCase()}`}>
                  {s.difficulty}
                </span>
              </div>
            </div>
            <p className="simulation-description">{s.desc}</p>
            <div className="simulation-action">
              <Link to={s.path} className="simulation-btn">
                <span>Play Game</span>
                <span className="btn-icon">🎮</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {message && (
        <div className="message-card">
          <div className="message-icon">🎮</div>
          <div className="message-text">{message}</div>
        </div>
      )}
    </div>
  )
}


