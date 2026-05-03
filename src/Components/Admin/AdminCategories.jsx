import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const emptyForm = { name: '', slug: '', videoUrl: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null); // null = create, object = edit
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null); // id being deleted
  const [alert, setAlert]           = useState(null);

  async function fetchCategories() {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchCategories(); }, []);

  // ── Auto-generate slug from name (only in create mode) ─────────────
  function handleNameChange(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(f => ({ ...f, name, ...(editing ? {} : { slug }) }));
  }

  // ── Open create modal ───────────────────────────────────────────────
  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  }

  // ── Open edit modal ─────────────────────────────────────────────────
  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, videoUrl: cat.videoUrl || '' });
    setModal(true);
  }

  function closeModal() {
    setModal(false);
    setEditing(null);
    setForm(emptyForm);
  }

  // ── Save (create or update) ─────────────────────────────────────────
  async function handleSave() {
    if (!form.name || !form.slug) {
      setAlert({ type: 'error', msg: 'Name and slug are required.' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name:     form.name.trim(),
        slug:     form.slug.trim(),
        videoUrl: form.videoUrl.trim() || null,
      };

      if (editing) {
        await API.put(`/admin/categories/${editing.id}`, payload);
        setAlert({ type: 'success', msg: 'Category updated!' });
      } else {
        await API.post('/admin/categories', payload);
        setAlert({ type: 'success', msg: 'Category created!' });
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to save category.' });
    } finally { setSaving(false); }
  }

  // ── Delete ──────────────────────────────────────────────────────────
  async function handleDelete(cat) {
    const confirmed = window.confirm(
      `Delete "${cat.name}"?\n\nAll products in this category will be moved to "Uncategorized".`
    );
    if (!confirmed) return;

    setDeleting(cat.id);
    try {
      const { data } = await API.delete(`/admin/categories/${cat.id}`);
      setAlert({ type: 'success', msg: data.message || 'Category deleted.' });
      fetchCategories();
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Failed to delete category.' });
    } finally { setDeleting(null); }
  }

  if (loading) return <div className="admin-loading"><i className="fa fa-spinner fa-spin"></i></div>;

  return (
    <>
      {alert && (
        <div className={`admin-alert ${alert.type}`} onClick={() => setAlert(null)} style={{ cursor: 'pointer' }}>
          <i className={`fa-solid ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {alert.msg}
          <i className="fa-solid fa-xmark" style={{ marginLeft: 'auto' }}></i>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">
            Categories <span style={{ color: '#6366f1', fontSize: 14 }}>({categories.length})</span>
          </h3>
          <button className="btn-admin-primary" onClick={openCreate}>
            <i className="fa-solid fa-plus"></i> Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-tags"></i>
            <p>No categories yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Video</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ color: '#4a5568', fontSize: 13 }}>#{cat.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34,
                          background: 'rgba(99,102,241,0.12)',
                          borderRadius: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16,
                        }}>🏷️</div>
                        <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{cat.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6366f1',
                        background: 'rgba(99,102,241,0.1)', padding: '3px 8px', borderRadius: 6 }}>
                        /{cat.slug}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge customer">
                        {cat._count?.products ?? 0} products
                      </span>
                    </td>
                    <td>
                      {cat.videoUrl ? (
                        <a href={cat.videoUrl} target="_blank" rel="noreferrer"
                          style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                          <i className="fa-brands fa-youtube"></i> Video
                        </a>
                      ) : (
                        <span style={{ color: '#374151', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-admin-edit" onClick={() => openEdit(cat)}>
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                        <button
                          className="btn-admin-danger"
                          onClick={() => handleDelete(cat)}
                          disabled={deleting === cat.id}
                        >
                          {deleting === cat.id
                            ? <i className="fa fa-spinner fa-spin"></i>
                            : <i className="fa-solid fa-trash"></i>
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Create / Edit ─────────────────────────────────────── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? `Edit: ${editing.name}` : 'Add New Category'}</h3>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-grid">
                {/* Name */}
                <div className="admin-form-group full">
                  <label>Category Name *</label>
                  <input
                    placeholder="e.g. GPUs"
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="admin-form-group full">
                  <label>Slug *</label>
                  <input
                    placeholder="e.g. gpus"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  />
                  <span style={{ fontSize: 11, color: '#4a5568' }}>
                    Auto-generated from name. Used in URLs — lowercase, hyphens only.
                  </span>
                </div>

                {/* Video URL */}
                <div className="admin-form-group full">
                  <label>
                    <i className="fa-brands fa-youtube" style={{ color: '#ef4444', marginRight: 6 }}></i>
                    YouTube / Video URL (optional)
                  </label>
                  <input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  />
                  <span style={{ fontSize: 11, color: '#4a5568' }}>
                    Paste a YouTube link — it will be auto-embedded on the Categories page.
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="btn-admin-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>
                {saving
                  ? <><i className="fa fa-spinner fa-spin"></i> Saving…</>
                  : editing ? 'Update Category' : 'Create Category'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
