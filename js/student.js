// ==================== AUTHENTICATION CHECK ====================
const loggedInUser = checkAuth();
if (!loggedInUser || loggedInUser.role !== 'student') {
    alert('⚠️ Access Denied! Student privileges required.');
    window.location.href = 'main.html';
}

// Display student name
document.getElementById('userInfo').textContent = loggedInUser.fullName;
document.getElementById('studentName').textContent = loggedInUser.fullName;

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

// ==================== GET STUDENT DATA ====================
function getStudentData() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    // Find student by username (assuming username matches part of name)
    return students.find(s => s.name === loggedInUser.fullName) || students[0];
}

const studentData = getStudentData();
const studentRollNo = studentData ? studentData.rollNo : '2024-001';
const studentCourse = studentData ? studentData.course : 'CS101';

// ==================== LOAD OVERVIEW STATISTICS ====================
function loadOverviewStats() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    
    // Get student's courses
    const studentCourses = courses.filter(c => c.code === studentCourse);
    document.getElementById('totalCourses').textContent = studentCourses.length || 1;
    
    // Calculate overall attendance
    const attendanceData = calculateOverallAttendance(attendanceRecords);
    document.getElementById('overallAttendance').textContent = attendanceData.percentage + '%';
    
    // Show warning if attendance is low
    if (attendanceData.percentage < 75) {
        document.getElementById('attendanceAlert').style.display = 'block';
    }
    
    // Calculate average grade
    const gradesData = calculateAverageGrade(resultsRecords);
    document.getElementById('averageGrade').textContent = gradesData.avgGrade || '-';
    document.getElementById('totalAssessments').textContent = gradesData.totalAssessments;
}

// ==================== CALCULATE OVERALL ATTENDANCE ====================
function calculateOverallAttendance(attendanceRecords) {
    let totalClasses = 0;
    let presentCount = 0;
    
    attendanceRecords.forEach(record => {
        const studentRecord = record.students.find(s => s.rollNo === studentRollNo);
        if (studentRecord) {
            totalClasses++;
            if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                presentCount++;
            }
        }
    });
    
    const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    
    return {
        totalClasses,
        presentCount,
        percentage
    };
}

// ==================== CALCULATE AVERAGE GRADE ====================
function calculateAverageGrade(resultsRecords) {
    let totalPercentage = 0;
    let assessmentCount = 0;
    let grades = [];
    
    resultsRecords.forEach(record => {
        const studentResult = record.students.find(s => s.rollNo === studentRollNo);
        if (studentResult && record.approved) {
            totalPercentage += parseFloat(studentResult.percentage);
            assessmentCount++;
            grades.push(studentResult.grade);
        }
    });
    
    // Calculate most common grade (mode)
    let avgGrade = '-';
    if (assessmentCount > 0) {
        const avgPercentage = totalPercentage / assessmentCount;
        if (avgPercentage >= 90) avgGrade = 'A+';
        else if (avgPercentage >= 85) avgGrade = 'A';
        else if (avgPercentage >= 80) avgGrade = 'A-';
        else if (avgPercentage >= 75) avgGrade = 'B+';
        else if (avgPercentage >= 70) avgGrade = 'B';
        else if (avgPercentage >= 65) avgGrade = 'B-';
        else if (avgPercentage >= 60) avgGrade = 'C+';
        else if (avgPercentage >= 55) avgGrade = 'C';
        else if (avgPercentage >= 50) avgGrade = 'C-';
        else avgGrade = 'F';
    }
    
    return {
        avgGrade,
        totalAssessments: assessmentCount
    };
}

