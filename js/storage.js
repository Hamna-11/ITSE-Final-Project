function initializeAllData() {
    if (!localStorage.getItem('systemUsers')) {
        const systemUsers = [
            { id: 1, name: 'Admin Khan', username: 'admin', role: 'admin', status: 'active' },
            { id: 2, name: 'Usman Ali', username: 'teacher', role: 'teacher', status: 'active' },
            { id: 3, name: 'Ayesha Fatima', username: 'student', role: 'student', status: 'active' },
            { id: 4, name: 'Sara Ahmed', username: 'sara', role: 'student', status: 'active' },
            { id: 5, name: 'Ahmed Hassan', username: 'ahmed', role: 'teacher', status: 'active' },
            { id: 6, name: 'Zain Malik', username: 'zain', role: 'student', status: 'active' },
            { id: 7, name: 'Fatima Noor', username: 'fatima', role: 'student', status: 'active' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    }
    
    if (!localStorage.getItem('courses')) {
        const courses = [
            { 
                code: 'CS101', 
                name: 'Introduction to Programming', 
                teacher: 'Usman Ali', 
                students: 30 
            },
            { 
                code: 'CS202', 
                name: 'Data Structures and Algorithms', 
                teacher: 'Ahmed Hassan', 
                students: 25 
            },
            { 
                code: 'SE301', 
                name: 'Software Engineering', 
                teacher: 'Usman Ali', 
                students: 28 
            },
            { 
                code: 'DB401', 
                name: 'Database Management Systems', 
                teacher: 'Ahmed Hassan', 
                students: 22 
            },
            { 
                code: 'WEB501', 
                name: 'Web Development', 
                teacher: 'Usman Ali', 
                students: 35 
            }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    
    if (!localStorage.getItem('students')) {
        const students = [
            { rollNo: '2024-001', name: 'Ayesha Fatima', course: 'CS101', email: 'ayesha@student.pk' },
            { rollNo: '2024-002', name: 'Sara Ahmed', course: 'CS101', email: 'sara@student.pk' },
            { rollNo: '2024-003', name: 'Zain Malik', course: 'CS101', email: 'zain@student.pk' },
            { rollNo: '2024-004', name: 'Fatima Noor', course: 'SE301', email: 'fatima@student.pk' },
            { rollNo: '2024-005', name: 'Hassan Raza', course: 'SE301', email: 'hassan@student.pk' },
            { rollNo: '2024-006', name: 'Hira Khan', course: 'CS202', email: 'hira@student.pk' },
            { rollNo: '2024-007', name: 'Bilal Ahmed', course: 'DB401', email: 'bilal@student.pk' },
            { rollNo: '2024-008', name: 'Mariam Ali', course: 'WEB501', email: 'mariam@student.pk' },
            { rollNo: '2024-009', name: 'Umar Farooq', course: 'WEB501', email: 'umar@student.pk' },
            { rollNo: '2024-010', name: 'Aisha Siddiqui', course: 'CS101', email: 'aisha@student.pk' }
        ];
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    if (!localStorage.getItem('attendanceRecords')) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const attendanceRecords = [
            {
                courseCode: 'CS101',
                date: yesterday.toISOString().split('T')[0],
                markedBy: 'Usman Ali',
                timestamp: yesterday.toISOString(),
                students: [
                    { rollNo: '2024-001', status: 'present' },
                    { rollNo: '2024-002', status: 'present' },
                    { rollNo: '2024-003', status: 'absent' },
                    { rollNo: '2024-010', status: 'present' }
                ]
            },
            {
                courseCode: 'CS101',
                date: twoDaysAgo.toISOString().split('T')[0],
                markedBy: 'Usman Ali',
                timestamp: twoDaysAgo.toISOString(),
                students: [
                    { rollNo: '2024-001', status: 'present' },
                    { rollNo: '2024-002', status: 'late' },
                    { rollNo: '2024-003', status: 'present' },
                    { rollNo: '2024-010', status: 'present' }
                ]
            },
            {
                courseCode: 'CS101',
                date: threeDaysAgo.toISOString().split('T')[0],
                markedBy: 'Usman Ali',
                timestamp: threeDaysAgo.toISOString(),
                students: [
                    { rollNo: '2024-001', status: 'present' },
                    { rollNo: '2024-002', status: 'present' },
                    { rollNo: '2024-003', status: 'absent' },
                    { rollNo: '2024-010', status: 'late' }
                ]
            },
            {
                courseCode: 'SE301',
                date: yesterday.toISOString().split('T')[0],
                markedBy: 'Usman Ali',
                timestamp: yesterday.toISOString(),
                students: [
                    { rollNo: '2024-004', status: 'present' },
                    { rollNo: '2024-005', status: 'present' }
                ]
            },
            {
                courseCode: 'CS202',
                date: yesterday.toISOString().split('T')[0],
                markedBy: 'Ahmed Hassan',
                timestamp: yesterday.toISOString(),
                students: [
                    { rollNo: '2024-006', status: 'present' }
                ]
            }
        ];
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    }
    
    if (!localStorage.getItem('resultsRecords')) {
        const resultsRecords = [
            {
                courseCode: 'CS101',
                assessmentType: 'midterm',
                totalMarks: 100,
                uploadedBy: 'Usman Ali',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 88, grade: 'A', percentage: '88.00' },
                    { rollNo: '2024-002', marks: 92, grade: 'A+', percentage: '92.00' },
                    { rollNo: '2024-003', marks: 75, grade: 'B+', percentage: '75.00' },
                    { rollNo: '2024-010', marks: 85, grade: 'A', percentage: '85.00' }
                ]
            },
            {
                courseCode: 'CS101',
                assessmentType: 'quiz',
                totalMarks: 20,
                uploadedBy: 'Usman Ali',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 18, grade: 'A', percentage: '90.00' },
                    { rollNo: '2024-002', marks: 20, grade: 'A+', percentage: '100.00' },
                    { rollNo: '2024-003', marks: 15, grade: 'B+', percentage: '75.00' },
                    { rollNo: '2024-010', marks: 17, grade: 'A-', percentage: '85.00' }
                ]
            },
            {
                courseCode: 'SE301',
                assessmentType: 'assignment',
                totalMarks: 50,
                uploadedBy: 'Usman Ali',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-004', marks: 46, grade: 'A+', percentage: '92.00' },
                    { rollNo: '2024-005', marks: 48, grade: 'A+', percentage: '96.00' }
                ]
            },
            {
                courseCode: 'CS202',
                assessmentType: 'midterm',
                totalMarks: 100,
                uploadedBy: 'Ahmed Hassan',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-006', marks: 82, grade: 'A-', percentage: '82.00' }
                ]
            }
        ];
        localStorage.setItem('resultsRecords', JSON.stringify(resultsRecords));
    }
    
    if (!localStorage.getItem('systemActivity')) {
        const systemActivity = [
            { action: 'User Login', user: 'Usman Ali', time: new Date().toLocaleString() },
            { action: 'Attendance Marked', user: 'Usman Ali', time: new Date().toLocaleString() },
            { action: 'Results Updated', user: 'Ahmed Hassan', time: new Date().toLocaleString() },
            { action: 'Course Added', user: 'Admin Khan', time: new Date().toLocaleString() },
            { action: 'Student Enrolled', user: 'Admin Khan', time: new Date().toLocaleString() }
        ];
        localStorage.setItem('systemActivity', JSON.stringify(systemActivity));
    }
}

function clearAllData() {
    localStorage.removeItem('systemUsers');
    localStorage.removeItem('courses');
    localStorage.removeItem('students');
    localStorage.removeItem('attendanceRecords');
    localStorage.removeItem('resultsRecords');
    localStorage.removeItem('systemActivity');
    localStorage.removeItem('currentUser');
}

initializeAllData();

window.initializeAllData = initializeAllData;
window.clearAllData = clearAllData;