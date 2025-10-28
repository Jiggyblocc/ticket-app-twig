/**
 * Authentication and Session Management Logic
 * Handles login simulation, logout, and session checks using localStorage.
 */

const SESSION_KEY = 'ticketapp_session';
const TEST_EMAIL = 'test@user.com';
const TEST_PASSWORD = 'password123';

// --- Utility Functions ---

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if the session key is present.
 */
function isAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === 'active';
}

/**
 * Redirects authenticated users away from login/landing pages (e.g., if they try to access /login while logged in).
 * @param {string} targetUrl The URL to redirect to if authenticated.
 */
function requireUnauthenticated(targetUrl = '/dashboard') {
    if (isAuthenticated()) {
        window.location.href = targetUrl;
    }
}

/**
 * Enforces authentication, redirecting unauthenticated users to the login page.
 * CRITICAL for protecting the Dashboard.
 * @param {string} targetUrl The URL to redirect unauthenticated users to.
 */
function requireAuthentication(targetUrl = '/login') {
    if (!isAuthenticated()) {
        window.location.href = targetUrl;
    }
}

/**
 * Simulates the login process using test credentials.
 */
function simulateLogin(email, password) {
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        // Set the required session key in localStorage upon success
        localStorage.setItem(SESSION_KEY, 'active'); 
        return true;
    }
    return false;
}

/**
 * Handles the logout process.
 */
function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    // Reload to update the nav bar and redirect to the landing page
    window.location.href = '/'; 
}


// --- Event Listeners and Execution ---

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    // CRITICAL: Ensure this ID matches the button in base.html.twig
    const logoutBtn = document.getElementById('logout-btn'); 
    const loginError = document.getElementById('login-error');

    // 1. Login Form Submission Handler (Only runs on /login page)
    if (loginForm) {
        requireUnauthenticated(); 

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (simulateLogin(email, password)) {
                // Successful login, redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                localStorage.removeItem(SESSION_KEY);
                loginError.textContent = 'Invalid email or password.';
                loginError.style.display = 'block';
            }
        });
    }

    // 2. Logout Button Handler (Runs on all pages via base.html.twig)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});