import React, { useEffect, useState } from 'react'
import { addNotification } from '../utils/notifications'

// Quizzes are stored under /public/data/quizzes/*.json for PWA caching
// This admin page manages a LocalStorage overlay which the Quiz component will prefer

const LS_KEY = 'des_custom_quizzes' // { [fileName]: quizJSON }

function readLS() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {} } catch { return {} } }
function writeLS(map) { localStorage.setItem(LS_KEY, JSON.stringify(map)) }

export default function AdminQuizzes() {
  const [list, setList] = useState([])
  const [map, setMap] = useState({})
  const [editing, setEditing] = useState({ file:'', content:'' })
  const [filter, setFilter] = useState('')

  useEffect(() => {
    (async () => {
      try {
        // Load modules to discover quizzes list
        const res = await fetch('/data/modules.json')
        const modules = await res.json()
        const files = []
        modules.forEach(m => (m.quizzes||[]).forEach(q => files.push({ module:m.id, title:q.title, file:q.file })))
        setList(files)
      } catch { setList([]) }
      setMap(readLS())
    })()
  }, [])

  const openQuiz = async (file) => {
    try {
      const custom = readLS()[file]
      if (custom) {
        setEditing({ file, content: JSON.stringify(custom, null, 2) })
        return
      }
      const res = await fetch(`/data/quizzes/${file}`, { cache:'no-cache' })
      const data = await res.json()
      setEditing({ file, content: JSON.stringify(data, null, 2) })
    } catch (e) {
      setEditing({ file, content: JSON.stringify({ id:'custom-quiz', title:'New Quiz', questions:[{ q:'Example question?', options:['Option A','Option B','Option C','Option D'], answer:0 }] }, null, 2) })
    }
  }

  const saveQuiz = () => {
    try {
      const filename = (editing.file || 'new-quiz.json').endsWith('.json') ? (editing.file || 'new-quiz.json') : `${editing.file}.json`
      const content = (editing.content && editing.content.trim().length) ? editing.content : JSON.stringify({ id:'custom-quiz', title:'New Quiz', questions:[{ q:'Example question?', options:['A','B','C','D'], answer:0 }] }, null, 2)
      const parsed = JSON.parse(content)
      if (!parsed || !parsed.title || !Array.isArray(parsed.questions)) throw new Error('Quiz must include title and questions[]')
      const prev = readLS()
      const wasExisting = Boolean(prev[filename])
      const next = { ...prev, [filename]: parsed }
      writeLS(next)
      setMap(next)
      setEditing({ file: filename, content: JSON.stringify(parsed, null, 2) })
      alert('Saved. Students will load this custom quiz offline or online.')
      addNotification({ type: wasExisting ? 'quiz:update' : 'quiz:new', title: wasExisting ? 'Quiz Updated' : 'New Quiz Available', body: `${parsed.title || filename} is now available.`, target:'all' })
    } catch (e) {
      alert(`Invalid JSON. ${e.message}`)
    }
  }

  const removeCustom = (file) => {
    const next = { ...readLS() }
    delete next[file]
    writeLS(next)
    setMap(next)
    if (editing.file === file) setEditing({ file:'', content:'' })
  }

  const filtered = list.filter(q => !filter || q.module.includes(filter) || q.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1 className="page-title">Manage Quizzes</h1>
      <div className="card" style={{display:'flex', gap:8, alignItems:'center'}}>
        <input placeholder="Filter by module or title..." value={filter} onChange={(e)=> setFilter(e.target.value)} style={{flex:1}} />
        <button className="btn" onClick={()=> setEditing({ file:'new-quiz.json', content: JSON.stringify({ id:'custom-quiz', title:'New Quiz', questions:[{ q:'Example question?', options:['Option A','Option B','Option C','Option D'], answer:0 }] }, null, 2) })}>New Quiz</button>
      </div>
      <div className="grid">
        <div className="card">
          <h3 style={{marginTop:0}}>Available Quizzes</h3>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {filtered.map(q => (
              <li key={q.file} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontWeight:700}}>{q.title}</div>
                  <div className="page-subtle">{q.module} — {q.file}</div>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={()=> openQuiz(q.file)}>Edit</button>
                  {map[q.file] && <button className="btn" onClick={()=> removeCustom(q.file)}>Remove Override</button>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 style={{marginTop:0}}>Editor {editing.file && `— ${editing.file}`}</h3>
          <input value={editing.file} onChange={(e)=> setEditing(prev => ({...prev, file: e.target.value}))} placeholder="Filename e.g. earthquake.json" />
          <textarea value={editing.content} onChange={(e)=> setEditing(prev => ({...prev, content:e.target.value}))} placeholder="Quiz JSON" style={{width:'100%', minHeight:360, fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace'}} />
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button className="btn" onClick={saveQuiz}>Save</button>
            <button className="btn" onClick={()=> { try { const p = JSON.parse(editing.content||'{}'); setEditing(prev => ({...prev, content: JSON.stringify(p, null, 2)})) } catch(e){ alert(`Invalid JSON: ${e.message}`) } }}>Format JSON</button>
            <button className="btn" onClick={()=> setEditing({ file:'', content:'' })}>Clear</button>
          </div>
          <p className="page-subtle" style={{marginTop:8}}>Note: Saved overrides are stored in LocalStorage and used by students’ Quiz loader.</p>
        </div>
      </div>
    </div>
  )
}


