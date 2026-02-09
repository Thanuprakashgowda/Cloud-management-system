document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const links = document.querySelectorAll('.nav-item');
    const views = {
        'homeView': document.getElementById('homeView'),
        'studentsView': document.getElementById('studentsView'),
        'coursesView': document.getElementById('coursesView'),
        'departmentsView': document.getElementById('departmentsView'),
        'resultsView': document.getElementById('resultsView')
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class
            links.forEach(l => l.classList.remove('active'));
            // Hide all views
            Object.values(views).forEach(view => view.style.display = 'none');

            // Activate clicked link & show view
            link.classList.add('active'); // Use 'link' variable instead of e.target which might be the icon
            const targetId = link.getAttribute('data-target');
            if (views[targetId]) {
                views[targetId].style.display = 'block';
                // Load data based on view
                if (targetId === 'studentsView') fetchStudents();
                if (targetId === 'coursesView') fetchCourses();
                if (targetId === 'departmentsView') fetchDepartments();
                if (targetId === 'resultsView') fetchResults();
                if (targetId === 'homeView') loadStats();
            }
        });
    });

    // Load Stats for Dashboard
    function loadStats() {
        Promise.all([
            fetch('/api/students').then(r => r.json()).catch(() => []),
            fetch('/api/courses').then(r => r.json()).catch(() => []),
            fetch('/api/departments').then(r => r.json()).catch(() => [])
        ]).then(([students, courses, depts]) => {
            document.getElementById('statsStudentCount').textContent = students.length || 0;
            document.getElementById('statsCourseCount').textContent = courses.length || 0;
            document.getElementById('statsDeptCount').textContent = depts.length || 0;
        });
    }

    // Call loadStats initially
    loadStats();
    populateDepartmentDropdowns();

    function populateDepartmentDropdowns() {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => {
                const studentSelect = document.getElementById('studentDeptId');
                const courseSelect = document.getElementById('courseDeptId');

                // Clear existing options (keep the first 'Select' option)
                studentSelect.innerHTML = '<option value="">Select Department...</option>';
                courseSelect.innerHTML = '<option value="">Select Department...</option>';

                data.forEach(dept => {
                    const option = `<option value="${dept.department_id}">${dept.department_name}</option>`;
                    studentSelect.innerHTML += option;
                    courseSelect.innerHTML += option;
                });
            })
            .catch(err => console.error('Error loading departments for dropdowns:', err));
    }

    // --- STUDENTS LOGIC ---
    const studentTableBody = document.getElementById('studentTableBody');
    const studentModal = document.getElementById('studentModal');

    function fetchStudents() {
        fetch('/api/students')
            .then(res => res.json())
            .then(data => {
                studentTableBody.innerHTML = '';
                data.forEach(s => {
                    studentTableBody.innerHTML += `
                        <tr>
                            <td>${s.student_id}</td>
                            <td>${s.first_name} ${s.last_name}</td>
                            <td>${s.email}</td>
                            <td>${new Date(s.dob).toLocaleDateString()}</td>
                            <td>${s.department_name || s.department_id}</td>
                            <td><button class="btn btn-danger" onclick="deleteItem('students', ${s.student_id})">Delete</button></td>
                        </tr>
                    `;
                });
            });
    }

    document.getElementById('addStudentBtn').onclick = () => studentModal.style.display = "flex";

    document.getElementById('studentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            department_id: document.getElementById('studentDeptId').value
        };
        createItem('students', data, studentModal, fetchStudents);
    });

    // --- COURSES LOGIC ---
    const courseTableBody = document.getElementById('courseTableBody');
    const courseModal = document.getElementById('courseModal');

    function fetchCourses() {
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => {
                courseTableBody.innerHTML = '';
                data.forEach(c => {
                    courseTableBody.innerHTML += `
                        <tr>
                            <td>${c.course_id}</td>
                            <td>${c.course_name}</td>
                            <td>${c.credits}</td>
                            <td>${c.department_name || c.department_id}</td>
                            <td><button class="btn btn-danger" onclick="deleteItem('courses', ${c.course_id}, fetchCourses)">Delete</button></td>
                        </tr>
                    `;
                });
            });
    }

    document.getElementById('addCourseBtn').onclick = () => courseModal.style.display = "flex";

    document.getElementById('courseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            course_name: document.getElementById('courseName').value,
            credits: document.getElementById('courseCredits').value,
            department_id: document.getElementById('courseDeptId').value
        };
        createItem('courses', data, courseModal, fetchCourses);
    });

    // --- DEPARTMENTS LOGIC ---
    const deptTableBody = document.getElementById('departmentTableBody');
    const deptModal = document.getElementById('departmentModal');

    function fetchDepartments() {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => {
                deptTableBody.innerHTML = '';
                data.forEach(d => {
                    deptTableBody.innerHTML += `
                        <tr>
                            <td>${d.department_id}</td>
                            <td>${d.department_name}</td>
                            <td>${d.head_of_dept}</td>
                            <td><button class="btn btn-danger" onclick="deleteItem('departments', ${d.department_id}, fetchDepartments)">Delete</button></td>
                        </tr>
                    `;
                });
            });
    }

    document.getElementById('addDepartmentBtn').onclick = () => deptModal.style.display = "flex";

    document.getElementById('departmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            department_name: document.getElementById('deptName').value,
            head_of_dept: document.getElementById('headOfDept').value
        };
        createItem('departments', data, deptModal, fetchDepartments);
    });

    // --- RESULTS LOGIC ---
    const resultsTableBody = document.getElementById('resultsTableBody');

    function fetchResults() {
        fetch('/api/marks')
            .then(res => res.json())
            .then(data => {
                resultsTableBody.innerHTML = '';
                data.forEach(r => {
                    resultsTableBody.innerHTML += `
                        <tr>
                            <td>${r.first_name} ${r.last_name}</td>
                            <td>${r.course_name}</td>
                            <td>${r.department_name || '-'}</td>
                            <td><span style="background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 4px; font-weight: 500;">${r.grade}</span></td>
                            <td>${r.marks || 'N/A'}</td>
                        </tr>
                    `;
                });
            })
            .catch(err => console.error('Error fetching results:', err));
    }

    // --- SHARED HELPER FUNCTIONS ---

    function createItem(endpoint, data, modal, refreshCallback) {
        fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(() => {
                modal.style.display = "none";
                refreshCallback();
            })
            .catch(err => alert('Error creating item: ' + err));
    }

    // Global delete function
    window.deleteItem = (endpoint, id, refreshCallback) => {
        if (confirm('Are you sure?')) {
            fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' })
                .then(() => {
                    // If specific callback provided, use it. Else default to students (legacy support or hot fix)
                    if (refreshCallback) refreshCallback();
                    else fetchStudents();
                })
                .catch(err => alert('Error deleting: ' + err));
        }
    };

    // Close Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            const modalId = btn.getAttribute('data-modal');
            document.getElementById(modalId).style.display = "none";
        };
    });

    window.onclick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = "none";
        }
    };

    // Initial Load
    fetchStudents();
});
