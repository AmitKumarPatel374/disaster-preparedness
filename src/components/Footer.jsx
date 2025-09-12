import React from "react"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer">
        <p className="copyright">© {new Date().getFullYear()} Disaster Education. All rights reserved.</p>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Terms</a>
        </div>
      </div>
    </footer>
  )
}