// ==================== LOAD ATTENDANCE DATA ====================
function loadAttendanceData() {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // Overall summary
    const attendanceData = calculateOverallAttendance(attendanceRecords);
    document.getElementById('totalClasses').textContent = attendanceData.totalClasses;
    document.getElementById('classesAttended').textContent = attendanceData.presentCount;
    document.getElementById('attendancePercentage').textContent = attendanceData.percentage + '%';
    
    // Course-wise attendance
    loadCourseWiseAttendance(attendanceRecords, courses);
    
    // Attendance log
    loadAttendanceLog(attendanceRecords, courses);
    
    // Populate course filter
    const courseFilter = document.getElementById('attendanceCourseFilter');
    courseFilter.innerHTML = '<option value="">All Courses</option>';
    courses.forEach(course => {
        courseFilter.innerHTML += `<option value="${course.code}">${course.code} - ${course.name}</option>`;
    });
}

function loadCourseWiseAttendance(attendanceRecords, courses) {
    const tbody = document.getElementById('attendanceTableBody');
    
    // Group attendance by course
    const courseAttendance = {};
    
    attendanceRecords.forEach(record => {
        const studentRecord = record.students.find(s => s.rollNo === studentRollNo);
        if (studentRecord) {
            if (!courseAttendance[record.courseCode]) {
                courseAttendance[record.courseCode] = {
                    total: 0,
                    present: 0,
                    absent: 0
                };
            }
            
            courseAttendance[record.courseCode].total++;
            if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                courseAttendance[record.courseCode].present++;
            } else {
                courseAttendance[record.courseCode].absent++;
            }
        }
    });
    
    if (Object.keys(courseAttendance).length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No attendance records found</td></tr>';
        return;
    }
    
    tbody.innerHTML = Object.entries(courseAttendance).map(([courseCode, data]) => {
        const course = courses.find(c => c.code === courseCode);
        const percentage = Math.round((data.present / data.total) * 100);
        const status = percentage >= 75 ? 'Good ✅' : 'Low ⚠️';
        const statusColor = percentage >= 75 ? '#16a34a' : '#dc2626';
        
        return `
            <tr>
                <td>${courseCode}</td>
                <td>${course ? course.name : 'Unknown'}</td>
                <td>${data.total}</td>
                <td>${data.present}</td>
                <td>${data.absent}</td>
                <td><strong>${percentage}%</strong></td>
                <td style="color: ${statusColor}; font-weight: 600;">${status}</td>
            </tr>
        `;
    }).join('');
}

function loadAttendanceLog(attendanceRecords, courses) {
    const tbody = document.getElementById('attendanceLogBody');
    
    // Get student's attendance records
    const studentAttendance = [];
    
    attendanceRecords.forEach(record => {
        const studentRecord = record.students.find(s => s.rollNo === studentRollNo);
        if (studentRecord) {
            const course = courses.find(c => c.code === record.courseCode);
            studentAttendance.push({
                date: record.date,
                courseCode: record.courseCode,
                courseName: course ? course.name : 'Unknown',
                status: studentRecord.status
            });
        }
    });
    
    // Sort by date (newest first)
    studentAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (studentAttendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No records found</td></tr>';
        return;
    }
    
    tbody.innerHTML = studentAttendance.map(record => {
        const statusIcon = record.status === 'present' ? '✅' : 
                          record.status === 'late' ? '⏰' : '❌';
        const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);
        
        return `
            <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.courseCode} - ${record.courseName}</td>
                <td>${statusIcon} ${statusText}</td>
            </tr>
        `;
    }).join('');
}

function filterAttendanceLog() {
    const selectedCourse = document.getElementById('attendanceCourseFilter').value;
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // Filter records
    let filteredRecords = attendanceRecords;
    if (selectedCourse) {
        filteredRecords = attendanceRecords.filter(r => r.courseCode === selectedCourse);
    }
    
    loadAttendanceLog(filteredRecords, courses);
}

