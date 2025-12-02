const users = {
    admin: { 
        username: 'admin', 
        password: '123', 
        role: 'admin',
        fullName: 'Admin Khan'
    },
    teacher: { 
        username: 'teacher', 
        password: '123', 
        role: 'teacher',
        fullName: 'Usman Ali'
    },
    student: { 
        username: 'student', 
        password: '123', 
        role: 'student',
        fullName: 'Ayesha Fatima'
    }
};

const dashboardPages = {
    admin: 'admin.html',
    teacher: 'teacher.html',
    student: 'student.html'
};

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
            
            const activity = JSON.parse(localStorage.getItem('systemActivity')) || [];
            activity.push({
                action: 'User Login',
                user: users[role].fullName,
                time: new Date().toLocaleString()
            });
            localStorage.setItem('systemActivity', JSON.stringify(activity));
            
            alert('Login successful! Welcome ' + users[role].fullName);
            
            window.location.href = dashboardPages[role];
            
        } else {
            alert('Invalid credentials! Please check your username and password.');
            document.getElementById('password').value = '';
        }
    });
}

function logout() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const activity = JSON.parse(localStorage.getItem('systemActivity')) || [];
        activity.push({
            action: 'User Logout',
            user: currentUser.fullName,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('systemActivity', JSON.stringify(activity));
    }
    
    localStorage.removeItem('currentUser');
    window.location.href = 'main.html';
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        alert('Please login first!');
        window.location.href = 'main.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function hasRole(requiredRole) {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
}

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

if (loginForm) {
    const existingUser = getCurrentUser();
    if (existingUser) {
        const redirectNow = confirm('You are already logged in as ' + existingUser.fullName + '. Go to dashboard?');
        if (redirectNow) {
            window.location.href = dashboardPages[existingUser.role];
        }
    }
}