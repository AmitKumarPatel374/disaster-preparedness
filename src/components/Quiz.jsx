// src/components/Quiz.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { saveQuizResult } from '../utils/idb'

// Using shared IndexedDB helper from utils/idb

export default function Quiz({ quizId, quizFile }) {
  const params = useParams()
  const effectiveQuizFile = quizFile || params.quizFile || 'earthquake.json'
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false) // prevent double saves

  useEffect(() => {
    (async () => {
      try {
        // Prefer admin-provided LocalStorage override if present
        let data
        try {
          const overrides = JSON.parse(localStorage.getItem('des_custom_quizzes') || '{}')
          if (overrides && overrides[effectiveQuizFile]) data = overrides[effectiveQuizFile]
        } catch {}
        if (!data) {
          const res = await fetch(`/data/quizzes/${effectiveQuizFile}`)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          data = await res.json()
        }
        setQuiz(data)
      } catch (err) {
        console.error('Error loading quiz', err)
      }
    })()
  }, [effectiveQuizFile])

  const handleAnswer = async (choiceIndex) => {
    if (!quiz) return
    if (saving) return // avoid double clicks during save

    const currentQ = quiz.questions[current]
    const isCorrect = choiceIndex === currentQ.answer

    // compute new score synchronously (avoid relying on state update timing)
    const newScore = score + (isCorrect ? 1 : 0)
    setScore(newScore)

    // move to next or finish
    if (current + 1 < quiz.questions.length) {
      setCurrent(prev => prev + 1)
    } else {
      setFinished(true)
      // save to IndexedDB with correct final score
      try {
        setSaving(true)
        const record = {
          quizId: quiz.id,
          score: newScore,
          total: quiz.questions.length,
          date: new Date().toISOString()
        }
        await saveQuizResult(record)
      } catch (err) {
        console.error('Error saving quiz result', err)
      } finally {
        setSaving(false)
      }
    }
  }

  if (!quiz) return <div className="card">Loading quiz...</div>

  if (finished) {
    return (
      <div className="card" style={{background:'#ecfdf5', border:'1px solid #a7f3d0'}}>
        <h2 style={{fontWeight:700, fontSize:18}}>Quiz Complete!</h2>
        <p>आपका स्कोर: {score} / {quiz.questions.length}</p>
        <p>बहुत अच्छा! आपने Disaster Preparedness में एक कदम और आगे बढ़ाया।</p>
      </div>
    )
  }

  const q = quiz.questions[current]

  return (
    <div className="card">
      <h2 style={{fontWeight:700, marginBottom:8}}>{quiz.title}</h2>
      <p style={{marginBottom:12}}>Q{current + 1}. {q.q}</p>
      <div className="options" style={{display:'flex',flexDirection:'column',gap:8}}>
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className=""
            style={{display:'block', width:'100%', padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8}}
            disabled={saving}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
