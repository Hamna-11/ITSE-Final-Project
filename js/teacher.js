const loggedInUser = checkAuth();
if (!loggedInUser || loggedInUser.role !== 'teacher') {
    alert('Access Denied! Teacher privileges required.');
    window.location.href = 'main.html';
}

document.getElementById('userInfo').textContent = loggedInUser.fullName;
document.getElementById('teacherName').textContent = loggedInUser.fullName;

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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-navigate');
            showSection(sectionId);
        });
    });
});

function showSection(sectionId) {
    menuItems.forEach(mi => mi.classList.remove('active'));
    contentSections.forEach(cs => cs.classList.remove('active'));
    
    const menuItem = document.querySelector('[data-section="' + sectionId + '"]');
    if (menuItem) menuItem.classList.add('active');
    
    document.getElementById(sectionId).classList.add('active');
}

function loadOverviewStats() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
    
    const teacherCourses = courses.filter(c => c.teacher === loggedInUser.fullName);
    const teacherCourseCodes = teacherCourses.map(c => c.code);
    
    const teacherStudents = students.filter(s => teacherCourseCodes.includes(s.course));
    const teacherAttendance = attendanceRecords.filter(r => teacherCourseCodes.includes(r.courseCode));
    const teacherResults = resultsRecords.filter(r => teacherCourseCodes.includes(r.courseCode));
    
    document.getElementById('totalCourses').textContent = teacherCourses.length;
    document.getElementById('totalStudents').textContent = teacherStudents.length;
    document.getElementById('attendanceMarked').textContent = teacherAttendance.length;
    document.getElementById('resultsUploaded').textContent = teacherResults.length;
    
    loadCoursesDropdown();
    loadMyCourses();
}

function loadCoursesDropdown() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const teacherCourses = courses.filter(c => c.teacher === loggedInUser.fullName);
    
    const courseSelect = document.getElementById('courseSelect');
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">Choose Course</option>';
        teacherCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.code;
            option.textContent = course.code + ' - ' + course.name;
            courseSelect.appendChild(option);
        });
    }
    
    const resultsCourseSelect = document.getElementById('resultsCourseSelect');
    if (resultsCourseSelect) {
        resultsCourseSelect.innerHTML = '<option value="">Choose Course</option>';
        teacherCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.code;
            option.textContent = course.code + ' - ' + course.name;
            resultsCourseSelect.appendChild(option);
        });
    }
}

function loadMyCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const teacherCourses = courses.filter(c => c.teacher === loggedInUser.fullName);
    const tbody = document.getElementById('myCoursesTableBody');
    
    if (!tbody) return;
    
    if (teacherCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No courses assigned</td></tr>';
        return;
    }
    
    tbody.innerHTML = teacherCourses.map(course => {
        return '<tr><td>' + course.code + '</td><td>' + course.name + '</td><td>' + course.students + '</td><td><button class="btn-secondary" onclick="viewCourseDetails(\'' + course.code + '\')">View Details</button></td></tr>';
    }).join('');
}

function viewCourseDetails(courseCode) {
    alert('Course Details: ' + courseCode);
}

document.getElementById('attendanceDate').valueAsDate = new Date();

