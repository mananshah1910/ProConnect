import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { professionals } from '../data';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalFavorites: 0,
    totalCategories: 0
  });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'professionals'

  useEffect(() => {
    // Check if user is admin
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin || !currentAdmin.isAdmin) {
      navigate('/signin');
      return;
    }
    setAdminUser(currentAdmin);

    // Load statistics
    loadStatistics();
    loadUsers();
  }, [navigate]);

  const loadStatistics = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const categories = [...new Set(professionals.map(p => p.category))];

    setStats({
      totalUsers: allUsers.length,
      totalProfessionals: professionals.length,
      totalFavorites: favorites.length,
      totalCategories: categories.length
    });
  };

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    navigate('/signin');
  };

  const handleDeleteUser = (userEmail) => {
    if (window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.filter(u => u.email !== userEmail);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadUsers();
      loadStatistics();
    }
  };

  if (!adminUser) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-user-info">
            <span className="admin-email">{adminUser.email}</span>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-nav-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users ({stats.totalUsers})
        </button>
        <button 
          className={activeTab === 'professionals' ? 'active' : ''} 
          onClick={() => setActiveTab('professionals')}
        >
          Professionals ({stats.totalProfessionals})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>System Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-value">{stats.totalProfessionals}</div>
                <div className="stat-label">Total Professionals</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{stats.totalFavorites}</div>
                <div className="stat-label">Total Favorites</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-value">{stats.totalCategories}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>

            <div className="system-info">
              <h3>System Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Platform:</strong> TalentCo
                </div>
                <div className="info-item">
                  <strong>Status:</strong> <span className="status-active">Active</span>
                </div>
                <div className="info-item">
                  <strong>Admin Access:</strong> Enabled
                </div>
                <div className="info-item">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Registered Users</h2>
            {users.length > 0 ? (
              <div className="users-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user.email)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No registered users found.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'professionals' && (
          <div className="professionals-section">
            <h2>All Professionals</h2>
            <div className="professionals-grid">
              {professionals.map(pro => (
                <div key={pro.id} className="professional-card">
                  <img src={pro.image} alt={pro.name} className="pro-avatar" />
                  <div className="pro-info">
                    <h3>{pro.name}</h3>
                    <p className="pro-category">{pro.category}</p>
                    <p className="pro-specialty">{pro.specialty}</p>
                    <div className="pro-rating">⭐ {pro.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

