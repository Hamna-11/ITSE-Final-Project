// auth.js - Login Authentication

// Demo users database (in real app, this would be from backend)
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    teacher: { username: 'teacher', password: 'teacher123', role: 'teacher' },
    student: { username: 'student', password: 'student123', role: 'student' }
};

// Get login form
const loginForm = document.getElementById('loginForm');

// Handle login
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = document.getElementById('userRole').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate credentials
        if (users[role] && 
            users[role].username === username && 
            users[role].password === password) {
            
            // Save user session in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                username: username,
                role: role
            }));
            
            // Redirect to respective dashboard
            window.location.href = role + '-dashboard.html';
        } else {
            alert('Invalid credentials! Please try again.');
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in (for dashboard pages)
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}