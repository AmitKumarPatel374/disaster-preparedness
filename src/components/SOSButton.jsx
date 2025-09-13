import React, { useEffect, useState } from "react"
import { useSession } from "../hooks/useSession"
import { loadContacts, getEmergencyContacts } from "../utils/alerts"

export default function SOSButton() {
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
        child_helpline: "1098",
        national_emergency: "112"
      })
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      // Force reload contacts data to avoid caching issues
      const data = await loadContacts()
      const emergencyContacts = getEmergencyContacts(data, currentSession.state, currentSession.district)
      
      // Force state update by creating new object
      setContacts({...emergencyContacts})
      console.log('Loaded emergency contacts for:', currentSession.state, currentSession.district, emergencyContacts)
    } catch (error) {
      console.error('Error loading emergency contacts:', error)
      // Set fallback contacts
      setContacts({
        police: "100",
        ambulance: "102",
        fire: "101", 
        disaster: "108",
        women_helpline: "1091",
        child_helpline: "1098",
        national_emergency: "112"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmergencyContacts(session)
  }, [session])

  const sosServices = [
    { key: 'national_emergency', label: 'SOS Helpline', icon: '🆘', color: 'var(--error)', number: '112' },
    { key: 'disaster', label: 'Disaster Helpline', icon: '🌪️', color: 'var(--info)', number: '108' }
  ]

  return (
    <>
      <button onClick={()=> setOpen(true)} className="btn sos-button">
        <span className="sos-icon">🆘</span>
        <span className="sos-text">SOS</span>
      </button>
      {open && (
        <div className="modal-overlay" onClick={()=> setOpen(false)}>
          <div className="modal-content emergency-modal" onClick={(e)=> e.stopPropagation()}>
            <div className="emergency-header">
              <h3 className="emergency-title">SOS Emergency</h3>
              <p className="emergency-location">
                {session?.state && session?.district 
                  ? `${session.district}, ${session.state}` 
                  : session?.state || 'Location not set'
                }
              </p>
            </div>
            
            <div className="sos-grid">
              {sosServices.map(service => (
                <a 
                  key={service.key}
                  href={`tel:${service.number}`}
                  className="sos-btn"
                  style={{'--btn-color': service.color}}
                >
                  <span className="sos-btn-icon">{service.icon}</span>
                  <div className="sos-btn-info">
                    <span className="sos-btn-label">{service.label}</span>
                    <span className="sos-btn-number">{service.number}</span>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="sos-info">
              <p className="sos-warning">
                ⚠️ <strong>Emergency Only:</strong> Use these numbers only in genuine emergency situations.
              </p>
            </div>
            
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


