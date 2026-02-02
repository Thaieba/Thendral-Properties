// Admin Authentication System
// WARNING: This is a client-side demo implementation
// For production, use server-side authentication with secure password hashing

const USERS = {
    superadmin: {
        password: 'Thendral@2024',
        role: 'superadmin',
        name: 'Super Administrator'
    },
    admin: {
        password: 'Admin@2024',
        role: 'admin',
        name: 'Administrator'
    }
};

// Session management
const SESSION_KEY = 'thendral_admin_session';
const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

// Login function
function login(username, password) {
    const user = USERS[username];

    if (!user) {
        return { success: false, message: 'Invalid username or password' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Invalid username or password' };
    }

    // Create session
    const session = {
        username: username,
        role: user.role,
        name: user.name,
        loginTime: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, role: user.role };
}

// Logout function
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'admin-login.html';
}

// Check if user is authenticated
function isAuthenticated() {
    const sessionData = localStorage.getItem(SESSION_KEY);

    if (!sessionData) {
        return false;
    }

    try {
        const session = JSON.parse(sessionData);

        // Check if session has expired
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }

        return true;
    } catch (e) {
        localStorage.removeItem(SESSION_KEY);
        return false;
    }
}

// Get current session
function getSession() {
    const sessionData = localStorage.getItem(SESSION_KEY);

    if (!sessionData) {
        return null;
    }

    try {
        const session = JSON.parse(sessionData);

        // Check if session has expired
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        return session;
    } catch (e) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

// Extend session (refresh timeout)
function extendSession() {
    const session = getSession();

    if (session) {
        session.expiresAt = Date.now() + SESSION_TIMEOUT;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
}

// Protect page (redirect to login if not authenticated)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'admin-login.html';
        return false;
    }

    // Extend session on page load
    extendSession();
    return true;
}

// Check if user has specific role
function hasRole(requiredRole) {
    const session = getSession();

    if (!session) {
        return false;
    }

    if (requiredRole === 'superadmin') {
        return session.role === 'superadmin';
    }

    // Both superadmin and admin have admin privileges
    if (requiredRole === 'admin') {
        return session.role === 'superadmin' || session.role === 'admin';
    }

    return false;
}

// Activity monitor to extend session on user interaction
let activityTimeout;

function resetActivityTimer() {
    clearTimeout(activityTimeout);

    activityTimeout = setTimeout(() => {
        if (isAuthenticated()) {
            extendSession();
        }
    }, 60000); // Check every minute
}

// Set up activity monitoring
if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', resetActivityTimer);
    document.addEventListener('keypress', resetActivityTimer);
    document.addEventListener('click', resetActivityTimer);
    document.addEventListener('scroll', resetActivityTimer);
}
