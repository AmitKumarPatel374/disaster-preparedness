import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getStudentNotifications } from '../utils/notifications'

export default function DashboardStudent() {
  const session = useSession()
  const [notifs, setNotifs] = useState([])
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    completedSimulations: 0,
    awarenessModules: 0
  })

  const loadStats = () => {
    // Load user stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem('student_stats') || '{"completedQuizzes":0,"completedSimulations":0,"awarenessModules":0}')
    setStats(savedStats)
  }

  useEffect(() => { 
    setNotifs(getStudentNotifications())
    loadStats()
    
    // Listen for storage changes to update stats
    const handleStorageChange = () => {
      loadStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <div className="student-dashboard">
      <div className="dashboard-hero">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtle">Welcome back, {session?.email || 'Student'}! Ready to learn about disaster preparedness?</p>
        <div className="location-info">
          <span className="location-icon">📍</span>
          <span>{session?.district || 'District'}, {session?.state || 'State'}</span>
        </div>
        <button 
          onClick={loadStats}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: 'var(--primary-100)',
            color: 'var(--primary-700)',
            border: '1px solid var(--primary-200)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Refresh Stats
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedQuizzes}</div>
            <div className="stat-label">Quizzes Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedSimulations}</div>
            <div className="stat-label">Simulations Played</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-number">{stats.awarenessModules}</div>
            <div className="stat-label">Modules Studied</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/awareness" className="action-card primary">
            <div className="action-icon">📚</div>
            <div className="action-content">
              <h3 className="action-title">Disaster Awareness</h3>
              <p className="action-description">Learn about different types of disasters and safety procedures</p>
              <div className="action-badge">Educational</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/simulations" className="action-card secondary">
            <div className="action-icon">🎮</div>
            <div className="action-content">
              <h3 className="action-title">Simulations</h3>
              <p className="action-description">Practice emergency scenarios through interactive simulations</p>
              <div className="action-badge">Interactive</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/quiz/earthquake" className="action-card success">
            <div className="action-icon">🧠</div>
            <div className="action-content">
              <h3 className="action-title">Take Quiz</h3>
              <p className="action-description">Test your knowledge with disaster preparedness quizzes</p>
              <div className="action-badge">Assessment</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/profile" className="action-card info">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h3 className="action-title">Profile</h3>
              <p className="action-description">Manage your account settings and preferences</p>
              <div className="action-badge">Settings</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-section">
        <h2 className="section-title">Recent Notifications</h2>
        <div className="notifications-card">
          {notifs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p className="empty-text">No notifications yet</p>
              <p className="empty-subtext">You'll see important updates and alerts here</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifs.map(n => (
                <div key={n.id} className="notification-item">
                  <div className="notification-icon">
                    {n.type === 'alert' ? '🚨' : n.type === 'info' ? 'ℹ️' : '📢'}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{n.title}</div>
                    <div className="notification-body">{n.body}</div>
                    <div className="notification-meta">
                      {new Date(n.date).toLocaleString()} • {n.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-card">
          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <div className="activity-title">Studied Earthquake Safety</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🎮</div>
            <div className="activity-content">
              <div className="activity-title">Completed Fire Simulation</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🧠</div>
            <div className="activity-content">
              <div className="activity-title">Quiz: Flood Preparedness</div>
              <div className="activity-time">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


