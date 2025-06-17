import { Link } from 'react-router-dom';

function ProductCard({ id, title, price, image }) {
  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card shadow-sm h-100">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">₹{price}</p>
          </div>
          <Link to={`/product/${id}`} className="btn btn-dark mt-3 w-100">View Product</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
