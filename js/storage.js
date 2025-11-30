// ==================== STORAGE INITIALIZATION MODULE ====================
// This file initializes all sample data for the application

// ==================== INITIALIZE ALL DATA ====================
function initializeAllData() {
    console.log('🔄 Checking localStorage data...');
    
    // Initialize System Users
    if (!localStorage.getItem('systemUsers')) {
        console.log('📝 Initializing system users...');
        const systemUsers = [
            { id: 1, name: 'System Administrator', username: 'admin', role: 'admin', status: 'active' },
            { id: 2, name: 'John Teacher', username: 'teacher', role: 'teacher', status: 'active' },
            { id: 3, name: 'Jane Student', username: 'student', role: 'student', status: 'active' },
            { id: 4, name: 'Alice Johnson', username: 'alice', role: 'student', status: 'active' },
            { id: 5, name: 'Bob Smith', username: 'bob', role: 'teacher', status: 'active' },
            { id: 6, name: 'Charlie Brown', username: 'charlie', role: 'student', status: 'active' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
        console.log('✅ System users initialized');
    }
    
    // Initialize Courses
    if (!localStorage.getItem('courses')) {
        console.log('📚 Initializing courses...');
        const courses = [
            { 
                code: 'CS101', 
                name: 'Introduction to Programming', 
                teacher: 'John Teacher', 
                students: 25 
            },
            { 
                code: 'CS202', 
                name: 'Data Structures and Algorithms', 
                teacher: 'Bob Smith', 
                students: 30 
            },
            { 
                code: 'SE301', 
                name: 'Software Engineering', 
                teacher: 'John Teacher', 
                students: 20 
            },
            { 
                code: 'DB401', 
                name: 'Database Management Systems', 
                teacher: 'Bob Smith', 
                students: 22 
            }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
        console.log('✅ Courses initialized');
    }
    
    // Initialize Students
    if (!localStorage.getItem('students')) {
        console.log('👨‍🎓 Initializing students...');
        const students = [
            { rollNo: '2024-001', name: 'Jane Student', course: 'CS101', email: 'jane@example.com' },
            { rollNo: '2024-002', name: 'Alice Johnson', course: 'CS101', email: 'alice@example.com' },
            { rollNo: '2024-003', name: 'Bob Wilson', course: 'CS101', email: 'bob@example.com' },
            { rollNo: '2024-004', name: 'Charlie Brown', course: 'SE301', email: 'charlie@example.com' },
            { rollNo: '2024-005', name: 'Diana Prince', course: 'SE301', email: 'diana@example.com' },
            { rollNo: '2024-006', name: 'Eve Martinez', course: 'CS202', email: 'eve@example.com' },
            { rollNo: '2024-007', name: 'Frank Cooper', course: 'DB401', email: 'frank@example.com' }
        ];
        localStorage.setItem('students', JSON.stringify(students));
        console.log('✅ Students initialized');
    }
    
    // Initialize Attendance Records (Sample)
    if (!localStorage.getItem('attendanceRecords')) {
        console.log('📝 Initializing attendance records...');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const attendanceRecords = [
            {
                courseCode: 'CS101',
                date: yesterday.toISOString().split('T')[0],
                markedBy: 'John Teacher',
                timestamp: yesterday.toISOString(),
                students: [
                    { rollNo: '2024-001', status: 'present' },
                    { rollNo: '2024-002', status: 'present' },
                    { rollNo: '2024-003', status: 'absent' }
                ]
            },
            {
                courseCode: 'CS101',
                date: twoDaysAgo.toISOString().split('T')[0],
                markedBy: 'John Teacher',
                timestamp: twoDaysAgo.toISOString(),
                students: [
                    { rollNo: '2024-001', status: 'present' },
                    { rollNo: '2024-002', status: 'late' },
                    { rollNo: '2024-003', status: 'present' }
                ]
            },
            {
                courseCode: 'SE301',
                date: yesterday.toISOString().split('T')[0],
                markedBy: 'John Teacher',
                timestamp: yesterday.toISOString(),
                students: [
                    { rollNo: '2024-004', status: 'present' },
                    { rollNo: '2024-005', status: 'present' }
                ]
            }
        ];
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        console.log('✅ Attendance records initialized');
    }
    
    // Initialize Results Records (Sample)
    if (!localStorage.getItem('resultsRecords')) {
        console.log('📊 Initializing results records...');
        const resultsRecords = [
            {
                courseCode: 'CS101',
                assessmentType: 'midterm',
                totalMarks: 100,
                uploadedBy: 'John Teacher',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 85, grade: 'A', percentage: '85.00' },
                    { rollNo: '2024-002', marks: 92, grade: 'A+', percentage: '92.00' },
                    { rollNo: '2024-003', marks: 78, grade: 'B+', percentage: '78.00' }
                ]
            },
            {
                courseCode: 'CS101',
                assessmentType: 'quiz',
                totalMarks: 20,
                uploadedBy: 'John Teacher',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-001', marks: 18, grade: 'A', percentage: '90.00' },
                    { rollNo: '2024-002', marks: 19, grade: 'A+', percentage: '95.00' },
                    { rollNo: '2024-003', marks: 15, grade: 'B+', percentage: '75.00' }
                ]
            },
            {
                courseCode: 'SE301',
                assessmentType: 'assignment',
                totalMarks: 50,
                uploadedBy: 'John Teacher',
                timestamp: new Date().toISOString(),
                approved: true,
                students: [
                    { rollNo: '2024-004', marks: 45, grade: 'A', percentage: '90.00' },
                    { rollNo: '2024-005', marks: 48, grade: 'A+', percentage: '96.00' }
                ]
            }
        ];
        localStorage.setItem('resultsRecords', JSON.stringify(resultsRecords));
        console.log('✅ Results records initialized');
    }
    
    // Initialize System Activity
    if (!localStorage.getItem('systemActivity')) {
        console.log('📋 Initializing system activity...');
        const systemActivity = [
            { action: 'User Login', user: 'John Teacher', time: new Date().toLocaleString() },
            { action: 'Attendance Marked', user: 'John Teacher', time: new Date().toLocaleString() },
            { action: 'Results Updated', user: 'Bob Smith', time: new Date().toLocaleString() },
            { action: 'Course Added', user: 'System Administrator', time: new Date().toLocaleString() },
            { action: 'Student Enrolled', user: 'System Administrator', time: new Date().toLocaleString() }
        ];
        localStorage.setItem('systemActivity', JSON.stringify(systemActivity));
        console.log('✅ System activity initialized');
    }
    
    console.log('✅ All data initialization complete!');
    console.log('📊 Current localStorage data:', {
        systemUsers: JSON.parse(localStorage.getItem('systemUsers') || '[]').length,
        courses: JSON.parse(localStorage.getItem('courses') || '[]').length,
        students: JSON.parse(localStorage.getItem('students') || '[]').length,
        attendanceRecords: JSON.parse(localStorage.getItem('attendanceRecords') || '[]').length,
        resultsRecords: JSON.parse(localStorage.getItem('resultsRecords') || '[]').length
    });
}

// ==================== CLEAR ALL DATA (FOR TESTING) ====================
function clearAllData() {
    console.log('🗑️ Clearing all data...');
    localStorage.removeItem('systemUsers');
    localStorage.removeItem('courses');
    localStorage.removeItem('students');
    localStorage.removeItem('attendanceRecords');
    localStorage.removeItem('resultsRecords');
    localStorage.removeItem('systemActivity');
    localStorage.removeItem('currentUser');
    console.log('✅ All data cleared!');
}

// ==================== AUTO INITIALIZE ON LOAD ====================
// Automatically initialize data when this script loads
initializeAllData();

// Export functions for manual use
window.initializeAllData = initializeAllData;
window.clearAllData = clearAllData;

console.log('🔐 Storage module loaded successfully');
console.log('💡 Use clearAllData() in console to reset everything');