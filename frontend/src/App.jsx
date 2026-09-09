import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const Categories = lazy(() => import('./pages/Categories'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Header />
                    <main className="main-content">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/products" element={<ProductListing />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                            </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
