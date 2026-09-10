import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?._id}` } };
                const { data: profile } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/profile`, config);
                setPhone(profile.phone || '');
                setAddress(profile.address || '');

                const { data: userOrders } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/mine`, config);
                setOrders(userOrders);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load profile data');
            }
            setLoading(false);
        };
        fetchProfileData();
    }, [user?._id]);

    const handleCancelOrderClick = (orderId) => {
        setOrderToCancel(orderId);
        setCancelModalOpen(true);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user?._id}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/${orderToCancel}/cancel`, {}, config);
            setOrders(orders.map(o => o._id === orderToCancel ? { ...o, status: 'Cancelled' } : o));
            toast.success('Order cancelled successfully');
            setCancelModalOpen(false);
            setOrderToCancel(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
            setCancelModalOpen(false);
            setOrderToCancel(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?._id}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/profile`, { name, email, phone, address }, config);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        }
    };

    const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsExpanded(true);
            } else {
                setIsExpanded(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className="profile-loading">Loading profile...</div>;

    return (
        <div className="profile-page">
            <div className="profile-sidebar">
                <div className="profile-header">
                    <h2>User Profile</h2>
                    <button className="profile-toggle-btn" onClick={() => setIsExpanded(!isExpanded)} aria-label="Toggle profile">
                        <img src="/images/dropdown-image.svg" alt="Toggle" className={"profile-toggle-icon " + (isExpanded ? "profile-toggle-icon--expanded" : "")} />
                    </button>
                </div>
                
                {isExpanded && (
                    <div className="profile-fade-in">
                        <form onSubmit={handleUpdate} noValidate>
                            <div className="profile-form-group">
                                <label>Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="profile-form-group">
                                <label>Email</label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="profile-form-group">
                                <label>Phone</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="profile-form-group">
                                <label>Address</label>
                                <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" />
                            </div>
                            <button type="submit" className="btn-update">Update Profile</button>
                        </form>
                    </div>
                )}
            </div>

            <div className="profile-content">
                <h2 className="order-history-title">Order History</h2>
                {orders.length === 0 ? (
                    <p className="no-orders-msg">You have no orders.</p>
                ) : (
                    <div className="order-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-card-header">
                                    <strong className="order-id">Order ID: {order._id}</strong>
                                    <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-status-row">
                                    <span className={"order-status-badge " + (order.status === 'Pending' ? 'order-status-badge--pending' : order.status === 'Cancelled' ? 'order-status-badge--cancelled' : 'order-status-badge--delivered')}>
                                        {order.status}
                                    </span>
                                    {(order.status === 'Pending' || order.status === 'Processing') && (
                                        <button 
                                            onClick={() => handleCancelOrderClick(order._id)}
                                            className="btn-cancel-order"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                                <div className="order-items-scroll">
                                    {order.orderItems.map(item => (
                                        <div key={item.product} className="order-item-thumb">
                                            <Link to={`/product/${item.product}`}>
                                                <img src={item.image} alt={item.name} className="order-item-img" title={`${item.name} x${item.qty}`} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-total">
                                    Total: ${order.totalPrice.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {cancelModalOpen && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal-content">
                        <div className="profile-modal-header">
                            <h3 className="profile-modal-title">Cancel Order</h3>
                            <button className="profile-modal-close-btn" onClick={() => setCancelModalOpen(false)}>&times;</button>
                        </div>
                        <p className="profile-modal-text">Are you sure you want to cancel this order?</p>
                        <div className="profile-modal-actions">
                            <button className="profile-modal-btn-cancel" onClick={() => setCancelModalOpen(false)}>No, Keep it</button>
                            <button className="profile-modal-btn-confirm" onClick={confirmCancelOrder}>Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
