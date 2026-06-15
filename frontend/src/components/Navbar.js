import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  if (!isAuthenticated) return null;

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/home" className="navbar-brand">
          <div className="navbar-logo">Z</div>
          <span className="navbar-brand-name">ZAYN</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/home" className={`navbar-link${location.pathname === '/home' ? ' active' : ''}`}>Shop</Link>
          {isAdmin && (
            <Link to="/crud" className={`navbar-link${location.pathname === '/crud' ? ' active' : ''}`}>Admin</Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link to="/wishlist" className="navbar-icon-btn" aria-label="Wishlist" id="nav-wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="navbar-icon-btn" aria-label="Cart" id="nav-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>

          <div className="navbar-user">
            <div className="navbar-avatar">{initials}</div>
            <span className="navbar-username">{firstName}</span>
            <button className="navbar-logout" onClick={handleLogout} id="logout-btn" title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar-drawer${menuOpen ? ' open' : ''}`}>
        <Link to="/home" className="drawer-link">Shop</Link>
        <Link to="/wishlist" className="drawer-link">
          Wishlist {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </Link>
        <Link to="/cart" className="drawer-link">
          Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        {isAdmin && <Link to="/crud" className="drawer-link">Admin Panel</Link>}
        <hr className="drawer-divider" />
        <button className="drawer-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
