import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  async function fetchCategories() {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchCategories(); }, []);

  // Auto-generate slug from name
  function handleNameChange(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm({ name, slug });
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      setAlert({ type: 'error', msg: 'Name and slug are required.' });
      return;
    }
    setSaving(true);
    try {
      await API.post('/admin/categories', form);
      setModal(false);
      setForm({ name: '', slug: '' });
      setAlert({ type: 'success', msg: 'Category created!' });
      fetchCategories();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to create category' });
    } finally { setSaving(false); }
  }

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  return (
    <>
      {alert && (
        <div className={`admin-alert ${alert.type}`}>
          <i className={`fa-solid ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {alert.msg}
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Categories <span style={{ color: '#6366f1', fontSize: 14 }}>({categories.length})</span></h3>
          <button className="btn-admin-primary" onClick={() => setModal(true)}>
            <i className="fa-solid fa-plus"></i> Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-tags"></i>
            <p>No categories yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, padding: 24 }}>
            {categories.map(cat => (
              <div key={cat.id} style={{
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 14,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 44, height: 44,
                  background: 'rgba(99,102,241,0.15)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>🏷️</div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: '#4a5568', fontFamily: 'monospace' }}>/{cat.slug}</div>
                <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>ID: #{cat.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Add New Category</h3>
              <button className="admin-modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label>Category Name *</label>
                  <input
                    placeholder="e.g. Electronics"
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="admin-form-group full">
                  <label>Slug *</label>
                  <input
                    placeholder="e.g. electronics"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                  />
                  <span style={{ fontSize: 11, color: '#4a5568' }}>Auto-generated from name. Used in URLs.</span>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-admin-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><i className="fa fa-spinner fa-spin"></i> Saving…</> : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
