import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showBanner, setShowBanner] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/products?keyword=${search}`);
        }
    };

    const handleLogout = () => {
        clearCart();
        logout();
        navigate('/login');
    };

    const totalQty = cartItems.reduce((acc, item) => acc + (parseInt(item.qty) || 0), 0);

    return (
        <header className="header">
            {showBanner && (
                <div className="top-banner">
                    <div className="top-banner__content">
                        <p className="Topbanner-p">Sign up and get 20% off to your first order. <Link to="/signup" className="top-banner__link">Sign Up Now</Link></p>
                    </div>
                    <button className="top-banner__close" aria-label="Close banner" onClick={() => setShowBanner(false)}>
                        <img src="/images/cross.svg" alt="Close" className="top-banner__icon" />
                    </button>
                </div>
            )}
            
            <div className="header__navbar">
                <button className="header__hamburger" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}>
                    <img src="/images/Hamurger.svg" alt="Menu" className="header__hamburger-icon" />
                </button>

                <Link to="/" className="header__logo">SHOP.CO</Link>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-overlay">
                        <div className="mobile-menu-content">
                            <button onClick={() => setMobileMenuOpen(false)} className="mobile-menu-close">&times;</button>
                            <nav className="mobile-menu-nav">
                                <Link to="/products" className="header__nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                                <Link to="/products?category=on-sale" className="header__nav-link" onClick={() => setMobileMenuOpen(false)}>On Sale</Link>
                                <Link to="/products?sort=newest" className="header__nav-link" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                                <Link to="/categories" className="header__nav-link" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
                            </nav>
                        </div>
                    </div>
                )}

                <nav className="header__nav" id="header-nav">
                    <Link to="/products" className="header__nav-link">Shop <img src="/images/dropdown-image.svg" alt="Dropdown" className="header__nav-icon" /></Link>
                    <Link to="/products?category=on-sale" className="header__nav-link">On Sale</Link>
                    <Link to="/products?sort=newest" className="header__nav-link">New Arrivals</Link>
                    <Link to="/categories" className="header__nav-link">Brands</Link>
                </nav>

                <div className="search-bar">
                    <img src="/images/search.svg" alt="Search" className="search-bar__icon" />
                    <input 
                        type="text" 
                        className="search-bar__input" 
                        placeholder="Search for products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                <div className="header__actions">
                    <button className="header__action-btn header__action-btn--search-mobile" aria-label="Search">
                        <img src="/images/search.svg" alt="Search" className="header__action-search-icon" />
                    </button>
                    <Link to="/cart" className="header__action-btn cart-has-badge" aria-label="Cart">
                        <img src="/images/cart.svg" alt="Cart" className="header__action-cart-icon" />
                        {user && totalQty > 0 && (
                            <span className="header__cart-badge">
                                {totalQty}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <div className="header__user-menu">
                            <Link to="/profile" className="header__action-btn">
                                <img src="/images/profile.svg" alt="Profile" className="header__action-profile-icon" />
                            </Link>
                            {user.isAdmin && <Link to="/admin" className="header__admin-link">Admin</Link>}
                            <button onClick={handleLogout} className="header__logout-btn">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="header__action-btn" aria-label="Profile">
                            <img src="/images/profile.svg" alt="Profile" className="header__action-profile-icon" />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
