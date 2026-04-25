import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, categories, orders, users] = await Promise.all([
          API.get('/products'),
          API.get('/categories'),
          API.get('/admin/orders'),
          API.get('/admin/users'),
        ]);
        setStats({
          products: products.data.length,
          categories: categories.data.length,
          orders: orders.data.length,
          users: users.data.length,
        });
        setRecentOrders(orders.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const revenue = recentOrders.reduce((sum, o) => sum + Number(o.totalPrice), 0);

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  const statCards = [
    { label: 'Total Products',    value: stats.products,   icon: 'fa-boxes-stacked', color: 'purple' },
    { label: 'Total Orders',      value: stats.orders,     icon: 'fa-receipt',       color: 'blue'   },
    { label: 'Total Users',       value: stats.users,      icon: 'fa-users',         color: 'green'  },
    { label: 'Categories',        value: stats.categories, icon: 'fa-tags',          color: 'orange' },
  ];

  const statusColor = { PENDING: 'pending', SHIPPED: 'shipped', DELIVERED: 'delivered' };

  return (
    <>
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {statCards.map(card => (
          <div key={card.label} className={`admin-stat-card ${card.color}`}>
            <div className={`stat-icon ${card.color}`}>
              <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Recent Orders</h3>
          <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 600 }}>
            {stats.orders} total
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#4a5568', padding: 40 }}>No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id}>
                  <td><span style={{ color: '#a5b4fc', fontWeight: 700 }}>#{order.id}</span></td>
                  <td>{order.user?.name || '—'}<br/><span style={{ fontSize: 11, color: '#4a5568' }}>{order.user?.email}</span></td>
                  <td>{order.orderItems?.length || 0} items</td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>{Number(order.totalPrice).toFixed(2)} EGP</td>
                  <td><span className={`status-badge ${statusColor[order.status] || 'pending'}`}>{order.status}</span></td>
                  <td style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
