import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    
    const testimonialsRef = useRef(null);

    const scrollTestimonials = (direction) => {
        if (testimonialsRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            testimonialsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data: newArrivalsData } = await axios.get('http://localhost:5000/api/products?sort=newest&pageSize=4');
                setNewArrivals(newArrivalsData.products);
                
                const { data: topSellingData } = await axios.get('http://localhost:5000/api/products?sort=price_desc&pageSize=4'); // Proxy for top selling
                setTopSelling(topSellingData.products);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <section className="home-hero">
                <div className="hero-container">
                    <img src="/images/star.svg" alt="Star" className="star-icon star-small" />
                    <img src="/images/star.svg" alt="Star" className="star-icon star-large" />

                    <div className="hero-content-left">
                        <h1 className="hero-main-title">FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
                        <p className="hero-text">Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
                        
                        <Link to="/products"><button className="btn-primary hero-btn">Shop Now</button></Link>
                        
                        <div className="stats-container">
                            <div className="stat-item">
                                <h2 className="stat-number">200+</h2>
                                <p className="stat-label">International Brands</p>
                            </div>
                            <div className="stat-item">
                                <h2 className="stat-number">2,000+</h2>
                                <p className="stat-label">High-Quality Products</p>
                            </div>
                            <div className="stat-item">
                                <h2 className="stat-number">30,000+</h2>
                                <p className="stat-label">Happy Customers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-content-right">
                        <img className="hero-image" src="/images/Hero-couple.jpg" alt="Hero Couple Image" />
                    </div>
                </div>
            </section>

            <section className="Brands-Name">
                <div className="Name">
                    <img src="/images/VERSACE.png" alt="Versace" className="brand-logo" />
                    <img src="/images/zara-logo-1.png" alt="Zara" className="brand-logo" />
                    <img src="/images/gucci-logo-1.png" alt="Gucci" className="brand-logo" />
                    <img src="/images/prada-logo-1.png" alt="Prada" className="brand-logo" />
                    <img src="/images/Calvin Klein.png" alt="Calvin Klein" className="brand-logo" />
                </div>
            </section>

            <section className="new-arrivals-section">
                <div className="header__container">
                    <h2 className="section-title">NEW ARRIVALS</h2>
                    <div className="product-grid">
                        {newArrivals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div className="button-container">
                        <Link to="/products?sort=newest"><button style={{ background: 'white', color: 'black', border: '1px solid #ddd', padding: '16px 54px', borderRadius: '62px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>View All</button></Link>
                    </div>
                </div>
            </section>

            <hr className="divider" />

            <section className="top-selling-section">
                <div className="header__container">
                    <h2 className="section-title">TOP SELLING</h2>
                    <div className="product-grid">
                        {topSelling.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div className="button-container">
                        <Link to="/products"><button style={{ background: 'white', color: 'black', border: '1px solid #ddd', padding: '16px 54px', borderRadius: '62px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>View All</button></Link>
                    </div>
                </div>
            </section>

            <section className="dress-style">
                <div className="dress-style__container">
                    <h2 className="dress-style__title">BROWSE BY DRESS STYLE</h2>
                    <div className="dress-style__grid">
                        <Link to="/products?categoryName=Casual" className="style-card style-card--casual">
                            <img src="/images/Casual.png" alt="Casual" className="style-card__image" />
                        </Link>
                        <Link to="/products?categoryName=Formal" className="style-card style-card--formal">
                            <img src="/images/Formal.png" alt="Formal" className="style-card__image" />
                        </Link>
                        <Link to="/products?categoryName=Party" className="style-card style-card--party">
                            <img src="/images/Party.png" alt="Party" className="style-card__image" />
                        </Link>
                        <Link to="/products?categoryName=Gym" className="style-card style-card--gym">
                            <img src="/images/GYM.png" alt="Gym" className="style-card__image" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <div className="container testimonials__container">
                    <div className="testimonials__header">
                        <h2 className="testimonials__title">OUR HAPPY CUSTOMERS</h2>
                        <div className="testimonials__nav">
                            <button onClick={() => scrollTestimonials('left')} className="testimonials__arrow testimonials__arrow--prev" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                <img src="/images/arrow-right.svg" style={{ transform: 'rotate(180deg)' }} alt="Previous" />
                            </button>
                            <button onClick={() => scrollTestimonials('right')} className="testimonials__arrow testimonials__arrow--next" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                <img src="/images/arrow-right.svg" alt="Next" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="testimonials__carousel">
                        <div className="testimonials__grid" id="testimonials-grid" ref={testimonialsRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollBehavior: 'smooth' }}>
                            <article className="review-card testimonials__card" style={{ minWidth: '350px', border: '1px solid #eee', padding: '28px', borderRadius: '20px' }}>
                                <div className="review-card__stars" style={{ color: '#FFC633', fontSize: '22px', marginBottom: '15px' }}>★★★★★</div>
                                <div className="review-card__user" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
                                    <h4 className="review-card__name" style={{ margin: 0, fontSize: '20px' }}>Sarah M.</h4>
                                    <img src="/images/verified.svg" alt="Verified" className="review-card__verified-icon" />
                                </div>
                                <p className="review-card__text" style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."</p>
                            </article>

                            <article className="review-card testimonials__card" style={{ minWidth: '350px', border: '1px solid #eee', padding: '28px', borderRadius: '20px' }}>
                                <div className="review-card__stars" style={{ color: '#FFC633', fontSize: '22px', marginBottom: '15px' }}>★★★★★</div>
                                <div className="review-card__user" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
                                    <h4 className="review-card__name" style={{ margin: 0, fontSize: '20px' }}>Alex K.</h4>
                                    <img src="/images/verified.svg" alt="Verified" className="review-card__verified-icon" />
                                </div>
                                <p className="review-card__text" style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."</p>
                            </article>

                            <article className="review-card testimonials__card" style={{ minWidth: '350px', border: '1px solid #eee', padding: '28px', borderRadius: '20px' }}>
                                <div className="review-card__stars" style={{ color: '#FFC633', fontSize: '22px', marginBottom: '15px' }}>★★★★★</div>
                                <div className="review-card__user" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
                                    <h4 className="review-card__name" style={{ margin: 0, fontSize: '20px' }}>James L.</h4>
                                    <img src="/images/verified.svg" alt="Verified" className="review-card__verified-icon" />
                                </div>
                                <p className="review-card__text" style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>"As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."</p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
