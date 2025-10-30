interface UserProfileProps {
  userName: string
  onLogout: () => void
}

export default function UserProfile({ userName, onLogout }: UserProfileProps) {
  return (
    <div className="user-profile">
      <div className="profile-content">
        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="profile-name">{userName}</span>
      </div>
      <button className="btn-logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}
