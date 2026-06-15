import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Cart.css';

function Cart() {
  const { items, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const shipping = cartTotal > 999 ? 0 : 99;
  const total = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="page-wrapper cart-empty-page">
        <div className="cart-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/home" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container cart-page">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <button className="cart-clear" onClick={clearCart}>Clear all</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-image-wrap">
                  <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      {item.selectedSize && (
                        <p className="cart-item-size">Size: {item.selectedSize}</p>
                      )}
                      {item.product.brand && (
                        <p className="cart-item-brand">{item.product.brand}</p>
                      )}
                    </div>
                    <p className="cart-item-price">₹{(item.product.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="cart-item-bottom">
                    {/* Qty stepper */}
                    <div className="cart-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >−</button>
                      <span className="cart-qty-val">{item.qty}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                      >+</button>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className={`cart-wish-btn${isWishlisted(item.product._id) ? ' active' : ''}`}
                        onClick={() => toggleWishlist(item.product)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24"
                          fill={isWishlisted(item.product._id) ? 'currentColor' : 'none'}
                          stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        Wishlist
                      </button>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.key)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-ship' : ''}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="cart-free-msg">Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping</p>
              )}
              <div className="cart-summary-divider" />
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary cart-checkout-btn" id="checkout-btn">
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <p className="cart-checkout-note">Payment & checkout coming soon</p>

            <Link to="/home" className="btn btn-secondary cart-continue-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
