// ==================== AUTHENTICATION MODULE ====================
// This file handles user login and authentication

// Demo users database (simulating backend)
const users = {
    admin: { 
        username: 'admin', 
        password: 'admin123', 
        role: 'admin',
        fullName: 'System Administrator'
    },
    teacher: { 
        username: 'teacher', 
        password: 'teacher123', 
        role: 'teacher',
        fullName: 'John Teacher'
    },
    student: { 
        username: 'student', 
        password: 'student123', 
        role: 'student',
        fullName: 'Jane Student'
    }
};

// ==================== LOGIN FORM HANDLER ====================
// Get login form element
const loginForm = document.getElementById('loginForm');

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload
        
        // Get form values
        const role = document.getElementById('userRole').value;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate empty fields
        if (!role || !username || !password) {
            alert('⚠️ Please fill in all fields!');
            return;
        }
        
        // Check credentials
        if (users[role] && 
            users[role].username === username && 
            users[role].password === password) {
            
            // Save user session in localStorage
            const userData = {
                username: username,
                role: role,
                fullName: users[role].fullName,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Show success message
            alert('✅ Login successful! Welcome ' + users[role].fullName);
            
            // Redirect to respective dashboard
            // Uncomment below line when dashboard pages are ready
            // window.location.href = role + '-dashboard.html';
            
            // For now, just log to console
            console.log('✅ User logged in:', userData);
            
        } else {
            // Invalid credentials
            alert('❌ Invalid credentials! Please check your username and password.');
            
            // Clear password field
            document.getElementById('password').value = '';
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Logout function
function logout() {
    // Remove user session
    localStorage.removeItem('currentUser');
    
    // Show logout message
    console.log('👋 User logged out');
    
    // Redirect to login page
    window.location.href = 'main.html';
}

// Check if user is already logged in (use on dashboard pages)
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // No user logged in, redirect to login page
        console.log('⚠️ No user logged in, redirecting...');
        window.location.href = 'main.html';
        return null;
    }
    
    // Return user data
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

// ==================== INITIALIZATION ====================
// Console log for debugging
console.log('🔐 Auth module loaded successfully');

// Display current login status
const currentUser = getCurrentUser();
if (currentUser) {
    console.log('✅ User already logged in:', currentUser);
} else {
    console.log('ℹ️ No user logged in');
}
