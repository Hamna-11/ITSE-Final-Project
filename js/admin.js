// ==================== AUTHENTICATION CHECK ====================
const loggedInUser = checkAuth();
if (!loggedInUser || loggedInUser.role !== 'admin') {
    alert('Access Denied! Admin privileges required.');
    window.location.href = 'main.html';
}

document.getElementById('userInfo').textContent = loggedInUser.fullName;

// ==================== SIDEBAR NAVIGATION ====================
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        menuItems.forEach(mi => mi.classList.remove('active'));
        contentSections.forEach(cs => cs.classList.remove('active'));
        
        this.classList.add('active');
        
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// ==================== INITIALIZE SAMPLE DATA ====================
function initializeSampleData() {
    if (!localStorage.getItem('systemUsers')) {
        const sampleUsers = [
            { id: 1, name: 'John Teacher', username: 'teacher', role: 'teacher', status: 'active' },
            { id: 2, name: 'Jane Student', username: 'student', role: 'student', status: 'active' },
            { id: 3, name: 'Alice Johnson', username: 'alice', role: 'student', status: 'active' },
            { id: 4, name: 'Bob Smith', username: 'bob', role: 'teacher', status: 'active' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(sampleUsers));
    }
    
    if (!localStorage.getItem('courses')) {
        const sampleCourses = [
            { code: 'CS101', name: 'Introduction to Programming', teacher: 'John Teacher', students: 25 },
            { code: 'CS202', name: 'Data Structures', teacher: 'Bob Smith', students: 30 },
            { code: 'SE301', name: 'Software Engineering', teacher: 'John Teacher', students: 20 }
        ];
        localStorage.setItem('courses', JSON.stringify(sampleCourses));
    }
    
    if (!localStorage.getItem('systemActivity')) {
        const sampleActivity = [
            { action: 'User Login', user: 'John Teacher', time: new Date().toLocaleString() },
            { action: 'Attendance Marked', user: 'Bob Smith', time: new Date().toLocaleString() },
            { action: 'Results Updated', user: 'John Teacher', time: new Date().toLocaleString() }
        ];
        localStorage.setItem('systemActivity', JSON.stringify(sampleActivity));
    }
}

// ==================== LOAD OVERVIEW STATISTICS ====================
function loadOverviewStats() {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    const teachers = users.filter(u => u.role === 'teacher').length;
    const students = users.filter(u => u.role === 'student').length;
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalTeachers').textContent = teachers;
    document.getElementById('totalStudents').textContent = students;
    document.getElementById('totalCourses').textContent = courses.length;
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const activity = JSON.parse(localStorage.getItem('systemActivity')) || [];
    const activityList = document.getElementById('activityList');
    
    if (activity.length === 0) {
        activityList.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = activity.map(act => `
        <div class="activity-item">
            <p><strong>${act.action}</strong> by ${act.user}</p>
            <p class="activity-time">${act.time}</p>
        </div>
    `).join('');
}

// ==================== USER MANAGEMENT ====================
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td><span class="status-badge">${user.role}</span></td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>
                <button class="btn-edit" data-user-id="${user.id}">Edit</button>
                <button class="btn-danger" data-user-delete="${user.id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to dynamically created buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            editUser(parseInt(this.getAttribute('data-user-id')));
        });
    });
    
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteUser(parseInt(this.getAttribute('data-user-delete')));
        });
    });
}

function showAddUserModal() {
    const name = prompt('Enter full name:');
    if (!name) return;
    
    const username = prompt('Enter username:');
    if (!username) return;
    
    const role = prompt('Enter role (admin/teacher/student):');
    if (!role || !['admin', 'teacher', 'student'].includes(role)) {
        alert('Invalid role!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const newUser = {
        id: users.length + 1,
        name: name,
        username: username,
        role: role,
        status: 'active'
    };
    
    users.push(newUser);
    localStorage.setItem('systemUsers', JSON.stringify(users));
    
    alert('User added successfully!');
    loadUsersTable();
    loadOverviewStats();
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const newName = prompt('Edit name:', user.name);
    if (newName) user.name = newName;
    
    localStorage.setItem('systemUsers', JSON.stringify(users));
    alert('User updated successfully!');
    loadUsersTable();
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    let users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    users = users.filter(u => u.id !== userId);
    
    localStorage.setItem('systemUsers', JSON.stringify(users));
    alert('User deleted successfully!');
    loadUsersTable();
    loadOverviewStats();
}

// ==================== COURSE MANAGEMENT ====================
function loadCoursesTable() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tbody = document.getElementById('coursesTableBody');
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map((course, index) => `
        <tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.teacher}</td>
            <td>${course.students}</td>
            <td>
                <button class="btn-edit" data-course-index="${index}">Edit</button>
                <button class="btn-danger" data-course-delete="${index}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('[data-course-index]').forEach(btn => {
        btn.addEventListener('click', function() {
            editCourse(parseInt(this.getAttribute('data-course-index')));
        });
    });
    
    document.querySelectorAll('[data-course-delete]').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteCourse(parseInt(this.getAttribute('data-course-delete')));
        });
    });
}

function showAddCourseModal() {
    const code = prompt('Enter course code:');
    if (!code) return;
    
    const name = prompt('Enter course name:');
    if (!name) return;
    
    const teacher = prompt('Enter teacher name:');
    if (!teacher) return;
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const newCourse = {
        code: code,
        name: name,
        teacher: teacher,
        students: 0
    };
    
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    alert('Course added successfully!');
    loadCoursesTable();
    loadOverviewStats();
}

function editCourse(index) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses[index];
    
    if (!course) return;
    
    const newName = prompt('Edit course name:', course.name);
    if (newName) course.name = newName;
    
    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Course updated successfully!');
    loadCoursesTable();
}

function deleteCourse(index) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.splice(index, 1);
    
    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Course deleted successfully!');
    loadCoursesTable();
    loadOverviewStats();
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Add User button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
    
    // Add Course button
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', showAddCourseModal);
    }
});

// ==================== INITIALIZATION ====================
initializeSampleData();
loadOverviewStats();
loadUsersTable();
loadCoursesTable();

console.log('Admin Dashboard loaded successfully');
console.log('Current User:', loggedInUser);