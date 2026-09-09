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
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '250px', backgroundColor: '#fff', padding: '20px', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
                            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginBottom: '20px' }}>&times;</button>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                    <Link to="/cart" className="header__action-btn" aria-label="Cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <img src="/images/cart.svg" alt="Cart" className="header__action-cart-icon" />
                        {user && totalQty > 0 && (
                            <span className="cart-badge" style={{ 
                                position: 'absolute', 
                                top: '-8px', 
                                right: '-8px', 
                                backgroundColor: '#000', 
                                color: '#fff', 
                                borderRadius: '50%', 
                                minWidth: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px', 
                                fontWeight: 'bold',
                                padding: '2px'
                            }}>
                                {totalQty}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <div className="header__user-menu" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Link to="/profile" className="header__action-btn">
                                <img src="/images/profile.svg" alt="Profile" className="header__action-profile-icon" />
                            </Link>
                            {user.isAdmin && <Link to="/admin" style={{fontSize: '14px', textDecoration: 'none'}}>Admin</Link>}
                            <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'}}>Logout</button>
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
