import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card__image-container" style={{ aspectRatio: '1/1', height: 'auto', background: 'transparent' }}>
                <img src={product.images[0]} alt={product.name} className="product-card__image" style={{ objectFit: 'contain', width: '100%', height: '100%', mixBlendMode: 'normal' }} />
            </div>
            <h3 className="product-card__title" style={{ textTransform: 'none', whiteSpace: 'normal', overflow: 'visible' }}>{product.name}</h3>
            <div className="product-card__rating">
                <span style={{ display: 'flex', gap: '2px', fontSize: '18px' }}>
                    <span className="star--full">★</span>
                    <span className="star--full">★</span>
                    <span className="star--full">★</span>
                    <span className="star--full">★</span>
                    <span className="star--half">
                        <span className="star__bg">★</span>
                        <span className="star__fill">★</span>
                    </span>
                </span>
                <span className="product-card__rating-text">4.5/5</span>
            </div>
            <div className="product-card__price-container">
                <span className="product-card__price">${product.price}</span>
                {product.name.includes('Jeans') && (
                    <>
                        <span className="product-card__price-old" style={{ marginLeft: '10px' }}>$260</span>
                        <span className="product-card__badge" style={{ marginLeft: '10px' }}>-20%</span>
                    </>
                )}
                {product.name.includes('Striped') && (
                    <>
                        <span className="product-card__price-old" style={{ marginLeft: '10px' }}>$160</span>
                        <span className="product-card__badge" style={{ marginLeft: '10px' }}>-30%</span>
                    </>
                )}
            </div>
            {product.quantity <= 0 && <p style={{color: 'red', marginTop: '5px', fontSize: '12px', fontWeight: 'bold'}}>OUT OF STOCK</p>}
        </Link>
    );
};

export default ProductCard;
