import React, { useEffect, useState } from "react"
import { useSession } from "../hooks/useSession"
import { loadContacts, getEmergencyContacts } from "../utils/alerts"

export default function EmergencyContacts() {
  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState(null)
  const [loading, setLoading] = useState(true)
  const session = useSession()

  const loadEmergencyContacts = async (currentSession) => {
    if (!currentSession) {
      setContacts({
        police: "100",
        ambulance: "102",
        fire: "101", 
        disaster: "108",
        women_helpline: "1091",
        child_helpline: "1098"
      })
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      const data = await loadContacts()
      const emergencyContacts = getEmergencyContacts(data, currentSession.state, currentSession.district)
      setContacts({...emergencyContacts})
      console.log('Loaded emergency contacts for:', currentSession.state, currentSession.district, emergencyContacts)
    } catch (error) {
      console.error('Error loading emergency contacts:', error)
      setContacts({
        police: "100",
        ambulance: "102",
        fire: "101", 
        disaster: "108",
        women_helpline: "1091",
        child_helpline: "1098"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmergencyContacts(session)
  }, [session])

  const emergencyServices = [
    { key: 'police', label: 'Police', icon: '🚔', color: 'var(--primary-600)' },
    { key: 'ambulance', label: 'Ambulance', icon: '🚑', color: 'var(--error)' },
    { key: 'fire', label: 'Fire Brigade', icon: '🚒', color: 'var(--warning)' },
    { key: 'disaster', label: 'Disaster Helpline', icon: '🌪️', color: 'var(--info)' },
    { key: 'women_helpline', label: 'Women Helpline', icon: '👩', color: 'var(--success)' },
    { key: 'child_helpline', label: 'Child Helpline', icon: '👶', color: 'var(--primary-500)' }
  ]

  return (
    <>
      <button onClick={()=> setOpen(true)} className="btn emergency-contacts-btn">
        <span className="emergency-icon">🚨</span>
        <span className="emergency-text">Emergency Contacts</span>
      </button>
      {open && (
        <div className="modal-overlay" onClick={()=> setOpen(false)}>
          <div className="modal-content emergency-modal" onClick={(e)=> e.stopPropagation()}>
            <div className="emergency-header">
              <h3 className="emergency-title">Emergency Contacts</h3>
              <p className="emergency-location">
                {session?.state && session?.district 
                  ? `${session.district}, ${session.state}` 
                  : session?.state || 'Location not set'
                }
              </p>
              <button 
                className="refresh-btn"
                onClick={() => loadEmergencyContacts(session)}
                disabled={loading}
                title="Refresh emergency contacts"
              >
                {loading ? '⟳' : '↻'} Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading emergency contacts...</p>
              </div>
            ) : contacts ? (
              <div className="emergency-grid">
                {emergencyServices.map(service => (
                  <a 
                    key={service.key}
                    href={`tel:${contacts[service.key] || '100'}`}
                    className="emergency-btn"
                    style={{'--btn-color': service.color}}
                  >
                    <span className="emergency-icon">{service.icon}</span>
                    <div className="emergency-info">
                      <span className="emergency-label">{service.label}</span>
                      <span className="emergency-number">{contacts[service.key] || '100'}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="error-state">
                <p className="error-message">
                  Unable to load emergency contacts. Please try again or call 100 for immediate help.
                </p>
                <a href="tel:100" className="btn emergency-fallback">
                  Call 100 (Police)
                </a>
              </div>
            )}
            
            <div className="emergency-footer">
              <button className="btn btn-secondary" onClick={()=> setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
