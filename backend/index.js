require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 6001;
const JWT_SECRET = process.env.JWT_SECRET || 'zayn_secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zaynstore.com';

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false,
  },
  tls: true,
  tlsAllowInvalidCertificates: false,
});

let productsCollection;
let usersCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db('zaynstore');
    productsCollection = db.collection('products');
    usersCollection = db.collection('users');
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}
run();

// ─── Middleware ───────────────────────────────────────────────────────────────

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /auth/signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existing = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
      createdAt: new Date(),
    };
    const result = await usersCollection.insertOne(user);
    const token = jwt.sign(
      { id: result.insertedId, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: { id: result.insertedId, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed', message: error.message });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// GET /auth/me
app.get('/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// ─── Product Routes ───────────────────────────────────────────────────────────

// GET /products  (with optional search, category, sort)
app.get('/products', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    let cursor = productsCollection.find(query);
    if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });
    else if (sort === 'name_asc') cursor = cursor.sort({ name: 1 });
    const products = await cursor.toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Read failed', message: error.message });
  }
});

// GET /product/:id
app.get('/product/:id', async (req, res) => {
  try {
    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed', message: error.message });
  }
});

// GET /categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await productsCollection.distinct('category');
    res.json(categories.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// POST /upload  (admin only)
app.post('/upload', verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    const result = await productsCollection.insertOne({ ...data, createdAt: new Date() });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Create failed', message: error.message });
  }
});

// PUT /product/:id  (admin only)
app.put('/product/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, price, description, image, category, brand, sizes, rating } = req.body;
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price, description, image, category, brand, sizes, rating } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Update failed', message: error.message });
  }
});

// DELETE /product/:id  (admin only)
app.delete('/product/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Delete failed', message: error.message });
  }
});

// POST /seed  (public — dev convenience)
app.post('/seed', async (req, res) => {
  try {
    await productsCollection.deleteMany({});
    const seedProducts = [
      { name: 'Classic Shirt', price: 999, description: 'Premium cotton shirt with a crisp collar and timeless silhouette.', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=75', category: 'Shirts', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, reviews: 128 },
      { name: 'Slim Fit Tee', price: 799, description: 'Soft slim fit tee perfect for everyday wear.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=75', category: 'T-Shirts', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.3, reviews: 87 },
      { name: 'Winter Hoodie', price: 1499, description: 'Warm fleece-lined hoodie with adjustable drawstrings.', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=75', category: 'Hoodies', brand: 'ZAYN', sizes: ['M', 'L', 'XL'], rating: 4.7, reviews: 214 },
      { name: 'Denim Jeans', price: 1299, description: 'Stretch-fit denim jeans for comfort and style.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=75', category: 'Bottoms', brand: 'ZAYN', sizes: ['28', '30', '32', '34', '36'], rating: 4.4, reviews: 163 },
      { name: 'Leather Jacket', price: 1999, description: 'Stylish faux leather jacket with zip closure and moto-inspired detailing.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=75', category: 'Jackets', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviews: 302 },
      { name: 'Polo T-Shirt', price: 899, description: 'Collared cotton polo t-shirt with classic fit.', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=75', category: 'T-Shirts', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL'], rating: 4.2, reviews: 95 },
      { name: 'Graphic Tee', price: 699, description: 'Stylish printed T-shirt with modern graphic art.', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=75', category: 'T-Shirts', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.1, reviews: 67 },
      { name: 'Casual Shorts', price: 599, description: 'Lightweight and comfortable cotton shorts for summer.', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=75', category: 'Bottoms', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL'], rating: 4.0, reviews: 54 },
      { name: 'Formal Trousers', price: 1399, description: 'Slim-fit formal pants for office and meetings.', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=75', category: 'Bottoms', brand: 'ZAYN', sizes: ['28', '30', '32', '34'], rating: 4.3, reviews: 76 },
      { name: 'Wool Sweater', price: 1599, description: 'Warm wool sweater ideal for winter layering.', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=75', category: 'Hoodies', brand: 'ZAYN', sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, reviews: 143 },
      { name: 'Sport Shoes', price: 2499, description: 'Durable running shoes with shock-absorbing sole and breathable mesh.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75', category: 'Footwear', brand: 'ZAYN', sizes: ['6', '7', '8', '9', '10', '11'], rating: 4.7, reviews: 389 },
      { name: 'Canvas Sneakers', price: 2199, description: 'Trendy sneakers perfect for casual wear and street style.', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75', category: 'Footwear', brand: 'ZAYN', sizes: ['6', '7', '8', '9', '10'], rating: 4.5, reviews: 221 },
      { name: 'Leather Boots', price: 2799, description: 'High-top leather boots with rugged finish and durable sole.', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=75', category: 'Footwear', brand: 'ZAYN', sizes: ['7', '8', '9', '10', '11'], rating: 4.8, reviews: 178 },
      { name: 'Silk Tie', price: 499, description: 'Premium silk tie for formal occasions and business attire.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['One Size'], rating: 4.4, reviews: 92 },
      { name: 'Crew Socks (5-Pack)', price: 399, description: 'Cotton socks in assorted colors and designs.', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['Free Size'], rating: 4.0, reviews: 45 },
      { name: 'Sports Watch', price: 3499, description: 'Water-resistant watch with stopwatch feature and digital display.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['One Size'], rating: 4.6, reviews: 267 },
      { name: 'Analog Watch', price: 4299, description: 'Classic analog watch with leather strap and sapphire glass.', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['One Size'], rating: 4.9, reviews: 412 },
      { name: 'Duffel Bag', price: 1999, description: 'Spacious duffel bag with strong straps and waterproof lining.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=75', category: 'Bags', brand: 'ZAYN', sizes: ['One Size'], rating: 4.5, reviews: 134 },
      { name: 'Sunglasses', price: 1299, description: 'UV-protected stylish sunglasses for men & women.', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['One Size'], rating: 4.3, reviews: 88 },
      { name: 'Wristband Combo', price: 699, description: 'Pack of 3 rubber wristbands with bold text and vibrant colors.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=75', category: 'Accessories', brand: 'ZAYN', sizes: ['One Size'], rating: 3.9, reviews: 33 },
    ];
    const result = await productsCollection.insertMany(seedProducts);
    res.json({ message: `Seeded ${result.insertedCount} products` });
  } catch (error) {
    res.status(500).json({ error: 'Seed failed', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
