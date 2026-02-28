import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield } from 'lucide-react';
import '../../styles/pages/AdminUsers.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'staff' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ramesh Kumar',
      email: 'ramesh@village.local',
      role: 'admin',
      status: 'active',
      joinDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'Priya Singh',
      email: 'priya@village.local',
      role: 'staff',
      status: 'active',
      joinDate: '2025-02-01',
    },
    {
      id: '3',
      name: 'Vikram Patel',
      email: 'vikram@village.local',
      role: 'citizen',
      status: 'active',
      joinDate: '2025-02-10',
    },
    {
      id: '4',
      name: 'Anjali Gupta',
      email: 'anjali@village.local',
      role: 'citizen',
      status: 'inactive',
      joinDate: '2025-01-20',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'citizen' as const });

  const handleAddUser = () => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'citizen' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
      )
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#FF9800';
      case 'staff':
        return '#2196F3';
      case 'citizen':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>
          <Users size={28} />
          User Management
        </h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} />
          Add New User
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <h2>Add New User</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}>
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleAddUser}>
              Add User
            </button>
            <button className="btn-cancel" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.status === 'inactive' ? 'inactive' : ''}>
                <td>
                  <div className="user-name">
                    <div className="avatar">{user.name.charAt(0)}</div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge" style={{ color: getRoleColor(user.role) }}>
                    <Shield size={14} />
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>{user.status.toUpperCase()}</span>
                </td>
                <td>{user.joinDate}</td>
                <td className="action-buttons">
                  <button
                    className="btn-status"
                    onClick={() => toggleUserStatus(user.id)}
                    title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {user.status === 'active' ? '✓' : '○'}
                  </button>
                  <button className="btn-edit" title="Edit user">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)} title="Delete user">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="users-stats">
        <div className="stat">
          <p className="stat-label">Total Users</p>
          <p className="stat-value">{users.length}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Active Users</p>
          <p className="stat-value">{users.filter((u) => u.status === 'active').length}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Administrators</p>
          <p className="stat-value">{users.filter((u) => u.role === 'admin').length}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Staff Members</p>
          <p className="stat-value">{users.filter((u) => u.role === 'staff').length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
