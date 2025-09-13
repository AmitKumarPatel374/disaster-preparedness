import React, { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

export default function Awareness() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      try {
        // Load from LocalStorage first (allows easy updates), else from JSON file
        const local = readJSON('des_disasters', null)
        if (local && Array.isArray(local) && local.length) {
          setItems(local)
        } else {
          const res = await fetch('/data/disasters.json', { cache: 'no-cache' })
          const data = await res.json()
          setItems(data)
          // cache to LocalStorage for easy future updates
          writeJSON('des_disasters', data)
        }
      } catch (e) { setItems([]) }
      finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div>Loading...</div>

  const filtered = items.filter(d => {
    if (!query.trim()) return true
    const hay = `${d.title} ${d.overview} ${(d.tips||[]).join(' ')} ${(d.response||[]).join(' ')}`.toLowerCase()
    return hay.includes(query.toLowerCase())
  })

  const resetLocal = async () => {
    localStorage.clear();
    try {
      const res = await fetch('/data/disasters.json', { cache: 'no-cache' })
      const data = await res.json()
      writeJSON('des_disasters', data)
      setItems(data)
    } catch {}
  }

  return (
    <div className="awareness-page">
      <div className="hero-section">
        <h1 className="page-title">Disaster Awareness</h1>
        <p className="page-subtle">Learn about different types of disasters and how to stay safe.</p>
      </div>

      {/* Controls */}
      <div className="search-controls">
        <div className="search-card">
          <input 
            placeholder="Search disasters, tips or responses..." 
            value={query} 
            onChange={(e)=> setQuery(e.target.value)} 
            className="search-input"
          />
          <button className="btn reset-btn" onClick={resetLocal}>Reset to defaults</button>
        </div>
      </div>

      {/* Table of contents */}
      <div className="toc-section">
        <div className="toc-card">
          <h3 className="toc-title">Quick Navigation</h3>
          <div className="toc-links">
            {filtered.map(d => (
              <a key={d.id} href={`#${d.id}`} className="toc-link">{d.title}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="disasters-grid">
        {filtered.map(d => (
          <section key={d.id} className="disaster-card" id={d.id}>
            <div className="disaster-header">
              <h2 className="disaster-title">{d.title}</h2>
              <p className="disaster-overview">{d.overview}</p>
            </div>
            
            {d.images?.length ? (
              <div className="disaster-images">
                {d.images.map((src, i) => (
                  <img key={i} src={src} alt={d.title} className="disaster-image" />
                ))}
              </div>
            ) : null}
            
            {d.videos?.length ? (
              <div className="disaster-videos">
                {d.videos.map((v, i) => (
                  <div key={i} className="video-container">
                    <iframe src={v} title={`${d.title} video ${i+1}`} className="disaster-video" allowFullScreen></iframe>
                  </div>
                ))}
              </div>
            ) : null}
            
            <div className="disaster-content">
              <div className="content-card">
                <h3 className="content-title">Safety Tips</h3>
                <ul className="content-list">
                  {d.tips?.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
              <div className="content-card">
                <h3 className="content-title">Response Procedures</h3>
                <ul className="content-list">
                  {d.response?.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}


