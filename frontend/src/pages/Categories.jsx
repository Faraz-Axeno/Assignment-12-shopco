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
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Shop by Category</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {categories.map(category => (
                    <Link 
                        key={category._id} 
                        to={`/products?category=${category._id}`}
                        style={{
                            display: 'block',
                            padding: '40px 20px',
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '10px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            color: '#000',
                            transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{category.name}</h2>
                        <p style={{ color: '#6c757d' }}>{category.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
