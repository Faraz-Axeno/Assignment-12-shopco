import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // We still keep the password match check on the frontend 
        // since it's just checking two form fields against each other.
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error registering');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">SHOP.CO</h1>
                <h2 className="login-subtitle">Create an account</h2>

                <form className="login-form" onSubmit={submitHandler} noValidate>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="form-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="text" 
                            id="email" 
                            className="form-input" 
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
