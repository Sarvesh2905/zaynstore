import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CrudManager.css';

const API = 'https://zaynstore.onrender.com';

const EMPTY_FORM = { name: '', price: '', description: '', image: '', category: '', brand: '', sizes: '', rating: '' };

function CrudManager() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rating: form.rating ? Number(form.rating) : undefined,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editingId) {
        await authFetch(`${API}/product/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showMsg('success', 'Product updated!');
        setEditingId(null);
      } else {
        await authFetch(`${API}/upload`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showMsg('success', 'Product created!');
      }
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) {
      showMsg('error', err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || '',
      price: p.price || '',
      description: p.description || '',
      image: p.image || '',
      category: p.category || '',
      brand: p.brand || '',
      sizes: (p.sizes || []).join(', '),
      rating: p.rating || '',
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await authFetch(`${API}/product/${id}`, { method: 'DELETE' });
    showMsg('success', 'Product deleted.');
    fetchProducts();
  };

  const handleSeed = async () => {
    if (!window.confirm('This will reset all products. Continue?')) return;
    setSeeding(true);
    const res = await authFetch(`${API}/seed`, { method: 'POST' });
    const data = await res.json();
    showMsg('success', data.message || 'Seeded!');
    fetchProducts();
    setSeeding(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container crud-page">
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Admin Panel</h1>
            <p className="crud-sub">Manage your product catalogue</p>
          </div>
          <button className="btn btn-secondary crud-seed-btn" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding…' : '🌱 Seed 20 Products'}
          </button>
        </div>

        {msg.text && (
          <div className={`crud-msg crud-msg--${msg.type}`}>{msg.text}</div>
        )}

        {/* Form */}
        <div className="crud-form-card">
          <h2 className="crud-form-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form className="crud-form" onSubmit={handleSubmit}>
            <div className="crud-form-grid">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Classic Shirt" required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input name="price" className="form-input" type="number" value={form.price} onChange={handleChange} placeholder="999" required />
              </div>
              <div className="form-group crud-full">
                <label className="form-label">Description</label>
                <input name="description" className="form-input" value={form.description} onChange={handleChange} placeholder="Product description…" />
              </div>
              <div className="form-group crud-full">
                <label className="form-label">Image URL</label>
                <input name="image" className="form-input" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/…" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input name="category" className="form-input" value={form.category} onChange={handleChange} placeholder="Shirts" />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input name="brand" className="form-input" value={form.brand} onChange={handleChange} placeholder="ZAYN" />
              </div>
              <div className="form-group">
                <label className="form-label">Sizes (comma-separated)</label>
                <input name="sizes" className="form-input" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input name="rating" className="form-input" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="4.5" />
              </div>
            </div>

            <div className="crud-form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="crud-list-header">
          <h2 className="crud-list-title">Products ({products.length})</h2>
        </div>

        <div className="crud-table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.image && (
                      <img src={p.image} alt={p.name} className="crud-thumb" />
                    )}
                  </td>
                  <td>
                    <span className="crud-prod-name">{p.name}</span>
                    {p.brand && <span className="crud-prod-brand">{p.brand}</span>}
                  </td>
                  <td><span className="crud-badge">{p.category || '—'}</span></td>
                  <td className="crud-price">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td>{p.rating || '—'}</td>
                  <td>
                    <div className="crud-actions">
                      <button className="crud-edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="crud-del-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" className="crud-empty">No products yet. Seed the DB or add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CrudManager;
