import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedColor, setSelectedColor] = useState('olive');
    const [selectedSize, setSelectedSize] = useState('Large');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star--full">★</span>);
        }
        if (hasHalfStar) {
            stars.push(
                <span key="half" className="star--half">
                    <span className="star__bg">★</span>
                    <span className="star__fill">★</span>
                </span>
            );
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star--empty">★</span>);
        }

        return (
            <span className="pd-stars-container">
                {stars}
            </span>
        );
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`);
                setProduct(data);

                // Fetch related products
                const categoryId = data.category ? (data.category._id || data.category) : '';
                if (categoryId) {
                    const { data: relatedData } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products?category=${categoryId}&pageSize=5`);
                    setRelatedProducts(relatedData.products.filter(p => p._id !== data._id).slice(0, 4));
                }
            } catch (error) {
                console.error(error);
                setProduct(null);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!product || outOfStock) return;
        addToCart(product, qty, selectedColor, selectedSize);
        toast.success('Added to cart successfully!');
    };

    const currentSizeStock = product ? (product.sizes && product.sizes[selectedSize] !== undefined ? product.sizes[selectedSize] : product.quantity) : 0;

    useEffect(() => {
        if (product && qty > currentSizeStock) {
            setQty(Math.max(1, currentSizeStock));
        }
    }, [selectedSize, currentSizeStock, qty, product]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const outOfStock = currentSizeStock <= 0;

    return (
        <div className="pd-page">
            <div className="breadcrumb pd-breadcrumb">
                Home &gt; Shop &gt; {product.name}
            </div>

            <section className="product">
                <div className="product__container">
                    <div className="product__gallery">
                        <div className="product__thumbnails">
                            {(product.images?.length > 1 ? product.images : [product.images[0], product.images[0], product.images[0]]).slice(0, 3).map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`product__thumbnail-btn pd-thumbnail-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="product__thumbnail-img pd-contain-img" />
                                </button>
                            ))}
                        </div>

                        <div className="product__main-image pd-transparent-bg">
                            <img
                                src={(product.images?.length > 1 ? product.images : [product.images[0], product.images[0], product.images[0]])[selectedImageIndex] || product.images[0]}
                                alt={product.name}
                                className="product__main-img pd-contain-img"
                            />
                        </div>
                    </div>

                    <div className="product__info">
                        <h1 className="product__title pd-title-normal">{product.name}</h1>

                        <div className="product__rating">
                            <span className="stars">
                                {renderStars(product.rating || 4.5)}
                            </span>
                            <span className="product__rating-text">
                                <span className="pd-rating-num">{product.rating || 4.5}</span>/5
                            </span>
                        </div>

                        <div className="product__price-wrapper">
                            <span className="product__price">${product.price}</span>
                            {product.price > 150 && <span className="product__price product__price--old">${product.price + 40}</span>}
                            {product.price > 150 && <span className="product__badge">-{(40 / (product.price + 40) * 100).toFixed(0)}%</span>}
                        </div>

                        <p className="product__description">
                            {product.description}
                        </p>

                        <hr className="divider" />

                        <div className="product__options product__options--color">
                            <p className="product__option-label">Select Colors</p>
                            <div className="product__color-list">
                                <button className={`product__color-btn product__color-btn--olive ${selectedColor === 'olive' ? 'product__color-btn--active' : ''}`} aria-label="Olive Green" onClick={() => setSelectedColor('olive')}></button>
                                <button className={`product__color-btn product__color-btn--slate ${selectedColor === 'slate' ? 'product__color-btn--active' : ''}`} aria-label="Dark Slate Gray" onClick={() => setSelectedColor('slate')}></button>
                                <button className={`product__color-btn product__color-btn--blue ${selectedColor === 'blue' ? 'product__color-btn--active' : ''}`} aria-label="Dark Blue" onClick={() => setSelectedColor('blue')}></button>
                            </div>
                        </div>

                        <hr className="divider" />

                        <div className="product__options product__options--size">
                            <p className="product__option-label">Choose Size</p>
                            <div className="product__size-list">
                                {['Small', 'Medium', 'Large', 'X-Large'].map(size => (
                                    <button
                                        key={size}
                                        className={`product__size-btn ${selectedSize === size ? 'product__size-btn--active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="divider" />

                        <div className="product__actions">
                            <div className="quantity">
                                <button className="quantity__btn quantity__btn--minus" aria-label="Decrease quantity" onClick={() => setQty((prev) => Math.max(1, prev - 1))} disabled={outOfStock}>-</button>
                                <input type="number" className="quantity__input" value={qty} readOnly aria-label="Product quantity" />
                                <button className="quantity__btn quantity__btn--plus" aria-label="Increase quantity" onClick={() => setQty((prev) => Math.min(currentSizeStock, prev + 1))} disabled={outOfStock}>+</button>
                            </div>

                            <button className="product__add-to-cart" onClick={handleAddToCart} disabled={outOfStock}>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="product-tabs">
                <div className="product-tabs__container">
                    <div className="product-tabs__list" role="tablist">
                        <button className="product-tabs__tab" role="tab" aria-selected="false">Product Details</button>
                        <button className="product-tabs__tab product-tabs__tab--active" role="tab" aria-selected="true">Rating & Reviews</button>
                        <button className="product-tabs__tab" role="tab" aria-selected="false">FAQs</button>
                    </div>
                </div>
            </section>

            <section className="reviews">
                <div className="reviews__container">
                    <div className="reviews__header">
                        <div className="reviews__title-group">
                            <h3 className="reviews__title">All Reviews</h3>
                            <span className="reviews__count">({product.reviews ? product.reviews.length : 0})</span>
                        </div>

                        <div className="reviews__actions">
                            <button className="reviews__btn reviews__btn--icon" aria-label="Filter reviews">
                                <img src="/images/filter.svg" alt="Filter" />
                            </button>

                            <div className="reviews__select-wrapper">
                                <select className="reviews__select" aria-label="Sort reviews">
                                    <option value="latest">Latest</option>
                                    <option value="highest">Highest Rating</option>
                                    <option value="lowest">Lowest Rating</option>
                                </select>
                            </div>

                            <button className="reviews__btn reviews__btn--primary">Write a Review</button>
                        </div>
                    </div>

                    <div className="reviews__grid">
                        {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                            <article className="review-card" key={review._id}>
                                <div className="review-card__header">
                                    {renderStars(review.rating)}
                                    <button className="review-card__options" aria-label="More options"><img src="/images/dots.svg" alt="Options" /></button>
                                </div>
                                <div className="review-card__user">
                                    <h4 className="review-card__name">{review.name}</h4>
                                    <img src="/images/verified.svg" alt="Verified User" className="review-card__verified-icon" />
                                </div>
                                <p className="review-card__text">
                                    "{review.comment}"
                                </p>
                                <p className="review-card__date">Posted on {review.date}</p>
                            </article>
                        )) : <p>No reviews yet.</p>}
                    </div>

                    <div className="pd-load-more-container">
                        <button className="reviews__btn pd-load-more-btn">Load More Reviews</button>
                    </div>
                </div>
            </section>

            <section className="related-products pd-related-section">
                <h2 className="related-products__title pd-related-title">YOU MIGHT ALSO LIKE</h2>
                <div className="product-grid pd-related-grid">
                    {relatedProducts.map(relProduct => (
                        <ProductCard key={relProduct._id} product={relProduct} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
