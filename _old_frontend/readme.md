# SHOP.CO — E-Commerce Web Application

A fully responsive, feature-rich e-commerce frontend web application built with **HTML5**, **SCSS**, and **Vanilla JavaScript**. This project replicates a modern online fashion store experience based on a professional Figma design, featuring dynamic product catalogs, interactive cart management, promo code calculation, mock authentication, and route protection.

---

## ✨ Features Implemented

* **Home Page:** Pixel-accurate layout reproduction matching the Figma template, complete with brand showcases, new arrivals, top-selling grids, and dress style categories.

* **Product Details Page:** Dynamic routing (`product.html?id=ID`) that extracts product information from the URL, renders imagery, ratings, pricing, variant/color options, and quantity selection.

* **Interactive Shopping Cart:** 
  * Real-time item quantity increments and decrements.
  * Individual item removal and dynamic subtotals.
  * Order summary calculation with delivery fees, discounts, and final totals.
  * Empty cart handling with a custom empty-state design.
  * Cart state persistence using `localStorage`.

* **Coupon Code Support:** 
  * Validates and applies active discounts (`SAVE10` for 10% off, `SAVE20` for 20% off).
  * Enforces the rule that only one coupon can be active at a time (replacing previous codes seamlessly).

* **Checkout Simulation & Success Modal:** 
  * Validates cart content before allowing checkout.
  * Displays a success popup modal confirming order placement, which clears the cart, resets coupons, and updates state upon confirmation.

* **Mock Authentication & Route Guarding:**
  * Dedicated login screen mirroring the brand's aesthetic.
  * Protected route handling using JavaScript and `localStorage` (unauthenticated users attempting to access product or cart pages are automatically redirected to `login.html`).
  * **Logout Functionality:** Clicking the profile icon in the header while authenticated clears the authentication state from `localStorage` and redirects the user back to `login.html`.

* **Responsive Design:** Completely adaptive layout across desktop, laptop, tablet, and mobile devices featuring a custom slide-out mobile menu drawer.

---

## 🔑 Login Credentials

For testing and evaluation purposes, use the following hardcoded credentials on the Login Page (`login.html`):

* **Email:** `admin@example.com`
* **Password:** `Admin@123`

---

## 🎟️ Coupon Codes

The following discount coupons can be applied on the Cart Page:

* **SAVE10** → Provides a 10% discount on the cart subtotal.
* **SAVE20** → Provides a 20% discount on the cart subtotal.
* *Rule:* Only one coupon can be active at any given time; applying a new code automatically replaces the previous one.

---

## 🛠️ Tech Stack & Architecture

* **Markup:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<form>`)
* **Styling:** SCSS / Sass structured with the BEM (Block Element Modifier) naming convention and compiled into production CSS.
* **Logic:** Vanilla JavaScript (ES6+, modular architecture, DOM manipulation, `localStorage` state persistence).

---

## 📂 Folder Structure

```Assignment-06
project/
│
├── index.html
├── login.html
├── product.html
├── cart.html
│
├── css/
│   └── main.css
│
├── scss/
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _functions.scss
│   │
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _global.scss
│   │
│   ├── components/
│   │   ├── _button.scss
│   │   ├── _product-card.scss
│   │   ├── _cart-item.scss
│   │   ├── _form.scss
│   │   └── _modal.scss
│   │
│   ├── layout/
│   │   ├── _header.scss
│   │   ├── _footer.scss
│   │   └── _container.scss
│   │
│   └── pages/
│       ├── _home.scss
│       ├── _product.scss
│       ├── _cart.scss
│       └── _login.scss
│
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── products.js
│   ├── product-details.js
│   └── cart.js
│
├── images/
└── README.md