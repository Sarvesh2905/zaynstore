# ZAYN Store 🛒

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application built during my 2nd-year software development internship at **App Innovation Technologies Pvt Ltd**, Coimbatore. 

This project helped me practice and solidify my full-stack development skills, featuring a complete Apple-minimal design system, JWT-based authentication, and a fully functional e-commerce storefront.

**🌍 Live Demo:** [https://zayn-store1.netlify.app/](https://zayn-store1.netlify.app/)  
**⚙️ Backend API:** [https://zaynstore.onrender.com](https://zaynstore.onrender.com)

![ZAYN Store Preview](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=75)

## 🚀 Features

- **Premium UI/UX**: Custom-built, Apple-minimal design system with glassmorphism, smooth animations, and responsive layouts.
- **Authentication**: JWT-based secure user registration, login, and protected routes.
- **Product Catalogue**: Dynamic product listing with categories, search, and sorting.
- **Shopping Cart**: Full cart functionality with quantity controls and real-time order summary.
- **Wishlist**: Save favorite items to a wishlist.
- **Admin Panel**: CRUD (Create, Read, Update, Delete) operations for managing products, guarded by admin privileges.
- **Cloud Database**: MongoDB Atlas integration for robust data storage.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Components, Hooks, Context API (Auth, Cart, Wishlist).
- **React Router v7**: Declarative routing and protected routes.
- **Custom CSS**: Vanilla CSS variables, Inter font, no heavy UI libraries.

### Backend
- **Node.js & Express.js**: RESTful API architecture.
- **MongoDB & Mongoose**: Database and schema modeling (MongoDB Atlas).
- **Authentication**: bcryptjs for password hashing, jsonwebtoken (JWT) for stateless sessions.
- **CORS**: Configured for seamless cross-origin requests.

## 📂 Project Structure

```text
zaynstore/
├── frontend/        # React frontend application
│   ├── public/
│   └── src/         # Components, Pages, Contexts, CSS
├── backend/         # Node.js + Express backend API
│   ├── .env         # Environment variables (MongoDB URI, JWT secret)
│   └── index.js     # Server entry point and routes
└── README.md
```

## 📖 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/Sarvesh2905/zaynstore.git
cd zaynstore
```

### 2. Backend Setup
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=6001
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@zaynstore.com
```

Install dependencies and start the server:
```bash
cd backend
npm install
node index.js
```
*The backend runs on `http://localhost:6001`.*

**(Optional) Seed the database:**
```bash
curl -X POST http://localhost:6001/seed
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm start
```
*The frontend runs on `http://localhost:3000`.*

---

## 🚀 Deployment Guide

### Backend Deployment (Render)
1. Create a new account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository and select the `zaynstore` repo.
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Your secret key.
   - `ADMIN_EMAIL`: `admin@zaynstore.com`
6. Click **Create Web Service**. Once deployed, copy the Render URL (e.g., `https://zaynstore-api.onrender.com`).

### Frontend Deployment (Netlify)
1. Update your frontend code to use the deployed backend URL instead of `http://localhost:6001`. 
   *(In files like `Home.js`, `ProductDetail.js`, `CrudManager.js`, `AuthContext.js`, etc.)*
2. Create an account on [Netlify](https://www.netlify.com/).
3. Click **Add new site** > **Import an existing project** and connect GitHub.
4. Select the `zaynstore` repo.
5. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Click **Deploy site**.

## 📌 Note

This project is for learning purposes only and was developed as part of my internship to practice MERN stack development and modern UI/UX principles.
