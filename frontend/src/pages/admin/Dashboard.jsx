import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Package, PlusCircle, Menu, X, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [uploading, setUploading] = useState(false);

    // New product form state
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category: '', description: '', image: '',
        sizes: {
            'XX-Small': 0, 'X-Small': 0, 'Small': 0, 'Medium': 0,
            'Large': 0, 'X-Large': 0, 'XX-Large': 0, '3X-Large': 0, '4X-Large': 0
        }
    });

    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    const fetchData = async () => {
        try {
            const [statsRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/orders/stats', config),
                axios.get('http://localhost:5000/api/products?pageSize=100', config),
                axios.get('http://localhost:5000/api/orders', config),
                axios.get('http://localhost:5000/api/categories')
            ]);
            setStats(statsRes.data);
            setProducts(productsRes.data.products);
            setOrders(ordersRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });
            setNewProduct(prev => ({ ...prev, image: data.url }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Upload failed. Ensure Cloudinary is configured on backend.');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', {
                ...newProduct,
                images: [newProduct.image || '/images/sample.jpg'], // fallback
                price: Number(newProduct.price),
                sizes: Object.fromEntries(Object.entries(newProduct.sizes).map(([k, v]) => [k, Number(v)]))
            }, config);
            alert('Product added successfully!');
            fetchData();
            setNewProduct({
                name: '', price: '', category: '', description: '', image: '',
                sizes: {
                    'XX-Small': 0, 'X-Small': 0, 'Small': 0, 'Medium': 0,
                    'Large': 0, 'X-Large': 0, 'XX-Large': 0, '3X-Large': 0, '4X-Large': 0
                }
            });
        } catch (err) {
            alert('Failed to add product');
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteProduct = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchData();
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    }

    return (
        <div className="admin-dashboard">
            {/* Mobile Hamburger Button */}
            <button 
                className="admin-mobile-toggle admin-mobile-toggle-btn" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <h2 className="admin-logo">Admin Panel</h2>
                <nav className="admin-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
                        <LayoutDashboard size={20} className="icon" /> Dashboard
                    </button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}>
                        <ShoppingBag size={20} className="icon" /> Products
                    </button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}>
                        <Package size={20} className="icon" /> Orders
                    </button>
                    <button className={activeTab === 'add-product' ? 'active' : ''} onClick={() => { setActiveTab('add-product'); setIsSidebarOpen(false); }}>
                        <PlusCircle size={20} className="icon" /> Add Product
                    </button>
                </nav>
            </aside>
            
            <main className="admin-main">
                {activeTab === 'dashboard' && stats && (
                    <div className="fade-in">
                        <h2 className="section-header">Dashboard Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Products</h3>
                                <p className="stat-value">{stats.totalProducts}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Orders</h3>
                                <p className="stat-value">{stats.totalOrders}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p className="stat-value">{stats.totalUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Categories</h3>
                                <p className="stat-value">{stats.totalCategories}</p>
                            </div>
                            <div className="stat-card warning">
                                <h3>Low Stock (≤5)</h3>
                                <p className="stat-value">{stats.lowStockProducts}</p>
                            </div>
                            <div className="stat-card danger">
                                <h3>Out of Stock</h3>
                                <p className="stat-value">{stats.outOfStockProducts}</p>
                            </div>
                        </div>
                    </div>
                )}
               
                
                {activeTab === 'products' && (
                    <div className="fade-in">
                        <h2 className="section-header">Manage Products</h2>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id}>
                                            <td><img src={p.images[0]} alt={p.name} className="admin-product-thumb"/></td>
                                            <td>{p.name}</td>
                                            <td>${p.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${p.quantity === 0 ? 'badge-danger' : p.quantity <= 5 ? 'badge-warning' : 'badge-success'}`}>
                                                    {p.quantity}
                                                </span>
                                            </td>
                                            <td>{p.category?.name || 'Uncategorized'}</td>
                                            <td>
                                                <button className="btn-icon delete-btn" onClick={() => deleteProduct(p._id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'orders' && (
                    <div className="fade-in">
                        <h2 className="section-header">Manage Orders</h2>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o._id}>
                                            <td className="truncate">{o._id}</td>
                                            <td>{o.user ? o.user.name : 'Unknown'}</td>
                                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                            <td>${o.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${o.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select 
                                                    className="status-select"
                                                    value={o.status} 
                                                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'add-product' && (
                    <div className="fade-in form-wrapper">
                        <h2 className="section-header">Add New Product</h2>
                        <form className="admin-form" onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input type="number" min="0" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Stock per Size</label>
                                <div className="admin-size-grid">
                                    {Object.keys(newProduct.sizes).map(size => (
                                        <div key={size} className="admin-size-item">
                                            <label className="admin-size-label">{size}</label>
                                            <input 
                                                type="number" min="0" required 
                                                value={newProduct.sizes[size]} 
                                                onChange={e => setNewProduct({...newProduct, sizes: {...newProduct.sizes, [size]: e.target.value}})} 
                                                className="admin-size-input"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required rows="4" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Image (Upload via Cloudinary)</label>
                                <input type="file" onChange={handleUpload} accept="image/*" />
                                {uploading && <p className="upload-text">Uploading image...</p>}
                                {newProduct.image && (
                                    <div className="image-preview">
                                        <img src={newProduct.image} alt="Preview" />
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn-primary form-btn" disabled={uploading}>Add Product</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
