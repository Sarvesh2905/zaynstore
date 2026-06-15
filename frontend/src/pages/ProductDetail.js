import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

const API = 'https://zaynstore.onrender.com';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/product/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container detail-loading">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line w-40" />
            <div className="skeleton-line w-70" />
            <div className="skeleton-line w-30" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper detail-error-page">
        <div className="detail-error">
          <h2>Product Not Found</h2>
          <p>This product doesn't exist or may have been removed.</p>
          <Link to="/home" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="page-wrapper">
      <div className="container detail-page">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/home">Shop</Link>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        <div className="detail-layout">
          {/* Image */}
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.name} className="detail-image" />
            <button
              className={`detail-wish-btn${wishlisted ? ' active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="detail-info">
            {product.brand && <p className="detail-brand">{product.brand}</p>}
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="detail-rating">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24"
                    fill={i <= Math.round(product.rating) ? '#ff9f0a' : '#e0e0e0'} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
                <span className="detail-rating-val">{product.rating}</span>
                {product.reviews && <span className="detail-reviews">({product.reviews} reviews)</span>}
              </div>
            )}

            <div className="detail-price-row">
              <p className="detail-price">₹{product.price?.toLocaleString('en-IN')}</p>
              {product.price > 999 && (
                <span className="detail-free-ship">Free Shipping</span>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="detail-sizes">
                <p className="detail-sizes-label">
                  Select Size: <strong>{selectedSize}</strong>
                </p>
                <div className="detail-size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn${selectedSize === size ? ' active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="detail-ctas">
              <button
                className={`btn btn-primary detail-add-btn${added ? ' added' : ''}`}
                onClick={handleAddToCart}
                id="add-to-cart-btn"
              >
                {added ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                className={`btn detail-wish-action${wishlisted ? ' wishlisted' : ' btn-outline'}`}
                onClick={() => toggleWishlist(product)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={wishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Category tag */}
            {product.category && (
              <div className="detail-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                {product.category}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
