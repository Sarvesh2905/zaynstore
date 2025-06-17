import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-3 d-flex justify-content-between">
      <Link to="/" className="text-white text-decoration-none">
        <h2 className="m-0">ZAYN</h2>
      </Link>
      <Link to="/cart" className="text-white position-relative">
        <i className="bi bi-cart-fill" style={{ fontSize: "1.5rem" }}></i>
      </Link>
    </nav>
  );
}

export default Navbar;
