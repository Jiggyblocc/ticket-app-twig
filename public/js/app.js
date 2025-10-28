/**
 * 1. SIMULATED AUTHENTICATION FUNCTIONS
 * Uses localStorage with the required key 'ticketapp_session'.
 */

const SESSION_KEY = 'ticketapp_session';
const USER_CREDENTIALS = {
    // REQUIRED: Example test user credentials
    'testuser': 'password123',
    'admin': 'adminpass'
};

const AuthService = {
    login: (username, password) => {
        if (USER_CREDENTIALS[username] === password) {
            const sessionData = { 
                username: username, 
                token: `mock_token_${Date.now()}`,
                isAuthenticated: true
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            console.log(`User ${username} logged in successfully.`);
            return true;
        }
        console.error('Login failed: Invalid credentials.');
        return false;
    },
    
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        console.log('User logged out.');
        // In a real app, you'd redirect here.
        window.location.href = '/login'; 
    },

    isAuthenticated: () => {
        const session = localStorage.getItem(SESSION_KEY);
        try {
            const data = JSON.parse(session);
            return data && data.isAuthenticated === true;
        } catch (e) {
            return false;
        }
    },

    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session).username : null;
    }
};

window.AuthService = AuthService; // Global access

/**
 * 2. TICKET DATA VALIDATION AND UTILITIES
 */

// REQUIRED: Status validation values
const ALLOWED_STATUSES = ['open', 'in_progress', 'closed'];

const TicketService = {
    validateTicket: (ticket) => {
        const errors = [];
        
        // MANDATORY: Title field validation
        if (!ticket.title || ticket.title.trim().length === 0) {
            errors.push("Title field is mandatory and cannot be empty.");
        }
        
        // MANDATORY: Status field validation
        if (!ticket.status || !ALLOWED_STATUSES.includes(ticket.status)) {
            errors.push(`Status field is mandatory and must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
        }

        // REQUIRED: Flawless and descriptive error handling
        if (errors.length > 0) {
            // This is where you'd show a user-facing error toast/alert
            return { isValid: false, errors: errors };
        }

        return { isValid: true, errors: [] };
    }
};

window.TicketService = TicketService; // Global access