import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductListing = () => {
    const query = useQuery();
    const navigate = useNavigate();
    
    const initialKeyword = query.get('keyword') || '';
    const initialCategory = query.get('category') || '';
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState(initialKeyword);
    const [category, setCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock, setInStock] = useState(false);
    const [sort, setSort] = useState('newest');
    
    // UI-only filters
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
    const [selectedColorFilter, setSelectedColorFilter] = useState('');
    const [selectedSizeFilter, setSelectedSizeFilter] = useState('Large');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const location = useLocation();
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await axios.get('http://localhost:5000/api/categories');
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const catName = queryParams.get('categoryName');
        const catId = queryParams.get('category');
        
        if (catName && categories.length > 0) {
            const foundCat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            if (foundCat && foundCat._id !== category) {
                setCategory(foundCat._id);
                setPage(1);
            }
        } else if (catId && catId !== category) {
            setCategory(catId);
            setPage(1);
        } else if (!catName && !catId && location.search !== '?sort=newest') {
            // Only clear category if there is explicitly no category in URL.
            // But actually we don't sync state to URL on every click, so if they click a filter in the sidebar,
            // location.search doesn't have it. If we clear it here, it will break their sidebar filter!
            // Wait, location.search only changes if they navigate using a Link.
            // When they navigate using a Link, the component might unmount, or it might just receive new location.
            // We should just check if the URL *changed* to something without category, but only if they actually clicked a link.
            // A simpler fix: If they are on a pure /products page with no query params (or just ?sort), reset.
            if (location.search === '' || location.search === '?sort=newest') {
                if (category !== '') {
                    setCategory('');
                    setPage(1);
                }
            }
        }
    }, [location.search, categories]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/products?pageNumber=${page}&sort=${sort}`;
            if (keyword) url += `&keyword=${keyword}`;
            if (category) url += `&category=${category}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;
            if (inStock) url += `&inStock=true`;

            const { data } = await axios.get(url);
            setProducts(data.products);
            setPages(data.pages);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, [page, sort, keyword, category, minPrice, maxPrice, inStock]);

    useEffect(() => {
        // Debounce search/filter changes
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const handleFilterChange = () => {
        setPage(1); // Reset page on filter change
    };

    const currentCategory = categories.find(c => c._id === category);
    const categoryTitle = currentCategory ? currentCategory.name : 'All Products';

    return (
        <div className="pl-page">
            <div className="breadcrumb pl-breadcrumb">
                Home &gt; {categoryTitle}
            </div>
            
            <div className="pl-container">
                {/* Left Sidebar */}
                <div className={`sidebar-wrapper ${isMobileFilterOpen ? 'active' : ''}`}>
                    <aside className={`sidebar-container pl-sidebar ${isMobileFilterOpen ? 'active' : ''}`}>
                        <div className="pl-filter-header">
                            <h3>Filters</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="pl-filter-close">&times;</button>
                            <img src="/images/filter.svg" alt="Filter" className="pl-filter-icon" />
                        </div>
                    
                    <ul className="pl-filter-list pl-filter-section">
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <label className={category === cat._id ? 'active' : ''}>
                                    <input type="radio" name="type" value={cat._id} checked={category === cat._id} onChange={() => { setCategory(cat._id); setPage(1); setIsMobileFilterOpen(false); }} />
                                    {cat.name} <span>&gt;</span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <div className="pl-filter-section">
                        <div className="pl-filter-section-header">
                            <h4>Price</h4>
                            <span className="pl-filter-chevron">&#8963;</span>
                        </div>
                        <input type="range" min="0" max="1000" value={maxPrice || 1000} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className="pl-price-range" />
                        <div className="pl-price-labels">
                            <span>$0</span>
                            <span>${maxPrice || 1000}</span>
                        </div>
                    </div>

                    <div className="pl-filter-section">
                        <div className="pl-filter-section-header">
                            <h4>Size</h4>
                            <span className="pl-filter-chevron">&#8963;</span>
                        </div>
                        <div className="pl-size-grid">
                            {['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map((size, idx) => (
                                <button key={idx} onClick={() => setSelectedSizeFilter(size)} className={selectedSizeFilter === size ? 'pl-size-btn active' : 'pl-size-btn'}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pl-filter-section">
                        <div className="pl-filter-section-header">
                            <h4>Dress Style</h4>
                            <span className="pl-filter-chevron">&#8963;</span>
                        </div>
                        <ul className="pl-filter-list">
                            {categories.map((cat) => (
                                <li key={cat._id}>
                                    <label className={category === cat._id ? 'active' : ''}>
                                        <input type="radio" name="category" value={cat._id} checked={category === cat._id} onChange={(e) => setCategory(e.target.value)} />
                                        {cat.name} <span>&gt;</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={() => setIsMobileFilterOpen(false)} className="pl-apply-btn">Apply Filter</button>
                </aside>
                </div>

                {/* Right Content */}
                <main className="pl-main">
                    <div className="pl-top-bar">
                        <h1 className="pl-top-title">{categoryTitle}</h1>
                        <div className="pl-top-controls">
                            <span>Showing {products.length > 0 ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, total)} of {total} Products</span>
                            <div>
                                Sort by: 
                                <select value={sort} onChange={(e) => { setSort(e.target.value); handleFilterChange(); }} className="pl-sort-select">
                                    <option value="newest">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                            <button className="mobile-filter-trigger" onClick={() => setIsMobileFilterOpen(true)}>
                                <img src="/images/filter.svg" alt="Filter" className="pl-filter-icon pl-filter-icon-visible" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <h2>Loading...</h2>
                    ) : products.length === 0 ? (
                        <h2>No products found</h2>
                    ) : (
                        <div className="listing-product-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {pages > 1 && (
                        <div className="pl-pagination-container">
                            <button 
                                onClick={() => setPage(page - 1)} 
                                disabled={page === 1}
                                className="pl-pagination-btn"
                            >
                                <span className="pl-pagination-arrow">&larr;</span> Previous
                            </button>
                            
                            <div className="pl-pagination-pages">
                                <button 
                                    onClick={() => setPage(1)}
                                    className={page === 1 ? 'pl-page-btn active' : 'pl-page-btn'}
                                >
                                    1
                                </button>
                                
                                {pages > 1 && (
                                    <button 
                                        onClick={() => setPage(2)}
                                        className={page === 2 ? 'pl-page-btn active' : 'pl-page-btn'}
                                    >
                                        2
                                    </button>
                                )}

                                {pages > 3 && <span className="pl-page-dots">...</span>}

                                {pages > 2 && (
                                    <button 
                                        onClick={() => setPage(pages)}
                                        className={page === pages ? 'pl-page-btn active' : 'pl-page-btn'}
                                    >
                                        {pages}
                                    </button>
                                )}
                            </div>

                            <button 
                                onClick={() => setPage(page + 1)} 
                                disabled={page === pages}
                                className="pl-pagination-btn"
                            >
                                Next <span className="pl-pagination-arrow">&rarr;</span>
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListing;
