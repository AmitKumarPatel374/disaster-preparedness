import React, { useEffect, useState } from "react"
import { getSession } from "../utils/auth"
import { loadContacts } from "../utils/alerts"

export default function SOSButton() {
  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState(null)
  const [region, setRegion] = useState({ state:'', district:'' })

  useEffect(() => {
    (async () => {
      const session = getSession() || {}
      setRegion({ state: session.state || '', district: session.district || '' })
      try {
        const data = await loadContacts()
        const found = data?.IN?.[session.state]?.[session.district]
        setContacts(found || null)
      } catch {
        setContacts(null)
      }
    })()
  }, [])

  return (
    <>
      <button onClick={()=> setOpen(true)} className="btn" style={{position:'fixed', right:20, bottom:20, borderRadius:9999, padding:'12px 16px', boxShadow:'var(--shadow-lg)', background:'#dc2626'}}>
        SOS
      </button>
      {open && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.35)'}} onClick={()=> setOpen(false)}>
          <div className="card" style={{maxWidth:420, margin:'10% auto', background:'#fff', padding:16}} onClick={(e)=> e.stopPropagation()}>
            <h3 style={{marginTop:0, fontWeight:800}}>Emergency Contacts</h3>
            {!contacts ? (
              <p className="page-subtle">No contacts found for {region.state || 'your state'}, {region.district || 'your district'}. Please ensure your profile has correct region.</p>
            ) : (
              <div style={{display:'grid', gap:8}}>
                <a className="btn" href={`tel:${contacts.police}`}>Call Police ({contacts.police})</a>
                <a className="btn" href={`tel:${contacts.ambulance}`}>Call Ambulance ({contacts.ambulance})</a>
                <a className="btn" href={`tel:${contacts.disaster}`}>Call Disaster Helpline ({contacts.disaster})</a>
              </div>
            )}
            <div style={{marginTop:12, textAlign:'right'}}>
              <button className="btn" onClick={()=> setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


