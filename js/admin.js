const loggedInUser = checkAuth();
if (!loggedInUser || loggedInUser.role !== 'admin') {
    alert('Access Denied! Admin privileges required.');
    window.location.href = 'main.html';
}

document.getElementById('userInfo').textContent = loggedInUser.fullName;

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

const addUserModal = document.getElementById('addUserModal');
const addCourseModal = document.getElementById('addCourseModal');
const enrollStudentModal = document.getElementById('enrollStudentModal');

function openModal(modal) {
    modal.classList.add('show');
}

function closeModal(modal) {
    modal.classList.remove('show');
}

document.getElementById('addUserBtn').addEventListener('click', () => openModal(addUserModal));
document.getElementById('closeUserModal').addEventListener('click', () => closeModal(addUserModal));
document.getElementById('cancelUserBtn').addEventListener('click', () => closeModal(addUserModal));

window.addEventListener('click', (e) => {
    if (e.target === addUserModal) closeModal(addUserModal);
    if (e.target === addCourseModal) closeModal(addCourseModal);
    if (e.target === enrollStudentModal) closeModal(enrollStudentModal);
});

document.getElementById('addCourseBtn').addEventListener('click', () => {
    loadTeachersList();
    openModal(addCourseModal);
});
document.getElementById('closeCourseModal').addEventListener('click', () => closeModal(addCourseModal));
document.getElementById('cancelCourseBtn').addEventListener('click', () => closeModal(addCourseModal));

document.getElementById('enrollStudentBtn').addEventListener('click', () => {
    loadCoursesForEnrollment();
    loadStudentsForEnrollment();
    openModal(enrollStudentModal);
});
document.getElementById('closeEnrollModal').addEventListener('click', () => closeModal(enrollStudentModal));
document.getElementById('cancelEnrollBtn').addEventListener('click', () => closeModal(enrollStudentModal));

function loadTeachersList() {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const teachers = users.filter(u => u.role === 'teacher');
    const select = document.getElementById('courseTeacher');
    
    select.innerHTML = '<option value="">Select Teacher</option>';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.name;
        option.textContent = teacher.name;
        select.appendChild(option);
    });
}

function loadCoursesForEnrollment() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const select = document.getElementById('enrollCourse');
    
    select.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = course.code + ' - ' + course.name;
        select.appendChild(option);
    });
}

function loadStudentsForEnrollment() {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const students = users.filter(u => u.role === 'student');
    const select = document.getElementById('enrollStudent');
    
    select.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const username = document.getElementById('userUsername').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!name || !username || !password || !role) {
        alert('Please fill all fields!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        username: username,
        password: password,
        role: role,
        status: 'active'
    };
    
    users.push(newUser);
    localStorage.setItem('systemUsers', JSON.stringify(users));
    
    if (role === 'student') {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const rollNo = '2024-' + (students.length + 1).toString().padStart(3, '0');
        const newStudent = {
            rollNo: rollNo,
            name: name,
            course: '',
            email: username + '@student.pk'
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    alert('User added successfully!');
    this.reset();
    closeModal(addUserModal);
    loadUsersTable();
    loadOverviewStats();
});

document.getElementById('addCourseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const code = document.getElementById('courseCode').value.trim().toUpperCase();
    const name = document.getElementById('courseName').value.trim();
    const teacher = document.getElementById('courseTeacher').value;
    
    if (!code || !name || !teacher) {
        alert('Please fill all fields!');
        return;
    }
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    if (courses.find(c => c.code === code)) {
        alert('Course code already exists!');
        return;
    }
    
    const newCourse = {
        code: code,
        name: name,
        teacher: teacher,
        students: 0
    };
    
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    alert('Course added successfully!');
    this.reset();
    closeModal(addCourseModal);
    loadCoursesTable();
    loadOverviewStats();
});

document.getElementById('enrollStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentName = document.getElementById('enrollStudent').value;
    const courseCode = document.getElementById('enrollCourse').value;
    
    if (!studentName || !courseCode) {
        alert('Please select both student and course!');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    const studentIndex = students.findIndex(s => s.name === studentName);
    if (studentIndex === -1) {
        alert('Student not found!');
        return;
    }
    
    const courseIndex = courses.findIndex(c => c.code === courseCode);
    if (courseIndex === -1) {
        alert('Course not found!');
        return;
    }
    
    students[studentIndex].course = courseCode;
    courses[courseIndex].students += 1;
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('courses', JSON.stringify(courses));
    
    alert('Student enrolled successfully in ' + courseCode);
    this.reset();
    closeModal(enrollStudentModal);
    loadStudentsTable();
    loadCoursesTable();
    loadOverviewStats();
});

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
    
    activityList.innerHTML = activity.slice(-5).reverse().map(act => {
        return '<div class="activity-item"><p><strong>' + act.action + '</strong> by ' + act.user + '</p><p class="activity-time">' + act.time + '</p></div>';
    }).join('');
}

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        return '<tr><td>' + user.id + '</td><td>' + user.name + '</td><td>' + user.username + '</td><td><span class="status-badge">' + user.role + '</span></td><td><span class="status-badge ' + user.status + '">' + user.status + '</span></td><td><button class="btn-edit" data-user-id="' + user.id + '">Edit</button><button class="btn-danger" data-user-delete="' + user.id + '">Delete</button></td></tr>';
    }).join('');
    
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

