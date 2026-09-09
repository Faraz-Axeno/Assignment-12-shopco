document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    const isProtectedPage = currentPath.includes('product.html') || currentPath.includes('cart.html');
    const isLoggedIn = localStorage.getItem('authState') === 'logged_in';

    if (isProtectedPage && !isLoggedIn) {
        window.location.href = 'login.html';
        return; 
    }

    const profileLink = document.querySelector('a.header__action-btn[href="login.html"], .header__action-btn[aria-label="Profile"]'); 
    if (profileLink && isLoggedIn) {
        profileLink.title = 'Logout';
        profileLink.setAttribute('aria-label', 'Logout');
        
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();

            localStorage.removeItem('authState');
            window.location.href = 'login.html';
        });
    }

    const loginForm = document.querySelector('.auth-form');
    
    if (loginForm) {
        let errorMsg = document.querySelector('.auth-error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'auth-error-msg is-hidden';
            
            const submitBtn = document.querySelector('.auth-form__submit');
            loginForm.insertBefore(errorMsg, submitBtn);
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            if (emailInput === 'admin@example.com' && passwordInput === 'Admin@123') {
                localStorage.setItem('authState', 'logged_in');
                errorMsg.classList.add('is-hidden');
                window.location.href = 'index.html';
            } else {
                errorMsg.textContent = 'Invalid email or password. Please try again.';
                errorMsg.classList.remove('is-hidden');
            }
        });
    }
});