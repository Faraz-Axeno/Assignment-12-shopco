import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`);
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="categories-page">
            <h1 className="categories-title">Shop by Category</h1>
            <div className="categories-grid">
                {categories.map(category => (
                    <Link 
                        key={category._id} 
                        to={`/products?category=${category._id}`}
                        className="category-card"
                    >
                        <h2 className="category-card-title">{category.name}</h2>
                        <p className="category-card-desc">{category.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
