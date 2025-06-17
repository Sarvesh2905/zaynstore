import { useParams } from 'react-router-dom';
import products from './Home'; 
import product1 from '../images/product1.jpeg';
import product2 from '../images/product2.jpeg';
import product3 from '../images/product3.jpeg';
import product4 from '../images/product4.jpeg';
import product5 from '../images/product5.jpeg';
import product6 from '../images/product6.jpeg';
import product7 from '../images/product7.jpeg';
import product8 from '../images/product8.jpeg';
import product9 from '../images/product9.jpeg';
import product10 from '../images/product10.jpeg';
import product11 from '../images/product11.jpeg';
import product12 from '../images/product12.jpeg';
import product13 from '../images/product13.jpeg';
import product14 from '../images/product14.jpeg';
import product15 from '../images/product15.jpeg';
import product16 from '../images/product16.jpeg';
import product17 from '../images/product17.jpeg';
import product18 from '../images/product18.jpeg';
import product19 from '../images/product19.jpeg';
import product20 from '../images/product20.jpeg';

const productData = {
  1: { title: "Classic Shirt", price: 999, description: "Premium cotton shirt.", image: product1 },
  2: { title: "Slim Fit Tee", price: 799, description: "Soft slim fit tee.", image: product2 },
  3: { title: "Winter Hoodie", price: 1499, description: "Warm fleece-lined hoodie with adjustable drawstrings.", image: product3 },
  4: { title: "Denim Jeans", price: 1299, description: "Stretch-fit denim jeans for comfort and style.", image: product4},
  5: { title: "Leather Jacket", price: 1999, description: "Stylish faux leather jacket with zip closure.", image: product5 },
  6: {
  title: "Polo T-Shirt",
  price: 899,
  description: "Collared cotton polo t-shirt with classic fit.",
  image: product6
},
7: {
  title: "Graphic Tee",
  price: 699,
  description: "Stylish printed T-shirt with modern graphic art.",
  image: product7
},
8: {
  title: "Casual Shorts",
  price: 599,
  description: "Lightweight and comfortable cotton shorts.",
  image: product8
},
9: {
  title: "Formal Trousers",
  price: 1399,
  description: "Slim-fit formal pants for office and meetings.",
  image: product9
},
10: {
  title: "Wool Sweater",
  price: 1599,
  description: "Warm wool sweater ideal for winter.",
  image: product10
},
11: {
  title: "Sport Shoes",
  price: 2499,
  description: "Durable running shoes with shock-absorbing sole.",
  image: product11
},
12: {
  title: "Canvas Sneakers",
  price: 2199,
  description: "Trendy sneakers perfect for casual wear.",
  image: product12
},
13: {
  title: "Leather Boots",
  price: 2799,
  description: "High-top leather boots with rugged finish.",
  image: product13
},
14: {
  title: "Silk Tie",
  price: 499,
  description: "Premium silk tie for formal occasions.",
  image: product14
},
15: {
  title: "Crew Socks (5-Pack)",
  price: 399,
  description: "Cotton socks in assorted colors and designs.",
  image: product15
},
16: {
  title: "Sports Watch",
  price: 3499,
  description: "Water-resistant watch with stopwatch feature.",
  image: product16
},
17: {
  title: "Analog Watch",
  price: 4299,
  description: "Classic analog watch with leather strap.",
  image: product17
},
18: {
  title: "Duffel Bag",
  price: 1999,
  description: "Spacious duffel bag with strong straps.",
  image: product18
},
19: {
  title: "Sunglasses",
  price: 1299,
  description: "UV-protected stylish sunglasses for men & women.",
  image: product19
},
20: {
  title: "Wristband Combo",
  price: 699,
  description: "Pack of 3 rubber wristbands with bold text.",
  image: product20
}
};

function ProductDetail() {
  const { id } = useParams();
  const product = productData[id];

  return product ? (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <img src={product.image} alt={product.title} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="text-muted">₹{product.price}</p>
          <p>{product.description}</p>
          <button className="btn btn-dark mt-3">Add to Cart</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="container mt-5 text-center">
      <h3>Product Not Found</h3>
    </div>
  );
}

export default ProductDetail;
