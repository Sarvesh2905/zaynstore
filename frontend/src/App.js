import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Form from './pages/Form';
import CrudManager from './pages/CrudManager';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/form" element={<Form />} />
        <Route path="/crud" element={<CrudManager />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
