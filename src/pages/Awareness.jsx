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
    <div>
      <h1 className="page-title">Disaster Awareness</h1>
      {/* Controls */}
      <div className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
        <input placeholder="Search disasters, tips or responses..." value={query} onChange={(e)=> setQuery(e.target.value)} style={{flex:1}} />
        <button className="btn" onClick={resetLocal}>Reset to defaults</button>
      </div>

      {/* Table of contents */}
      <div className="card" style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        {filtered.map(d => (
          <a key={d.id} href={`#${d.id}`} className="btn" style={{padding:'8px 12px', borderRadius:10}}>{d.title}</a>
        ))}
      </div>

      <div className="grid">
        {filtered.map(d => (
          <section key={d.id} className="card">
            <h2 id={d.id} style={{marginTop:0, fontWeight:800}}>{d.title}</h2>
            <p className="page-subtle">{d.overview}</p>
            {d.images?.length ? (
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
                {d.images.map((src, i) => (
                  <img key={i} src={src} alt={d.title} style={{maxWidth:240, borderRadius:10, border:'1px solid var(--border)'}} />
                ))}
              </div>
            ) : null}
            {d.videos?.length ? (
              <div style={{marginTop:12}}>
                {d.videos.map((v, i) => (
                  <div key={i} style={{position:'relative',paddingTop:'56.25%',marginBottom:8, borderRadius:10, overflow:'hidden'}}>
                    <iframe src={v} title={`${d.title} video ${i+1}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',border:0}} allowFullScreen></iframe>
                  </div>
                ))}
              </div>
            ) : null}
            <div style={{display:'grid', gap:8, marginTop:8}}>
              <div className="card" style={{margin:0}}>
                <h3 style={{marginTop:0, fontWeight:700}}>Safety Tips</h3>
                <ul style={{margin:0, paddingLeft:18}}>
                  {d.tips?.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
              <div className="card" style={{margin:0}}>
                <h3 style={{marginTop:0, fontWeight:700}}>Response Procedures</h3>
                <ul style={{margin:0, paddingLeft:18}}>
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


