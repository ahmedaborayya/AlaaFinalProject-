import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin/Admin.css';

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'fa-gauge-high' },
  { id: 'products',   label: 'Products',   icon: 'fa-boxes-stacked' },
  { id: 'categories', label: 'Categories', icon: 'fa-tags' },
  { id: 'orders',     label: 'Orders',     icon: 'fa-receipt' },
  { id: 'users',      label: 'Users',      icon: 'fa-users' },
];

export default function AdminLayout({ children, activePage, setActivePage }) {
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem('userToken');
    navigate('/login');
  }

  // Decode user name from token
  let adminName = 'Admin';
  try {
    const payload = JSON.parse(atob(localStorage.getItem('userToken').split('.')[1]));
    adminName = payload.email?.split('@')[0] || 'Admin';
  } catch {}

  return (
    <div className="admin-wrapper">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">🛒</div>
            <div>
              <h2>ShopAdmin</h2>
              <span>Control Panel</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">Main Menu</p>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-signout-btn" onClick={handleSignOut}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <h1>{navItems.find(n => n.id === activePage)?.label || 'Dashboard'}</h1>
            <p className="admin-topbar-subtitle">Manage your store</p>
          </div>
          <div className="admin-user-pill">
            <div className="admin-user-avatar">{adminName[0]?.toUpperCase()}</div>
            <div>
              <div className="admin-user-name">{adminName}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
