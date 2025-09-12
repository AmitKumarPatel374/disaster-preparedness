// src/components/ModuleCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function ModuleCard({ title, description, icon = "📘", path = "/" }) {
    return (
        <div className="card" style={{borderRadius:16, padding:20}}>
            <div>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 style={{fontWeight:800, fontSize:18, marginBottom:8}}>{title}</h3>
                <p className="page-subtle" style={{fontSize:14, lineHeight:1.6}}>{description}</p>
            </div>
            <div className="mt-4">
                <Link
                    to={path}
                    className="btn"
                    style={{display:'inline-block', padding:'10px 14px', borderRadius:10}}
                >
                    Start Learning
                </Link>
            </div>
        </div>
    )
}
