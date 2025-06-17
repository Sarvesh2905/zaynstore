import ProductCard from '../components/ProductCard';
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

const products = [
  { id: 1, title: "Classic Shirt", price: 999, image: product1 },
  { id: 2, title: "Slim Fit Tee", price: 799, image: product2 },
  { id: 3, title: "Winter Hoodie", price: 1499, image: product3 },
  { id: 4, title: "Denim Jeans", price: 1299, image: product4 },
  { id: 5, title: "Leather Jacket", price: 1999, image: product5 },
  { id: 6, title: "Polo T-Shirt", price: 899, image: product6 },
  { id: 7, title: "Graphic Tee", price: 699, image: product7 },
  { id: 8, title: "Casual Shorts", price: 599, image: product8 },
  { id: 9, title: "Formal Trousers", price: 1399, image: product9 },
  { id: 10, title: "Wool Sweater", price: 1599, image: product10 },
  { id: 11, title: "Sport Shoes", price: 2499, image: product11 },
  { id: 12, title: "Canvas Sneakers", price: 2199, image: product12 },
  { id: 13, title: "Leather Boots", price: 2799, image: product13 },
  { id: 14, title: "Silk Tie", price: 499, image: product14 },
  { id: 15, title: "Crew Socks (5-Pack)", price: 399, image: product15 },
  { id: 16, title: "Sports Watch", price: 3499, image: product16 },
  { id: 17, title: "Analog Watch", price: 4299, image: product17 },
  { id: 18, title: "Duffel Bag", price: 1999, image: product18 },
  { id: 19, title: "Sunglasses", price: 1299, image: product19 },
  { id: 20, title: "Wristband Combo", price: 699, image: product20 },
];

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export default Home;
