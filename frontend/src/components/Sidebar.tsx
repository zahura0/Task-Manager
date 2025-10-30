import { useState } from 'react'
import '../styles/Dashboard.css'

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
}

const defaultTeamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', role: 'Designer', email: 'john@example.com' },
  { id: '2', name: 'Sarah Smith', role: 'Developer', email: 'sarah@example.com' },
  { id: '3', name: 'Mike Johnson', role: 'Project Manager', email: 'mike@example.com' }
]

export default function Sidebar() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers)
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' })
  const [showAddMember, setShowAddMember] = useState(false)

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMember.name && newMember.role && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        email: newMember.email
      }
      setTeamMembers([...teamMembers, member])
      setNewMember({ name: '', role: '', email: '' })
      setShowAddMember(false)
    }
  }

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>⚙️ Settings</h2>
      </div>

      {/* Project Settings Section */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Project Info</span>
        <div className="form-group">
          <label>Project Name</label>
          <input type="text" defaultValue="Task Management System" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea defaultValue="A collaborative task management dashboard to organize team work efficiently." />
        </div>
        <button className="sidebar-button secondary">Save</button>
      </div>

      <div className="sidebar-divider"></div>

      {/* Team Management Section */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Team Members ({teamMembers.length})</span>
        <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '12px' }}>
          {teamMembers.map(member => (
            <div key={member.id} className="team-member-item">
              <div className="team-member-info">
                <div className="team-member-name">{member.name}</div>
                <div className="team-member-role">{member.role}</div>
              </div>
              <button
                onClick={() => handleDeleteTeamMember(member.id)}
                className="sidebar-button secondary"
                style={{ width: 'auto', padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="sidebar-button primary"
          style={{ fontSize: '0.8rem' }}
        >
          {showAddMember ? '✕ Cancel' : '+ Add Member'}
        </button>

        {showAddMember && (
          <form onSubmit={handleAddTeamMember} style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                placeholder="e.g., Developer"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <button type="submit" className="sidebar-button primary">
              Add
            </button>
          </form>
        )}
      </div>

      <div className="sidebar-divider"></div>

      {/* Notification Settings */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Notifications</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            <span>Task Updates</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            <span>Team Messages</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            <span>Email Digest</span>
          </label>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Display Settings */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Display</span>
        <div className="form-group">
          <label>Theme</label>
          <select defaultValue="light">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="form-group">
          <label>Item Per Page</label>
          <select defaultValue="10">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Danger Zone */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Danger Zone</span>
        <button className="sidebar-button secondary" style={{ marginTop: '8px', background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }}>
          Clear All Data
        </button>
      </div>
    </aside>
  )
}
