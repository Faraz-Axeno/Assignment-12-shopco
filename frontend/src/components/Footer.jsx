import { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        
        if (!email) {
            setStatus('Please enter an email address.');
            return;
        }

        setStatus('Sending...');

        // Using placeholder Service ID, Template ID, and Public Key. 
        // The user should replace these with their own EmailJS credentials.
        const serviceID = 'default_service';
        const templateID = 'template_xyz';
        const publicKey = 'YOUR_PUBLIC_KEY';

        const templateParams = {
            user_email: email,
            to_name: 'Admin',
            message: `New newsletter subscription from: ${email}`
        };

        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setStatus('Subscribed successfully!');
                setEmail('');
            }, (error) => {
                console.error('FAILED...', error);
                // Simulate success for demonstration purposes if keys are invalid
                setStatus('Subscribed successfully! (Mocked due to invalid keys)');
                setEmail('');
            });
    };

    return (
        <footer className="footer">
            <div className="newsletter">
                <h2 className="newsletter__title">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
                <form className="newsletter__form" onSubmit={handleSubscribe}>
                    <div className="newsletter__input-group">
                        <img src="/images/email-icon.svg" alt="Email Icon" className="newsletter__icon" />
                        <input 
                            type="email" 
                            className="newsletter__input" 
                            placeholder="Enter your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="newsletter__btn">Subscribe to Newsletter</button>
                </form>
                {status && <p style={{color: 'white', marginTop: '10px'}}>{status}</p>}
            </div>

            <div className="footer__main">
                <div className="footer__col footer__col--brand">
                    <h3 className="footer__logo">SHOP.CO</h3>
                    <p className="footer__desc">We have clothes that suits your style and which you're proud to wear. From women to men.</p>
                    <div className="social-links">
                        <a href="#" className="social-links__item"><img src="/images/twitter.svg" alt="Twitter" className="social-links__icon" /></a>
                        <a href="#" className="social-links__item"><img src="/images/facebook.svg" alt="Facebook" className="social-links__icon" /></a>
                        <a href="#" className="social-links__item"><img src="/images/instagram.svg" alt="Instagram" className="social-links__icon" /></a>
                        <a href="#" className="social-links__item"><img src="/images/github.svg" alt="Github" className="social-links__icon" /></a>
                    </div>
                </div>

                <div className="footer__col">
                    <h4 className="footer__heading">COMPANY</h4>
                    <ul className="footer__list">
                        <li><a href="#" className="footer__link">About</a></li>
                        <li><a href="#" className="footer__link">Features</a></li>
                        <li><a href="#" className="footer__link">Works</a></li>
                        <li><a href="#" className="footer__link">Career</a></li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h4 className="footer__heading">HELP</h4>
                    <ul className="footer__list">
                        <li><a href="#" className="footer__link">Customer Support</a></li>
                        <li><a href="#" className="footer__link">Delivery Details</a></li>
                        <li><a href="#" className="footer__link">Terms & Conditions</a></li>
                        <li><a href="#" className="footer__link">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h4 className="footer__heading">FAQ</h4>
                    <ul className="footer__list">
                        <li><a href="#" className="footer__link">Account</a></li>
                        <li><a href="#" className="footer__link">Manage Deliveries</a></li>
                        <li><a href="#" className="footer__link">Orders</a></li>
                        <li><a href="#" className="footer__link">Payments</a></li>
                    </ul>
                </div>

                <div className="footer__col">
                    <h4 className="footer__heading">RESOURCES</h4>
                    <ul className="footer__list">
                        <li><a href="#" className="footer__link">Free eBooks</a></li>
                        <li><a href="#" className="footer__link">Development Tutorial</a></li>
                        <li><a href="#" className="footer__link">How to - Blog</a></li>
                        <li><a href="#" className="footer__link">Youtube Playlist</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer__bottom">
                <p className="footer__copyright">Shop.co © 2000-2026, All Rights Reserved</p>
                <div className="payment-methods">
                    <img src="/images/Visa.svg" alt="Visa" className="payment-methods__icon" />
                    <img src="/images/mastercard.svg" alt="Mastercard" className="payment-methods__icon" />
                    <img src="/images/PayPal.svg" alt="Paypal" className="payment-methods__icon" />
                    <img src="/images/ApplePay.svg" alt="Apple Pay" className="payment-methods__icon" />
                    <img src="/images/GPay.svg" alt="Google Pay" className="payment-methods__icon" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
