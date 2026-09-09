import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">SHOP.CO</h1>
                <h2 className="login-subtitle">Log in to your account</h2>
                <p className="login-desc">Enter your details to access your account</p>

                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

                <form className="login-form" onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="form-input" 
                            placeholder="admin@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-input" 
                            placeholder="••••••••" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary login-btn">Log In</button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup" className="login-link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
