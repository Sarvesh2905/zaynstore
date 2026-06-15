import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

function Footer() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Z</div>
          <span className="footer-brand-name">ZAYN Store</span>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} ZAYN Store · Built during internship at{' '}
          <strong>App Innovation Technologies Pvt Ltd</strong>, Coimbatore
        </p>
        <div className="footer-links">
          <Link to="/home">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