function loadStudentsForAttendance() {
    const courseCode = document.getElementById('courseSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!courseCode || !date) {
        alert('Please select both course and date!');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courseStudents = students.filter(s => s.course === courseCode);
    
    if (courseStudents.length === 0) {
        alert('No students found for this course!');
        return;
    }
    
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = courseStudents.map(student => {
        return '<tr><td>' + student.rollNo + '</td><td>' + student.name + '</td><td><select class="attendance-status" data-roll="' + student.rollNo + '"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></td></tr>';
    }).join('');
    
    document.getElementById('attendanceTableCard').style.display = 'block';
}

function saveAttendance() {
    const courseCode = document.getElementById('courseSelect').value;
    const date = document.getElementById('attendanceDate').value;
    const statusSelects = document.querySelectorAll('.attendance-status');
    
    if (statusSelects.length === 0) {
        alert('No attendance data to save!');
        return;
    }
    
    try {
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        
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
        
        const existingIndex = attendanceRecords.findIndex(
            r => r.courseCode === courseCode && r.date === date
        );
        
        if (existingIndex >= 0) {
            const confirmUpdate = confirm(
                `Attendance for ${courseCode} on ${date} already exists.\n\n` +
                `Do you want to UPDATE the existing record?`
            );
            
            if (!confirmUpdate) {
                return; 
            }
            
            attendanceRecords[existingIndex] = record;
            alert('Attendance record UPDATED successfully for ' + courseCode + '!');
        } else {
            attendanceRecords.push(record);
            alert('Attendance record SAVED successfully for ' + courseCode + '!');
        }
        
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        
        const activity = JSON.parse(localStorage.getItem('systemActivity')) || [];
        activity.push({
            action: existingIndex >= 0 ? 'Attendance Updated' : 'Attendance Marked',
            user: loggedInUser.fullName,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('systemActivity', JSON.stringify(activity));
        
        document.getElementById('attendanceTableCard').style.display = 'none';
        document.getElementById('courseSelect').value = '';
        loadOverviewStats();
    } catch (error) {
        console.error('Error saving attendance:', error);
        alert('Failed to save attendance. Please try again.');
    }
}

function loadStudentsForResults() {
    const courseCode = document.getElementById('resultsCourseSelect').value;
    const assessmentType = document.getElementById('assessmentType').value;
    const totalMarks = document.getElementById('totalMarks').value;
    
    if (!courseCode || !assessmentType || !totalMarks) {
        alert('Please fill all fields!');
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courseStudents = students.filter(s => s.course === courseCode);
    
    if (courseStudents.length === 0) {
        alert('No students found for this course!');
        return;
    }
    
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = courseStudents.map(student => {
        return '<tr><td>' + student.rollNo + '</td><td>' + student.name + '</td><td><input type="number" class="marks-input" data-roll="' + student.rollNo + '" min="0" max="' + totalMarks + '" placeholder="Enter marks" style="width: 120px; padding: 8px; border: 2px solid #e5e7eb; border-radius: 4px;"></td><td><span class="grade-display" data-roll="' + student.rollNo + '">-</span></td></tr>';
    }).join('');
    
    document.querySelectorAll('.marks-input').forEach(input => {
        input.addEventListener('input', function() {
            calculateGrade(this, parseInt(totalMarks));
        });
    });
    
    document.getElementById('resultsTableCard').style.display = 'block';
}

function calculateGrade(input, totalMarks) {
    const marks = parseFloat(input.value);
    const rollNo = input.getAttribute('data-roll');
    const gradeDisplay = document.querySelector('.grade-display[data-roll="' + rollNo + '"]');
    
    if (isNaN(marks) || marks < 0) {
        gradeDisplay.textContent = '-';
        return;
    }
    
    if (marks > totalMarks) {
        alert('Marks cannot exceed ' + totalMarks);
        input.value = totalMarks;
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
    const totalMarks = parseInt(document.getElementById('totalMarks').value);
    const marksInputs = document.querySelectorAll('.marks-input');
    
    if (marksInputs.length === 0) {
        alert('No results data to save!');
        return;
    }
    
    let hasInvalidMarks = false;
    let hasEmptyMarks = false;
    
    marksInputs.forEach(input => {
        const marks = parseFloat(input.value);
        
        if (!input.value || input.value.trim() === '') {
            hasEmptyMarks = true;
        } else if (isNaN(marks) || marks < 0) {
            hasInvalidMarks = true;
            input.style.border = '2px solid #dc2626';
        } else if (marks > totalMarks) {
            hasInvalidMarks = true;
            input.style.border = '2px solid #dc2626';
        } else {
            input.style.border = '2px solid #e5e7eb';
        }
    });
    
    if (hasInvalidMarks) {
        alert('⚠ ERROR: Some marks are invalid!\n\n' +
              '• Marks cannot be negative\n' +
              '• Marks cannot exceed total marks (' + totalMarks + ')\n\n' +
              'Invalid fields are highlighted in red. Please correct them.');
        return;
    }
    
    if (hasEmptyMarks) {
        if (!confirm('⚠ WARNING: Some marks are missing.\n\nDo you want to continue?\n\n(Missing marks will be saved as 0)')) {
            return;
        }
    }
    
    try {
        const resultsRecords = JSON.parse(localStorage.getItem('resultsRecords')) || [];
        
        const record = {
            courseCode: courseCode,
            assessmentType: assessmentType,
            totalMarks: totalMarks,
            uploadedBy: loggedInUser.fullName,
            timestamp: new Date().toISOString(),
            approved: true,
            students: []
        };
        
        marksInputs.forEach(input => {
            const rollNo = input.getAttribute('data-roll');
            const marks = parseFloat(input.value) || 0; 
            const gradeDisplay = document.querySelector(`.grade-display[data-roll="${rollNo}"]`);
            const grade = gradeDisplay.textContent || 'F';
            
            record.students.push({
                rollNo: rollNo,
                marks: marks,
                grade: grade,
                percentage: ((marks / totalMarks) * 100).toFixed(2)
            });
        });
        
        resultsRecords.push(record);
        localStorage.setItem('resultsRecords', JSON.stringify(resultsRecords));
        
        const activity = JSON.parse(localStorage.getItem('systemActivity')) || [];
        activity.push({
            action: 'Results Uploaded',
            user: loggedInUser.fullName,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('systemActivity', JSON.stringify(activity));
        
        alert('✓ Results saved successfully for ' + courseCode + '!');
        
        document.getElementById('resultsTableCard').style.display = 'none';
        document.getElementById('resultsCourseSelect').value = '';
        document.getElementById('assessmentType').value = '';
        document.getElementById('totalMarks').value = '';
        loadOverviewStats();
    } catch (error) {
        console.error('Error saving results:', error);
        alert('Failed to save results. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loadStudentsBtn = document.getElementById('loadStudentsBtn');
    if (loadStudentsBtn) {
        loadStudentsBtn.addEventListener('click', loadStudentsForAttendance);
    }
    
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }
    
    const loadResultsStudentsBtn = document.getElementById('loadResultsStudentsBtn');
    if (loadResultsStudentsBtn) {
        loadResultsStudentsBtn.addEventListener('click', loadStudentsForResults);
    }
    
    const saveResultsBtn = document.getElementById('saveResultsBtn');
    if (saveResultsBtn) {
        saveResultsBtn.addEventListener('click', saveResults);
    }
});

loadOverviewStats();