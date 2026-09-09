import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">SHOP.CO</h1>
                <h2 className="login-subtitle">Create an account</h2>

                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

                <form className="login-form" onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="form-input" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="form-input" 
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
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            className="form-input" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary login-btn">Sign Up</button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
