import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  return (
    <>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="admin-stat-card purple">
          <div className="stat-icon purple"><i className="fa-solid fa-users"></i></div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="admin-stat-card green">
          <div className="stat-icon green"><i className="fa-solid fa-user"></i></div>
          <div className="stat-value">{users.filter(u => u.role === 'CUSTOMER').length}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="admin-stat-card orange">
          <div className="stat-icon orange"><i className="fa-solid fa-user-shield"></i></div>
          <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Users <span style={{ color: '#6366f1', fontSize: 14 }}>({filtered.length})</span></h3>
          <div className="admin-search-wrap">
            <i className="fa-solid fa-search"></i>
            <input
              className="admin-search"
              placeholder="Search users…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="admin-empty">
                    <i className="fa-solid fa-users"></i>
                    <p>No users found.</p>
                  </div>
                </td></tr>
              ) : filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: user.role === 'ADMIN'
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'linear-gradient(135deg, #0f766e, #14b8a6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 15, color: '#fff',
                    }}>
                      {user.name[0]?.toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>ID: #{user.id}</div>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'ADMIN' ? 'admin' : 'customer'}`}>
                      {user.role === 'ADMIN' ? '👑 Admin' : '🧑 Customer'}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