function loadStudentsTable() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const tbody = document.getElementById('studentsTableBody');
    
    if (!tbody) return;
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No students found</td></tr>';
        return;
    }
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    tbody.innerHTML = students.map(student => {
        const course = courses.find(c => c.code === student.course);
        return '<tr><td>' + student.rollNo + '</td><td>' + student.name + '</td><td>' + student.email + '</td><td>' + (course ? course.name : 'Not Enrolled') + '</td><td><button class="btn-edit" data-student-roll="' + student.rollNo + '">Edit</button><button class="btn-danger" data-student-delete="' + student.rollNo + '">Delete</button></td></tr>';
    }).join('');
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const newName = prompt('Edit name:', user.name);
    if (newName) {
        user.name = newName;
        localStorage.setItem('systemUsers', JSON.stringify(users));
        alert('User updated successfully!');
        loadUsersTable();
    }
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    let users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const user = users.find(u => u.id === userId);
    
    if (user && user.role === 'student') {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(s => s.name !== user.name);
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('systemUsers', JSON.stringify(users));
    
    alert('User deleted successfully!');
    loadUsersTable();
    loadOverviewStats();
}

function loadCoursesTable() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tbody = document.getElementById('coursesTableBody');
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = courses.map((course, index) => {
        return '<tr><td>' + course.code + '</td><td>' + course.name + '</td><td>' + course.teacher + '</td><td>' + course.students + '</td><td><button class="btn-edit" data-course-index="' + index + '">Edit</button><button class="btn-danger" data-course-delete="' + index + '">Delete</button></td></tr>';
    }).join('');
    
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

function editCourse(index) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses[index];
    
    if (!course) return;
    
    const newName = prompt('Edit course name:', course.name);
    if (newName) {
        course.name = newName;
        localStorage.setItem('courses', JSON.stringify(courses));
        alert('Course updated successfully!');
        loadCoursesTable();
    }
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

document.getElementById('viewAnalytics').addEventListener('click', function() {
    const analyticsDisplay = document.getElementById('analyticsDisplay');
    const analyticsContent = document.getElementById('analyticsContent');
    
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    let html = '<h3>Performance Analytics</h3>';
    html += '<div class="stats-grid">';
    
    let totalPercentage = 0;
    let count = 0;
    resultsRecords.forEach(record => {
        record.students.forEach(student => {
            totalPercentage += parseFloat(student.percentage);
            count++;
        });
    });
    
    const avgPerformance = count > 0 ? (totalPercentage / count).toFixed(2) : 0;
    
    let totalPresent = 0;
    let totalClasses = 0;
    attendanceRecords.forEach(record => {
        record.students.forEach(student => {
            totalClasses++;
            if (student.status === 'present' || student.status === 'late') {
                totalPresent++;
            }
        });
    });
    
    const avgAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    
    html += '<div class="card"><h4>Average Performance</h4><p style="font-size: 32px; font-weight: 700; color: #3c5166;">' + avgPerformance + '%</p></div>';
    html += '<div class="card"><h4>Average Attendance</h4><p style="font-size: 32px; font-weight: 700; color: #3c5166;">' + avgAttendance + '%</p></div>';
    html += '<div class="card"><h4>Total Assessments</h4><p style="font-size: 32px; font-weight: 700; color: #3c5166;">' + resultsRecords.length + '</p></div>';
    html += '</div>';
    
    analyticsContent.innerHTML = html;
    analyticsDisplay.style.display = 'block';
});

document.getElementById('downloadReports').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Student Portal - System Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, 30);
    
    const users = JSON.parse(localStorage.getItem('systemUsers')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    doc.setFontSize(16);
    doc.text('System Statistics:', 20, 45);
    
    doc.setFontSize(12);
    doc.text('Total Users: ' + users.length, 20, 55);
    doc.text('Total Teachers: ' + users.filter(u => u.role === 'teacher').length, 20, 62);
    doc.text('Total Students: ' + users.filter(u => u.role === 'student').length, 20, 69);
    doc.text('Total Courses: ' + courses.length, 20, 76);
    doc.text('Total Assessments: ' + resultsRecords.length, 20, 83);
    doc.text('Total Attendance Records: ' + attendanceRecords.length, 20, 90);
    
    doc.save('system-report.pdf');
    alert('Report downloaded successfully!');
});

document.getElementById('generateAttendanceReport').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Attendance Report', 20, 20);
    
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    let y = 35;
    attendanceRecords.forEach((record, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(14);
        doc.text(record.courseCode + ' - ' + record.date, 20, y);
        y += 7;
        
        doc.setFontSize(10);
        record.students.forEach(student => {
            doc.text(student.rollNo + ': ' + student.status, 25, y);
            y += 6;
        });
        y += 5;
    });
    
    doc.save('attendance-report.pdf');
    alert('Attendance report downloaded!');
});

loadOverviewStats();
loadUsersTable();
loadStudentsTable();
loadCoursesTable();

console.log('Admin Dashboard loaded successfully');
console.log('Current User:', loggedInUser);