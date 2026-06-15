import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const API = 'https://zaynstore.onrender.com';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name A–Z' },
];

function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('default');

  // Fetch products + categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products (required)
        const prodRes = await fetch(`${API}/products`);
        const prods = await prodRes.json();
        setProducts(Array.isArray(prods) ? prods : []);

        // Fetch categories (optional — don't fail if it errors)
        try {
          const catRes = await fetch(`${API}/categories`);
          const cats = await catRes.json();
          setCategories(['All', ...(Array.isArray(cats) ? cats : [])]);
        } catch {
          // Build categories from products if endpoint fails
          const cats = [...new Set(prods.map(p => p.category).filter(Boolean))];
          setCategories(['All', ...cats]);
        }
      } catch {
        setError('Could not load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filter + sort (search is local for instant UX)
  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, activeCategory, sort]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page-wrapper home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <p className="hero-eyebrow">Summer Collection 2025</p>
          <h1 className="hero-title">
            Style that speaks<br />
            <span className="hero-accent">for itself.</span>
          </h1>
          <p className="hero-sub">
            Hey {firstName} 👋 — Premium fashion, curated for you.
          </p>
          {/* Search bar in hero */}
          <div className="hero-search">
            <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              id="home-search"
              type="text"
              className="hero-search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="hero-search-clear" onClick={() => setSearch('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="products-section">
        <div className="container">
          <div className="products-controls">
            {/* Category pills */}
            <div className="category-pills" id="category-filter">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + count */}
            <div className="products-meta">
              <span className="products-count">
                {loading ? '—' : `${filtered.length} products`}
              </span>
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="products-loading">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          ) : error ? (
            <div className="products-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button className="btn btn-secondary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
