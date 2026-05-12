import React, { useState, useEffect } from 'react';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users?limit=1000', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.users) {
            const formattedUsers = data.data.users
              .filter((user: any) => user && user._id)
              .map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.isActive ? 'active' : 'inactive',
                joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              }));
            setUsers(formattedUsers);
          }
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', village: '', role: 'citizen' as const });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleAddUser = async () => {
    // Validate fields
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.password || formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    if (!formData.village.trim()) errors.village = 'Village is required';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          village: formData.village,
        }),
      });
      if (response.ok) {
        setFormData({ name: '', email: '', password: '', phone: '', village: '', role: 'citizen' });
        setFormErrors({});
        setShowAddForm(false);
        // Refresh user list
        const usersRes = await fetch('/api/users?limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const data = await usersRes.json();
          if (data.success && data.data?.users) {
            const formattedUsers = data.data.users
              .filter((user: any) => user && user._id)
              .map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.isActive ? 'active' : 'inactive',
                joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              }));
            setUsers(formattedUsers);
          }
        }
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to add user');
      }
    } catch (err) {
      alert('Error adding user');
      console.error(err);
    }
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
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit phone number"
            />
            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Village</label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              placeholder="Enter village name"
            />
            {formErrors.village && <span className="error-message">{formErrors.village}</span>}
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
