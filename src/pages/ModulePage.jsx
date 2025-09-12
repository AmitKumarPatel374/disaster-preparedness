// src/pages/ModulePage.jsx
import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function ModulePage() {
    const { moduleId } = useParams() // URL से moduleId लेगा (earthquake, flood, fire)
    const [moduleData, setModuleData] = useState(null)

    useEffect(() => {
        // modules.json से data fetch करेंगे
        fetch("/data/modules.json")
            .then(res => res.json())
            .then(data => {
                const found = data.find(m => m.id === moduleId)
                setModuleData(found)
            })
            .catch(err => console.error("Error loading module data:", err))
    }, [moduleId])

    if (!moduleData) {
        return <div>Loading module...</div>
    }

    return (
        <div>
            <h1 className="page-title">{moduleData.title}</h1>
            <p className="page-subtle" style={{marginBottom:16}}>{moduleData.description}</p>

            {/* Learning Content */}
            <div className="card" style={{marginBottom:16}}>
                <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Learning Material</h2>
                <ul style={{color:'#4b5563',paddingLeft:18,margin:0}}>
                    {moduleData.content.map((point, index) => (
                        <li key={index} style={{marginBottom:4}}>{point}</li>
                    ))}
                </ul>
            </div>

            {/* Quizzes List */}
            <div className="card">
                <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Available Quizzes</h2>
                {moduleData.quizzes.length > 0 ? (
                    <ul style={{display:'grid',gap:8,padding:0,listStyle:'none'}}>
                        {moduleData.quizzes.map((quiz, index) => (
                            <li key={index}>
                                <Link
                                    to={`/quiz/${quiz.file}`}
                                    className=""
                                    style={{display:'block',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8}}
                                >
                                    {quiz.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="page-subtle">No quizzes available for this module.</p>
                )}
            </div>
        </div>
    )
}
