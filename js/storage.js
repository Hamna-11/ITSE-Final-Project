function initializeAllData() {
    const forceReset = !localStorage.getItem('dataVersion') || localStorage.getItem('dataVersion') !== '2.0';
    
    if (forceReset) {
        localStorage.clear();
        localStorage.setItem('dataVersion', '2.0');
    }
    
    if (!localStorage.getItem('systemUsers')) {
        const systemUsers = [
            { id: 1, name: 'Ali Ahmed', username: 'admin', role: 'admin', status: 'active' },
            { id: 2, name: 'Fatima Khan', username: 'teacher', role: 'teacher', status: 'active' },
            { id: 3, name: 'Sara Malik', username: 'student', role: 'student', status: 'active' },
            { id: 4, name: 'Ahmed Hassan', username: 'ahmed', role: 'teacher', status: 'active' },
            { id: 5, name: 'Zainab Ali', username: 'zainab', role: 'student', status: 'active' },
            { id: 6, name: 'Omar Farooq', username: 'omar', role: 'student', status: 'active' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    }
    
    if (!localStorage.getItem('courses')) {
        const courses = [
            { 
                code: 'CS101', 
                name: 'Introduction to Programming', 
                teacher: 'Fatima Khan', 
                students: 15 
            },
            { 
                code: 'CS202', 
                name: 'Data Structures', 
                teacher: 'Ahmed Hassan', 
                students: 12 
            },
            { 
                code: 'CS303', 
                name: 'Web Development', 
                teacher: 'Fatima Khan', 
                students: 10 
            }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    
    if (!localStorage.getItem('students')) {
        const students = [
            { rollNo: '2024-001', name: 'Sara Malik', course: 'CS101', email: 'sara@student.pk' },
            { rollNo: '2024-002', name: 'Zainab Ali', course: 'CS101', email: 'zainab@student.pk' },
            { rollNo: '2024-003', name: 'Omar Farooq', course: 'CS202', email: 'omar@student.pk' }
        ];
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    if (!localStorage.getItem('attendanceRecords')) {
        const today = new Date();
        const records = [];
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            records.push({
                courseCode: 'CS101',
                date: dateStr,
                markedBy: 'Fatima Khan',
                timestamp: date.toISOString(),
                students: [
                    { rollNo: '2024-001', status: Math.random() > 0.2 ? 'present' : 'absent' },
                    { rollNo: '2024-002', status: Math.random() > 0.15 ? 'present' : 'late' }
                ]
            });
            
            records.push({
                courseCode: 'CS202',
                date: dateStr,
                markedBy: 'Ahmed Hassan',
                timestamp: date.toISOString(),
                students: [
                    { rollNo: '2024-003', status: Math.random() > 0.15 ? 'present' : 'absent' }
                ]
            });
        }
        
        localStorage.setItem('attendanceRecords', JSON.stringify(records));
    }
    
    if (!localStorage.getItem('resultsRecords')) {
        const resultsRecords = [
            {
                courseCode: 'CS101',
                assessmentType: 'midterm',
                totalMarks: 100,
                uploadedBy: 'Fatima Khan',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 85, grade: 'A', percentage: '85.00' },
                    { rollNo: '2024-002', marks: 92, grade: 'A+', percentage: '92.00' }
                ]
            },
            {
                courseCode: 'CS101',
                assessmentType: 'quiz',
                totalMarks: 20,
                uploadedBy: 'Fatima Khan',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 18, grade: 'A', percentage: '90.00' },
                    { rollNo: '2024-002', marks: 20, grade: 'A+', percentage: '100.00' }
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
                    { rollNo: '2024-003', marks: 82, grade: 'A-', percentage: '82.00' }
                ]
            },
            {
                courseCode: 'CS202',
                assessmentType: 'assignment',
                totalMarks: 50,
                uploadedBy: 'Ahmed Hassan',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-003', marks: 44, grade: 'A', percentage: '88.00' }
                ]
            }
        ];
        localStorage.setItem('resultsRecords', JSON.stringify(resultsRecords));
    }
    
    if (!localStorage.getItem('systemActivity')) {
        const systemActivity = [
            { action: 'User Login', user: 'Ali Ahmed', time: new Date(Date.now() - 3600000).toLocaleString() },
            { action: 'Attendance Marked', user: 'Fatima Khan', time: new Date(Date.now() - 7200000).toLocaleString() },
            { action: 'Results Updated', user: 'Ahmed Hassan', time: new Date(Date.now() - 10800000).toLocaleString() },
            { action: 'Course Added', user: 'Ali Ahmed', time: new Date(Date.now() - 14400000).toLocaleString() },
            { action: 'Student Enrolled', user: 'Ali Ahmed', time: new Date(Date.now() - 18000000).toLocaleString() },
            { action: 'User Login', user: 'Fatima Khan', time: new Date(Date.now() - 21600000).toLocaleString() },
            { action: 'Attendance Marked', user: 'Ahmed Hassan', time: new Date(Date.now() - 25200000).toLocaleString() },
            { action: 'Results Updated', user: 'Fatima Khan', time: new Date(Date.now() - 28800000).toLocaleString() }
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