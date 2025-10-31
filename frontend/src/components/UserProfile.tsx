import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface UserProfileProps {
  userName: string
  onLogout: () => void
}

export default function UserProfile({ userName, onLogout }: UserProfileProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  return (
    <>
      <div className="user-profile">
        <div className="profile-content">
          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name">{userName}</span>
        </div>
        <button className="btn-logout" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal
          title="Logout"
          message={`Are you sure you want to logout? You'll need to login again to access your tasks.`}
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
          isDangerous={true}
        />
      )}
    </>
  )
}
