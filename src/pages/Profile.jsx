import React, { useState, useEffect } from 'react'
import { useSession } from '../hooks/useSession'
import { logout } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { readJSON, writeJSON, StorageKeys } from '../utils/storage'

export default function Profile() {
  const session = useSession()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [profileData, setProfileData] = useState({
    name: session?.name || '',
    email: session?.email || '',
    phone: session?.phone || '',
    state: session?.state || '',
    district: session?.district || '',
    role: session?.role || ''
  })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    emergencyAlerts: true,
    weeklyDigest: false,
    disasterUpdates: true
  })
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    locationSharing: true,
    dataCollection: true,
    analytics: false
  })

  // Load settings from storage on component mount
  useEffect(() => {
    const savedNotificationSettings = readJSON('des_notification_settings', null)
    if (savedNotificationSettings) {
      setNotificationSettings(savedNotificationSettings)
    }
    
    const savedPrivacySettings = readJSON('des_privacy_settings', null)
    if (savedPrivacySettings) {
      setPrivacySettings(savedPrivacySettings)
    }
  }, [])

  if (!session) return <div className="card">Not signed in.</div>

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // Here you would typically save the profile data
    setIsEditing(false)
    // For now, just update the local state
  }

  const handleCancel = () => {
    setProfileData({
      name: session?.name || '',
      email: session?.email || '',
      phone: session?.phone || '',
      state: session?.state || '',
      district: session?.district || '',
      role: session?.role || ''
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  // Modal handlers
  const openModal = (modalType) => {
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
    // Reset form data when closing modals
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setIsChangingPassword(false)
  }

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setIsChangingPassword(true)
    
    try {
      // Validate current password
      if (!passwordData.currentPassword) {
        setPasswordError('Please enter your current password!')
        return
      }
      
      // Get users from storage to validate current password
      const users = readJSON(StorageKeys.Users, [])
      const currentUser = users.find(u => u.email === session.email)
      
      if (!currentUser) {
        setPasswordError('Current password is incorrect!')
        return
      }
      
      if (currentUser.password !== passwordData.currentPassword) {
        setPasswordError('Current password is incorrect!')
        return
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match!')
        return
      }
      
      if (passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long!')
        return
      }
      
      if (passwordData.currentPassword === passwordData.newPassword) {
        setPasswordError('New password must be different from current password!')
        return
      }
      
      // Update password in users array
      const updatedUsers = users.map(u => 
        u.email === session.email 
          ? { ...u, password: passwordData.newPassword }
          : u
      )
      
      // Save updated users back to storage
      writeJSON(StorageKeys.Users, updatedUsers)
      
      // Success - reset form and close modal
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordError('')
      closeModal()
      
      // Show success message
      alert('Password changed successfully!')
      
    } catch (error) {
      setPasswordError('An error occurred while changing password. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Notification settings handlers
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleNotificationSave = () => {
    // Save notification settings to storage
    writeJSON('des_notification_settings', notificationSettings)
    alert('Notification settings saved!')
    closeModal()
  }

  // Privacy settings handlers
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handlePrivacySave = () => {
    // Save privacy settings to storage
    writeJSON('des_privacy_settings', privacySettings)
    alert('Privacy settings saved!')
    closeModal()
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return '👑'
      case 'student': return '🎓'
      case 'teacher': return '👨‍🏫'
      default: return '👤'
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span className="avatar-initials">{getInitials(profileData.name)}</span>
          </div>
          <div className="avatar-status online"></div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {profileData.name || 'User Name'}
            <span className="profile-role-badge">
              {getRoleIcon(profileData.role)} {profileData.role || 'User'}
            </span>
          </h1>
          <p className="profile-email">{profileData.email}</p>
          <p className="profile-location">
            📍 {profileData.district || 'District'}, {profileData.state || 'State'}
          </p>
        </div>
        <div className="profile-actions">
          <button 
            className="btn btn-primary"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? '💾 Save' : '✏️ Edit Profile'}
          </button>
          {isEditing && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              ❌ Cancel
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label className="info-label">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="info-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              ) : (
                <span className="info-value">{profileData.name || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label className="info-label">Email Address</label>
              <span className="info-value">{profileData.email}</span>
            </div>
            
            <div className="info-item">
              <label className="info-label">Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  className="info-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              ) : (
                <span className="info-value">{profileData.phone || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label className="info-label">State</label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="info-input"
                  value={profileData.state}
                  onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                />
              ) : (
                <span className="info-value">{profileData.state || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label className="info-label">District</label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="info-input"
                  value={profileData.district}
                  onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                />
              ) : (
                <span className="info-value">{profileData.district || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-item">
              <label className="info-label">Account Type</label>
              <span className="info-value role-value">
                {getRoleIcon(profileData.role)} {profileData.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Account Actions</h2>
          <div className="action-grid">
            <button className="action-btn primary" onClick={() => openModal('password')}>
              <span className="action-icon">🔒</span>
              <span className="action-text">Change Password</span>
            </button>
            <button className="action-btn secondary" onClick={() => openModal('notifications')}>
              <span className="action-icon">🔔</span>
              <span className="action-text">Notification Settings</span>
            </button>
            <button className="action-btn secondary" onClick={() => openModal('privacy')}>
              <span className="action-icon">🌐</span>
              <span className="action-text">Privacy Settings</span>
            </button>
            <button className="action-btn danger" onClick={handleLogout}>
              <span className="action-icon">🚪</span>
              <span className="action-text">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {activeModal === 'password' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              {passwordError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {passwordError}
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                  disabled={isChangingPassword}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  minLength="6"
                  required
                  disabled={isChangingPassword}
                />
                <small className="form-hint">Must be at least 6 characters long</small>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  minLength="6"
                  required
                  disabled={isChangingPassword}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {activeModal === 'notifications' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Notification Settings</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Email Notifications</h4>
                    <p className="setting-description">Receive updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Push Notifications</h4>
                    <p className="setting-description">Receive browser notifications</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Emergency Alerts</h4>
                    <p className="setting-description">Critical emergency notifications</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emergencyAlerts}
                      onChange={() => handleNotificationChange('emergencyAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Weekly Digest</h4>
                    <p className="setting-description">Weekly summary of activities</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyDigest}
                      onChange={() => handleNotificationChange('weeklyDigest')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Disaster Updates</h4>
                    <p className="setting-description">Updates about disasters in your area</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.disasterUpdates}
                      onChange={() => handleNotificationChange('disasterUpdates')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleNotificationSave}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Privacy Settings</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Profile Visibility</h4>
                    <p className="setting-description">Who can see your profile information</p>
                  </div>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="form-select"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Location Sharing</h4>
                    <p className="setting-description">Share your location for emergency services</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.locationSharing}
                      onChange={() => handlePrivacyChange('locationSharing', !privacySettings.locationSharing)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Data Collection</h4>
                    <p className="setting-description">Allow collection of usage data for improvement</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.dataCollection}
                      onChange={() => handlePrivacyChange('dataCollection', !privacySettings.dataCollection)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">Analytics</h4>
                    <p className="setting-description">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.analytics}
                      onChange={() => handlePrivacyChange('analytics', !privacySettings.analytics)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePrivacySave}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


