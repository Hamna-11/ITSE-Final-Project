// ==================== AUTHENTICATION MODULE ====================

// Demo users database
const users = {
    admin: { 
        username: 'admin', 
        password: '123', 
        role: 'admin',
        fullName: 'System Administrator'
    },
    teacher: { 
        username: 'teacher', 
        password: '123', 
        role: 'teacher',
        fullName: 'John Teacher'
    },
    student: { 
        username: 'student', 
        password: '123', 
        role: 'student',
        fullName: 'Jane Student'
    }
};

// Dashboard page mappings
const dashboardPages = {
    admin: 'admin.html',
    teacher: 'teacher.html',
    student: 'student.html'
};

// ==================== LOGIN FORM HANDLER ====================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = document.getElementById('userRole').value;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!role || !username || !password) {
            alert('Please fill in all fields!');
            return;
        }
        
        if (users[role] && 
            users[role].username === username && 
            users[role].password === password) {
            
            const userData = {
                username: username,
                role: role,
                fullName: users[role].fullName,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            alert('Login successful! Welcome ' + users[role].fullName);
            
            window.location.href = dashboardPages[role];
            
        } else {
            alert('Invalid credentials! Please check your username and password.');
            document.getElementById('password').value = '';
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'main.html';
}

// Check authentication
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        alert('Please login first!');
        window.location.href = 'main.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// Get current logged in user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Check if user has specific role
function hasRole(requiredRole) {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
}

// ==================== LOGOUT BUTTON HANDLER ====================
// This will work on dashboard pages
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// ==================== INITIALIZATION ====================
console.log('Auth module loaded successfully');

if (loginForm) {
    const existingUser = getCurrentUser();
    if (existingUser) {
        const redirectNow = confirm('You are already logged in as ' + existingUser.fullName + '. Go to dashboard?');
        if (redirectNow) {
            window.location.href = dashboardPages[existingUser.role];
        }
    }
}