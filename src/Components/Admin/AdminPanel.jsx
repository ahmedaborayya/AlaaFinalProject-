import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import './Admin.css';

export default function AdminPanel() {
  const [activePage, setActivePage] = useState('dashboard');

  const pages = {
    dashboard: <AdminDashboard />,
    products: <AdminProducts />,
    categories: <AdminCategories />,
    orders: <AdminOrders />,
    users: <AdminUsers />,
  };

  return (
    <>
      <Helmet><title>Admin Panel | ShopAdmin</title></Helmet>
      <AdminLayout activePage={activePage} setActivePage={setActivePage}>
        {pages[activePage]}
      </AdminLayout>
    </>
  );
}
