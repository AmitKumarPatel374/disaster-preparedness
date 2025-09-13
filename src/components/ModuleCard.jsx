// src/components/ModuleCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function ModuleCard({ title, description, icon = "📘", path = "/" }) {
    return (
        <div className="card module-card">
            <div className="module-content">
                <div className="module-icon">{icon}</div>
                <h3 className="module-title">{title}</h3>
                <p className="module-description">{description}</p>
            </div>
            <div className="module-action">
                <Link to={path} className="btn module-btn">
                    Start Learning
                </Link>
            </div>
        </div>
    )
}
