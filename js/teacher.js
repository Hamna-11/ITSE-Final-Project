// ==================== AUTHENTICATION CHECK ====================
const loggedInUser = checkAuth();
if (!loggedInUser || loggedInUser.role !== 'teacher') {
    alert('⚠️ Access Denied! Teacher privileges required.');
    window.location.href = 'main.html';
}

// Display teacher name
document.getElementById('userInfo').textContent = loggedInUser.fullName;
document.getElementById('teacherName').textContent = loggedInUser.fullName;

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

// Helper function to show section programmatically
function showSection(sectionId) {
    menuItems.forEach(mi => mi.classList.remove('active'));
    contentSections.forEach(cs => cs.classList.remove('active'));
    
    const menuItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (menuItem) menuItem.classList.add('active');
    
    document.getElementById(sectionId).classList.add('active');
}

// ==================== INITIALIZE SAMPLE DATA ====================
function initializeTeacherData() {
    // Sample students for teacher's courses
    if (!localStorage.getItem('students')) {
        const sampleStudents = [
            { rollNo: '2024-001', name: 'Jane Student', course: 'CS101', email: 'jane@example.com' },
            { rollNo: '2024-002', name: 'Alice Johnson', course: 'CS101', email: 'alice@example.com' },
            { rollNo: '2024-003', name: 'Bob Wilson', course: 'CS101', email: 'bob@example.com' },
            { rollNo: '2024-004', name: 'Charlie Brown', course: 'SE301', email: 'charlie@example.com' },
            { rollNo: '2024-005', name: 'Diana Prince', course: 'SE301', email: 'diana@example.com' }
        ];
        localStorage.setItem('students', JSON.stringify(sampleStudents));
    }
    
    // Initialize attendance records
    if (!localStorage.getItem('attendanceRecords')) {
        localStorage.setItem('attendanceRecords', JSON.stringify([]));
    }
    
    // Initialize results records
    if (!localStorage.getItem('resultsRecords')) {
        localStorage.setItem('resultsRecords', JSON.stringify([]));
    }
}

// ==================== LOAD OVERVIEW STATISTICS ====================
function loadOverviewStats() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    
    // Filter teacher's courses
    const teacherCourses = courses.filter(c => c.teacher === loggedInUser.fullName);
    
    document.getElementById('totalCourses').textContent = teacherCourses.length;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('attendanceMarked').textContent = attendanceRecords.length;
    document.getElementById('resultsUploaded').textContent = resultsRecords.length;
    
    // Load courses in dropdowns
    loadCoursesDropdown();
    loadMyCourses();
}

// ==================== LOAD COURSES DROPDOWN ====================
function loadCoursesDropdown() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const teacherCourses = courses.filter(c => c.teacher === currentUser.fullName);
    
    // Populate attendance course dropdown
    const courseSelect = document.getElementById('courseSelect');
    courseSelect.innerHTML = '<option value="">-- Choose Course --</option>';
    teacherCourses.forEach(course => {
        courseSelect.innerHTML += `<option value="${course.code}">${course.code} - ${course.name}</option>`;
    });
    
    // Populate results course dropdown
    const resultsCourseSelect = document.getElementById('resultsCourseSelect');
    resultsCourseSelect.innerHTML = '<option value="">-- Choose Course --</option>';
    teacherCourses.forEach(course => {
        resultsCourseSelect.innerHTML += `<option value="${course.code}">${course.code} - ${course.name}</option>`;
    });
}

// ==================== LOAD MY COURSES TABLE ====================
function loadMyCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const teacherCourses = courses.filter(c => c.teacher === currentUser.fullName);
    const tbody = document.getElementById('myCoursesTableBody');
    
    if (teacherCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No courses assigned</td></tr>';
        return;
    }
    
    tbody.innerHTML = teacherCourses.map(course => `
        <tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.students}</td>
            <td>
                <button class="btn-secondary">View Details</button>
            </td>
        </tr>
    `).join('');
}

// ==================== ATTENDANCE MANAGEMENT ====================
// Set today's date as default
document.getElementById('attendanceDate').valueAsDate = new Date();

