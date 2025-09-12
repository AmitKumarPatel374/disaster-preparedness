import React from 'react'
import ModuleCard from '../components/ModuleCard'
import Chatbot from '../components/Chatbot'

// Modules data (आप इसे अलग JSON file में भी रख सकते हैं)
const modules = [
    {
        id: "earthquake",
        title: "Earthquake Preparedness",
        description: "भूकंप के दौरान सुरक्षित रहने के तरीक़े जानें।",
        icon: "🌍",
        path: "/module/earthquake"
    },
    {
        id: "flood",
        title: "Flood Safety",
        description: "बाढ़ के समय क्या करें और क्या न करें।",
        icon: "🌊",
        path: "/module/flood"
    },
    {
        id: "fire",
        title: "Fire Safety",
        description: "आग लगने पर सुरक्षा उपाय और बचाव के तरीके।",
        icon: "🔥",
        path: "/module/fire"
    }
]

export default function Home() {
    return (
        <div>
            <h1 className="page-title">Disaster Preparedness Education</h1>
            <p className="page-subtle" style={{marginBottom:16}}>Choose a module to start learning.</p>
            <div className="grid grid-3">
                {modules.map((m) => (
                    <ModuleCard
                        key={m.id}
                        title={m.title}
                        description={m.description}
                        icon={m.icon}
                        path={m.path}
                    />
                ))}
            </div>
            <div style={{marginTop:20}}>
                <Chatbot />
            </div>
        </div>
    )
}
