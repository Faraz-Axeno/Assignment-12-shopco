import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`} className="product-card product-card-link-override">
            <div className="product-card__image-container product-card-image-container-override">
                <img src={product.images[0]} alt={product.name} className="product-card__image product-card-image-override" />
            </div>
            <h3 className="product-card__title product-card-title-override">{product.name}</h3>
            <div className="product-card__rating">
                <span className="product-card-stars-override">
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
                        <span className="product-card__price-old product-card-ml-10">$260</span>
                        <span className="product-card__badge product-card-ml-10">-20%</span>
                    </>
                )}
                {product.name.includes('Striped') && (
                    <>
                        <span className="product-card__price-old product-card-ml-10">$160</span>
                        <span className="product-card__badge product-card-ml-10">-30%</span>
                    </>
                )}
            </div>
            {product.quantity <= 0 && <p className="product-card-out-of-stock">OUT OF STOCK</p>}
        </Link>
    );
};

export default ProductCard;
