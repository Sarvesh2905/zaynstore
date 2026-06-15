import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

function Wishlist() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes?.[0] || null, 1);
    toggleWishlist(product);
  };

  if (items.length === 0) {
    return (
      <div className="page-wrapper wishlist-empty-page">
        <div className="wishlist-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love by tapping the heart icon.</p>
          <Link to="/home" className="btn btn-primary">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container wishlist-page">
        <div className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          <span className="wishlist-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="wishlist-grid">
          {items.map(product => (
            <div key={product._id} className="wishlist-card">
              <div className="wishlist-image-wrap">
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name} className="wishlist-image" />
                </Link>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Remove from wishlist"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="wishlist-info">
                <Link to={`/product/${product._id}`}>
                  <h3 className="wishlist-name">{product.name}</h3>
                </Link>
                {product.brand && <p className="wishlist-brand">{product.brand}</p>}
                <p className="wishlist-price">₹{product.price.toLocaleString('en-IN')}</p>

                <button
                  className="btn btn-primary wishlist-add-btn"
                  onClick={() => handleMoveToCart(product)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
