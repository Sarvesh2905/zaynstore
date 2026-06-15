import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || null, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        {/* Image */}
        <div className="product-card-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
          {/* Wishlist toggle */}
          <button
            className={`product-card-wish${wishlisted ? ' wishlisted' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Category badge */}
          {product.category && (
            <span className="product-card-category">{product.category}</span>
          )}

          {/* Hover CTA */}
          <div className="product-card-overlay">
            <button className="btn btn-primary product-card-cta" onClick={handleAddToCart}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-card-info">
          <div className="product-card-top">
            <h3 className="product-card-name">{product.name}</h3>
            {product.rating && (
              <div className="product-card-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff9f0a" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {product.rating}
              </div>
            )}
          </div>
          {product.brand && <p className="product-card-brand">{product.brand}</p>}
          <p className="product-card-price">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
