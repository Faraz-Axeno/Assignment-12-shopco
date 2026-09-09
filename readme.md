# MERN Stack E-Commerce Web Application

A fully responsive, feature-rich e-commerce MERN stack application. This project replicates a modern online fashion store experience, featuring dynamic product catalogs, interactive cart management, promo code calculation, authentication, order management, and a robust admin panel.

---

## ✨ Features Implemented

* **Home Page:** Displays new arrivals, top-selling products, and categories dynamically fetched from the backend.
* **Categories Page:** Browse all available categories.
* **Product Listing Page:** Fully functional filtering (by category, price, stock), searching (debounced), sorting (price, newest, name), and pagination, all handled efficiently by the backend.
* **Product Details Page:** View detailed product information, select quantity, and add to cart. Validates available stock.
* **Interactive Shopping Cart:** Real-time item quantity increments and decrements, individual item removal, and dynamic subtotals. Order summary calculation with delivery fees, discounts, and final totals.
* **Checkout Flow:** Validates cart content, creates an order in MongoDB, reduces product inventory securely, and clears the cart.
* **Authentication & Authorization:** Secure JWT-based authentication. Passwords are hashed using bcrypt. Protected routes for users and admins.
* **Profile Page:** View and update personal information, and track order history with order statuses and details.
* **Admin Dashboard:** Comprehensive dashboard for administrators to view total products, categories, users, orders, and track low-stock (threshold <= 5) and out-of-stock products. Manage orders and products.
* **Performance Optimizations:** 
  - **useMemo / useCallback:** Used in `CartContext` to prevent unnecessary recalculations of cart totals and to stabilize context values. Used in `ProductListing` to debounce filter changes.
  - **Lazy Loading:** React Router routes for Profile, Admin Dashboard, Cart, and Product Details are lazy-loaded to improve initial load times and LCP.
* **Responsive Design:** Completely adaptive layout across all devices, maintaining the original SCSS styling pixel-perfect.

---

## 🔑 Default Users

For testing and evaluation purposes, use the following credentials:

* **Admin User:**
  * Email: `admin@example.com`
  * Password: `Admin@123`

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React.js, React Router, SCSS, Axios, Vite
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt
* **State Management:** React Context API (`AuthContext`, `CartContext`)