function loadStudentsForAttendance() {
    const courseCode = document.getElementById('courseSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!courseCode || !date) {
        alert('⚠️ Please select both course and date!');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courseStudents = students.filter(s => s.course === courseCode);
    
    if (courseStudents.length === 0) {
        alert('⚠️ No students found for this course!');
        return;
    }
    
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = courseStudents.map(student => `
        <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>
                <select class="attendance-status" data-roll="${student.rollNo}">
                    <option value="present">Present ✅</option>
                    <option value="absent">Absent ❌</option>
                    <option value="late">Late ⏰</option>
                </select>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('attendanceTableCard').style.display = 'block';
}

function saveAttendance() {
    const courseCode = document.getElementById('courseSelect').value;
    const date = document.getElementById('attendanceDate').value;
    const statusSelects = document.querySelectorAll('.attendance-status');
    
    if (statusSelects.length === 0) {
        alert('⚠️ No attendance data to save!');
        return;
    }
    
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    // Create attendance record
    const record = {
        courseCode: courseCode,
        date: date,
        markedBy: loggedInUser.fullName,
        timestamp: new Date().toISOString(),
        students: []
    };
    
    statusSelects.forEach(select => {
        record.students.push({
            rollNo: select.getAttribute('data-roll'),
            status: select.value
        });
    });
    
    // Check if attendance already exists for this date and course
    const existingIndex = attendanceRecords.findIndex(
        r => r.courseCode === courseCode && r.date === date
    );
    
    if (existingIndex >= 0) {
        // Update existing record
        attendanceRecords[existingIndex] = record;
        alert('✅ Attendance updated successfully!');
    } else {
        // Add new record
        attendanceRecords.push(record);
        alert('✅ Attendance saved successfully!');
    }
    
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    // Reset form
    document.getElementById('attendanceTableCard').style.display = 'none';
    document.getElementById('courseSelect').value = '';
    loadOverviewStats();
}

// ==================== RESULTS MANAGEMENT ====================
function loadStudentsForResults() {
    const courseCode = document.getElementById('resultsCourseSelect').value;
    const assessmentType = document.getElementById('assessmentType').value;
    const totalMarks = document.getElementById('totalMarks').value;
    
    if (!courseCode || !assessmentType || !totalMarks) {
        alert('⚠️ Please fill all fields!');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courseStudents = students.filter(s => s.course === courseCode);
    
    if (courseStudents.length === 0) {
        alert('⚠️ No students found for this course!');
        return;
    }
    
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = courseStudents.map(student => `
        <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>
                <input type="number" 
                       class="marks-input" 
                       data-roll="${student.rollNo}"
                       min="0" 
                       max="${totalMarks}" 
                       placeholder="Enter marks"
                       style="width: 120px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px;"
                       oninput="calculateGrade(this, ${totalMarks})">
            </td>
            <td>
                <span class="grade-display" data-roll="${student.rollNo}">-</span>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('resultsTableCard').style.display = 'block';
}

// Calculate grade based on marks
function calculateGrade(input, totalMarks) {
    const marks = parseFloat(input.value);
    const rollNo = input.getAttribute('data-roll');
    const gradeDisplay = document.querySelector(`.grade-display[data-roll="${rollNo}"]`);
    
    if (!marks || marks < 0 || marks > totalMarks) {
        gradeDisplay.textContent = '-';
        return;
    }
    
    const percentage = (marks / totalMarks) * 100;
    let grade = '';
    
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'A-';
    else if (percentage >= 75) grade = 'B+';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 65) grade = 'B-';
    else if (percentage >= 60) grade = 'C+';
    else if (percentage >= 55) grade = 'C';
    else if (percentage >= 50) grade = 'C-';
    else grade = 'F';
    
    gradeDisplay.textContent = grade;
    gradeDisplay.style.fontWeight = 'bold';
    gradeDisplay.style.color = grade.startsWith('A') ? '#16a34a' : 
                                grade.startsWith('B') ? '#2563eb' : 
                                grade.startsWith('C') ? '#ea580c' : '#dc2626';
}

function saveResults() {
    const courseCode = document.getElementById('resultsCourseSelect').value;
    const assessmentType = document.getElementById('assessmentType').value;
    const totalMarks = document.getElementById('totalMarks').value;
    const marksInputs = document.querySelectorAll('.marks-input');
    
    if (marksInputs.length === 0) {
        alert('⚠️ No results data to save!');
        return;
    }
    
    // Validate all marks are entered
    let allEntered = true;
    marksInputs.forEach(input => {
        if (!input.value) allEntered = false;
    });
    
    if (!allEntered) {
        if (!confirm('⚠️ Some marks are missing. Do you want to continue?')) {
            return;
        }
    }
    
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    
    // Create result record
    const record = {
        courseCode: courseCode,
        assessmentType: assessmentType,
        totalMarks: parseInt(totalMarks),
        uploadedBy: loggedInUser.fullName,
        timestamp: new Date().toISOString(),
        approved: true, // Auto-approve for demo
        students: []
    };
    
    marksInputs.forEach(input => {
        const rollNo = input.getAttribute('data-roll');
        const marks = parseFloat(input.value) || 0;
        const gradeDisplay = document.querySelector(`.grade-display[data-roll="${rollNo}"]`);
        const grade = gradeDisplay.textContent;
        
        record.students.push({
            rollNo: rollNo,
            marks: marks,
            grade: grade,
            percentage: ((marks / totalMarks) * 100).toFixed(2)
        });
    });
    
    resultsRecords.push(record);
    localStorage.setItem('resultsRecords', JSON.stringify(resultsRecords));
    
    alert('✅ Results saved successfully!');
    
    // Reset form
    document.getElementById('resultsTableCard').style.display = 'none';
    document.getElementById('resultsCourseSelect').value = '';
    document.getElementById('assessmentType').value = '';
    document.getElementById('totalMarks').value = '';
    loadOverviewStats();
}

// ==================== INITIALIZATION ====================
initializeTeacherData();
loadOverviewStats();

console.log('✅ Teacher Dashboard loaded successfully');
console.log('👤 Current User:', loggedInUser);