// ==================== LOAD RESULTS DATA ====================
function loadResultsData() {
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // Performance summary
    const gradesData = calculateAverageGrade(resultsRecords);
    document.getElementById('summaryTotalAssessments').textContent = gradesData.totalAssessments;
    
    // Calculate average percentage
    let totalPercentage = 0;
    let count = 0;
    resultsRecords.forEach(record => {
        const studentResult = record.students.find(s => s.rollNo === studentRollNo);
        if (studentResult && record.approved) {
            totalPercentage += parseFloat(studentResult.percentage);
            count++;
        }
    });
    
    const avgPercentage = count > 0 ? (totalPercentage / count).toFixed(2) : 0;
    document.getElementById('summaryAvgPercentage').textContent = avgPercentage + '%';
    document.getElementById('summaryAvgGrade').textContent = gradesData.avgGrade;
    
    // Populate course filter
    const courseFilter = document.getElementById('resultsCourseFilter');
    const studentCourses = [...new Set(resultsRecords.map(r => r.courseCode))];
    courseFilter.innerHTML = '<option value="">-- Choose Course --</option>';
    studentCourses.forEach(courseCode => {
        const course = courses.find(c => c.code === courseCode);
        if (course) {
            courseFilter.innerHTML += `<option value="${courseCode}">${courseCode} - ${course.name}</option>`;
        }
    });
}

function filterCourseResults() {
    const selectedCourse = document.getElementById('resultsCourseFilter').value;
    
    if (!selectedCourse) {
        document.getElementById('resultsTableBody').innerHTML = 
            '<tr><td colspan="6" class="no-data">Please select a course</td></tr>';
        return;
    }
    
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    const courseResults = resultsRecords.filter(r => r.courseCode === selectedCourse && r.approved);
    
    const tbody = document.getElementById('resultsTableBody');
    
    if (courseResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No results found for this course</td></tr>';
        return;
    }
    
    tbody.innerHTML = courseResults.map(record => {
        const studentResult = record.students.find(s => s.rollNo === studentRollNo);
        if (!studentResult) return '';
        
        const gradeColor = studentResult.grade.startsWith('A') ? '#16a34a' : 
                          studentResult.grade.startsWith('B') ? '#2563eb' : 
                          studentResult.grade.startsWith('C') ? '#ea580c' : '#dc2626';
        
        return `
            <tr>
                <td>${record.assessmentType.charAt(0).toUpperCase() + record.assessmentType.slice(1)}</td>
                <td>${record.totalMarks}</td>
                <td>${studentResult.marks}</td>
                <td><strong>${studentResult.percentage}%</strong></td>
                <td style="color: ${gradeColor}; font-weight: 700; font-size: 16px;">${studentResult.grade}</td>
                <td>${new Date(record.timestamp).toLocaleDateString()}</td>
            </tr>
        `;
    }).join('');
}

// ==================== LOAD MY COURSES ====================
function loadMyCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    const studentCourses = courses.filter(c => c.code === studentCourse);
    const tbody = document.getElementById('myCoursesTableBody');
    
    if (studentCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No courses enrolled</td></tr>';
        return;
    }
    
    tbody.innerHTML = studentCourses.map(course => {
        // Calculate attendance for this course
        const courseAttendanceRecords = attendanceRecords.filter(r => r.courseCode === course.code);
        let present = 0, total = 0;
        
        courseAttendanceRecords.forEach(record => {
            const studentRecord = record.students.find(s => s.rollNo === studentRollNo);
            if (studentRecord) {
                total++;
                if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                    present++;
                }
            }
        });
        
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return `
            <tr>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.teacher}</td>
                <td><strong>${percentage}%</strong></td>
            </tr>
        `;
    }).join('');
}

// ==================== LOAD PROFILE ====================
function loadProfile() {
    document.getElementById('profileName').textContent = loggedInUser.fullName;
    document.getElementById('profileRoll').textContent = studentRollNo;
    document.getElementById('profileEmail').textContent = studentData ? studentData.email : 'student@example.com';
    document.getElementById('profileCourse').textContent = studentCourse;
}

// ==================== INITIALIZATION ====================
loadOverviewStats();
loadAttendanceData();
loadResultsData();
loadMyCourses();
loadProfile();

console.log('✅ Student Dashboard loaded successfully');
console.log('👤 Current User:', loggedInUser);
console.log('📝 Student Data:', studentData);