document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTICATION LOGIC ---
    let token = localStorage.getItem('jwt_token') || null;
    let schoolName = localStorage.getItem('school_name') || 'Cloud Engineer';
    
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const authForm = document.getElementById('authForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const registerFields = document.getElementById('registerFields');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    
    let isLoginMode = true;

    function checkAuth() {
        if (token) {
            authContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            document.getElementById('adminSchoolName').textContent = schoolName;
            document.getElementById('adminDisplayName').textContent = 'Admin';

            // Update avatar with school name initials
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(schoolName)}&background=4f46e5&color=fff&bold=true`;
            document.getElementById('adminAvatarImg').src = avatarUrl;

            // Initial Dashboard Load
            fetchStudents();
            loadStats();
            populateDepartmentDropdowns();
        } else {
            authContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
        }
    }

    // Toggle Login/Register
    tabLogin.onclick = () => {
        isLoginMode = true;
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        registerFields.style.display = 'none';
        authSubmitBtn.textContent = 'Login';
    };

    tabRegister.onclick = () => {
        isLoginMode = false;
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerFields.style.display = 'block';
        authSubmitBtn.textContent = 'Register Institution';
    };

    authForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const school_name = document.getElementById('authSchool').value;

        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
        const payload = isLoginMode ? { email, password } : { email, password, school_name };

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Authentication failed');
            return data;
        })
        .then(data => {
            if (isLoginMode) {
                token = data.token;
                schoolName = data.school;
                localStorage.setItem('jwt_token', token);
                localStorage.setItem('school_name', schoolName);
                checkAuth();
            } else {
                alert('Registration successful! Please login.');
                tabLogin.click();
                authForm.reset();
            }
        })
        .catch(err => alert(err.message));
    };

    document.getElementById('logoutBtn').onclick = () => {
        token = null;
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('school_name');
        checkAuth();
    };

    // --- ADMIN PROFILE MODAL ---
    const adminProfileBtn = document.getElementById('adminProfileBtn');
    const adminProfileModal = document.getElementById('adminProfileModal');

    adminProfileBtn.onclick = () => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(schoolName)}&background=4f46e5&color=fff&bold=true&size=128`;
        document.getElementById('profileAvatarLarge').src = avatarUrl;
        document.getElementById('profileSchoolNameHeader').textContent = schoolName;
        document.getElementById('profileSchoolName').textContent = schoolName;

        // Fetch the admin's registered email & date from server
        fetchWithAuth('/api/auth/profile')
            .then(res => res.json())
            .then(data => {
                document.getElementById('profileEmail').textContent = data.email || 'Unavailable';
                if (data.created_at) {
                    document.getElementById('profileCreatedAt').textContent =
                        new Date(data.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
                }
            })
            .catch(() => { document.getElementById('profileEmail').textContent = 'Unavailable'; });

        // Pull live counts already shown on the dashboard
        document.getElementById('profileStudentCount').textContent =
            document.getElementById('statsStudentCount').textContent + ' Students';
        document.getElementById('profileCourseCount').textContent =
            document.getElementById('statsCourseCount').textContent + ' Courses';
        document.getElementById('profileDeptCount').textContent =
            document.getElementById('statsDeptCount').textContent + ' Departments';

        adminProfileModal.style.display = 'flex';
    };

    document.getElementById('logoutFromProfile').onclick = () => {
        adminProfileModal.style.display = 'none';
        document.getElementById('logoutBtn').click();
    };


    // --- THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    let isDarkMode = localStorage.getItem('theme') === 'dark';

    if (isDarkMode) body.setAttribute('data-theme', 'dark');

    themeToggleBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        if (window.deptChartInstance) window.deptChartInstance.update();
        if (window.perfChartInstance) window.perfChartInstance.update();
    });

    // --- NAVIGATION ---
    const links = document.querySelectorAll('.nav-item');
    const views = {
        'homeView': document.getElementById('homeView'),
        'studentsView': document.getElementById('studentsView'),
        'coursesView': document.getElementById('coursesView'),
        'departmentsView': document.getElementById('departmentsView'),
        'resultsView': document.getElementById('resultsView')
    };

    const mainContent = document.querySelector('.main-content');

    // Page titles for top-bar
    const pageTitles = {
        homeView:        'Welcome back, Admin! 👋',
        studentsView:    'Students',
        coursesView:     'Courses',
        departmentsView: 'Departments',
        resultsView:     'Results'
    };

    // Shared navigation function — used by nav links AND stat cards
    function navigateTo(targetId) {
        links.forEach(l => l.classList.remove('active'));
        Object.values(views).forEach(view => view.style.display = 'none');

        const targetLink = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (targetLink) targetLink.classList.add('active');

        if (views[targetId]) {
            views[targetId].style.display = 'block';

            // Always scroll back to top when switching views
            if (mainContent) mainContent.scrollTop = 0;

            // Update top-bar greeting to match the current view
            const topBarTitle = document.querySelector('.top-bar h2');
            if (topBarTitle && pageTitles[targetId]) topBarTitle.textContent = pageTitles[targetId];

            if (targetId === 'studentsView') fetchStudents();
            if (targetId === 'coursesView') fetchCourses();
            if (targetId === 'departmentsView') fetchDepartments();
            if (targetId === 'resultsView') fetchResults();
            if (targetId === 'homeView') loadStats();
        }
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.getAttribute('data-target'));
        });
    });

    // --- Make Stat Cards clickable ---
    // Run after DOM is ready (stat cards exist at this point)
    const statCardMap = [
        { id: 'statsStudentCount', target: 'studentsView' },
        { id: 'statsCourseCount',  target: 'coursesView'  },
        { id: 'statsDeptCount',    target: 'departmentsView' }
    ];
    statCardMap.forEach(({ id, target }) => {
        const card = document.getElementById(id)?.closest('.stat-card');
        if (card) {
            card.style.cursor = 'pointer';
            card.title = `Click to view ${target.replace('View', '')}`;
            card.addEventListener('click', () => navigateTo(target));
        }
    });


    // --- FETCH WRAPPER WITH AUTH ---
    function fetchWithAuth(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            ...(options.headers || {})
        };
        return fetch(url, { ...options, headers });
    }

    // --- STATS & AI DASHBOARD LOGIC ---
    let cachedStats = null;

    function loadStats() {
        if (!token) return;
        Promise.all([
            fetchWithAuth('/api/students').then(r => r.json()).catch(() => []),
            fetchWithAuth('/api/courses').then(r => r.json()).catch(() => []),
            fetchWithAuth('/api/departments').then(r => r.json()).catch(() => []),
            fetchWithAuth('/api/stats').then(r => r.json()).catch(() => null)
        ]).then(([students, courses, depts, stats]) => {
            document.getElementById('statsStudentCount').textContent = students.length || 0;
            document.getElementById('statsCourseCount').textContent = courses.length || 0;
            document.getElementById('statsDeptCount').textContent = depts.length || 0;

            if (stats && window.Chart) {
                cachedStats = stats;
                renderCharts(stats);
            }
        });
    }

    const generateAiBtn = document.getElementById('generateAiReportBtn');
    const aiSummaryText = document.getElementById('aiSummaryText');
    
    if (generateAiBtn) {
        generateAiBtn.onclick = () => {
            if (!cachedStats) {
                alert("Stats not loaded yet.");
                return;
            }
            aiSummaryText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Executive Report...';
            
            fetchWithAuth('/api/ai/report', {
                method: 'POST',
                body: JSON.stringify({ stats: cachedStats })
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to generate AI report');
                return res.json();
            })
            .then(data => {
                // Convert simple markdown (**bold**) to HTML manually for safety
                let formattedText = data.report.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                aiSummaryText.innerHTML = formattedText;
                aiSummaryText.style.color = 'var(--text-color)';
            })
            .catch(err => {
                aiSummaryText.innerHTML = '<span style="color:var(--danger-color)">Error connecting to AI. Is your Gemini Key valid?</span>';
            });
        };
    }

    function renderCharts(stats) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const textColor   = isDark ? '#94a3b8' : '#64748b';
        const gridColor   = isDark ? 'rgba(148,163,184,0.06)' : 'rgba(79,70,229,0.06)';
        const bgCard      = isDark ? '#111c3a' : '#ffffff';

        // Premium palette
        const palette = [
            '#6366f1', '#06b6d4', '#10b981',
            '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
        ];

        // ============ DOUGHNUT CHART ============
        const deptCtx  = document.getElementById('deptChart');
        const deptWrap = deptCtx?.parentElement;
        const centerEl = document.getElementById('deptChartCenter');
        const centerNum = document.getElementById('deptCenterNum');
        if (window.deptChartInstance) window.deptChartInstance.destroy();

        if (stats.departmentDistribution?.length > 0) {
            deptCtx.style.display = '';
            deptWrap?.querySelector('.chart-empty')?.remove();

            const totalStudents = stats.departmentDistribution.reduce((s, d) => s + d.student_count, 0);
            if (centerEl) { centerEl.style.display = 'block'; centerNum.textContent = totalStudents; }

            window.deptChartInstance = new Chart(deptCtx, {
                type: 'doughnut',
                data: {
                    labels: stats.departmentDistribution.map(d => d.department_name),
                    datasets: [{
                        data: stats.departmentDistribution.map(d => d.student_count),
                        backgroundColor: palette,
                        borderWidth: 4,
                        borderColor: bgCard,
                        hoverBorderColor: bgCard,
                        hoverBorderWidth: 4,
                        hoverOffset: 12
                    }]
                },
                options: {
                    cutout: '72%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                padding: 18,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: { family: 'Inter', size: 12, weight: '500' }
                            }
                        },
                        tooltip: {
                            backgroundColor: isDark ? '#1e3a5f' : '#fff',
                            titleColor: isDark ? '#e2e8f0' : '#0f172a',
                            bodyColor: isDark ? '#94a3b8' : '#64748b',
                            borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(79,70,229,0.2)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 12,
                            displayColors: true,
                            callbacks: {
                                label: ctx => ` ${ctx.label}: ${ctx.raw} students (${Math.round(ctx.raw / totalStudents * 100)}%)`
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 900,
                        easing: 'easeOutQuart'
                    }
                }
            });
        } else {
            deptCtx.style.display = 'none';
            if (centerEl) centerEl.style.display = 'none';
            if (!deptWrap?.querySelector('.chart-empty')) {
                const msg = document.createElement('div');
                msg.className = 'chart-empty';
                msg.innerHTML = `<i class="fas fa-users" style="font-size:2.5rem;color:var(--border-strong);"></i><p style="color:var(--text-muted);margin-top:10px;font-size:0.85rem;line-height:1.6;">Assign students to departments<br>to see enrollment distribution</p>`;
                msg.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:180px;text-align:center;';
                deptWrap?.appendChild(msg);
            }
        }

        // ============ BAR CHART ============
        const perfCtx  = document.getElementById('perfChart');
        const perfWrap = perfCtx?.parentElement;
        if (window.perfChartInstance) window.perfChartInstance.destroy();

        if (stats.coursePerformance?.length > 0) {
            perfCtx.style.display = '';
            perfWrap?.querySelector('.chart-empty')?.remove();

            const scores = stats.coursePerformance.map(c => parseFloat(c.average_marks));

            // Score-based bar colors: green ≥75, amber 50-74, red <50
            const barColors = scores.map(s =>
                s >= 75 ? 'rgba(16,185,129,0.85)' :
                s >= 50 ? 'rgba(245,158,11,0.85)' :
                          'rgba(239,68,68,0.85)'
            );

            window.perfChartInstance = new Chart(perfCtx, {
                type: 'bar',
                data: {
                    labels: stats.coursePerformance.map(c => c.course_name),
                    datasets: [
                        {
                            label: 'Avg Marks',
                            data: scores,
                            backgroundColor: barColors,
                            hoverBackgroundColor: scores.map(s =>
                                s >= 75 ? 'rgba(16,185,129,1)' :
                                s >= 50 ? 'rgba(245,158,11,1)' :
                                          'rgba(239,68,68,1)'
                            ),
                            borderRadius: 10,
                            borderSkipped: false,
                            barPercentage: 0.6,
                            categoryPercentage: 0.75,
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
                            grid: { display: false },
                            border: { display: false }
                        },
                        y: {
                            ticks: {
                                color: textColor,
                                font: { family: 'Inter', size: 11 },
                                stepSize: 25,
                                callback: v => v + '%'
                            },
                            grid: {
                                color: gridColor,
                                drawTicks: false
                            },
                            border: { display: false, dash: [4, 4] },
                            min: 0, max: 100
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        intersect: true
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: isDark ? '#1e3a5f' : '#fff',
                            titleColor: isDark ? '#e2e8f0' : '#0f172a',
                            bodyColor: isDark ? '#94a3b8' : '#64748b',
                            borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(79,70,229,0.2)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 12,
                            displayColors: false,
                            callbacks: {
                                title: ctx => ctx[0].label,
                                label: ctx => {
                                    const v = ctx.raw;
                                    const grade = v >= 75 ? '🟢 Excellent' : v >= 50 ? '🟡 Average' : '🔴 Needs Improvement';
                                    return [`  Score: ${v} / 100`, `  Grade: ${grade}`];
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 900,
                        easing: 'easeOutQuart',
                        delay: ctx => ctx.dataIndex * 80
                    }
                }
            });
        } else {
            perfCtx.style.display = 'none';
            if (!perfWrap?.querySelector('.chart-empty')) {
                const msg = document.createElement('div');
                msg.className = 'chart-empty';
                msg.innerHTML = `<i class="fas fa-chart-bar" style="font-size:2.5rem;color:var(--border-strong);"></i><p style="color:var(--text-muted);margin-top:10px;font-size:0.85rem;line-height:1.6;">Add results with marks<br>to see course performance</p>`;
                msg.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:180px;text-align:center;';
                perfWrap?.appendChild(msg);
            }
        }
    }


    function populateDepartmentDropdowns() {

        if(!token) return;
        fetchWithAuth('/api/departments')
            .then(res => res.json())
            .then(data => {
                const studentSelect = document.getElementById('studentDeptId');
                const courseSelect = document.getElementById('courseDeptId');

                studentSelect.innerHTML = '<option value="">Select Department...</option>';
                courseSelect.innerHTML = '<option value="">Select Department...</option>';

                if(Array.isArray(data)) {
                    data.forEach(dept => {
                        const option = `<option value="${dept.department_id}">${dept.department_name}</option>`;
                        studentSelect.innerHTML += option;
                        courseSelect.innerHTML += option;
                    });
                }
            })
            .catch(err => console.error('Error loading departments:', err));
    }

    // --- STUDENTS LOGIC ---
    const studentTableBody = document.getElementById('studentTableBody');
    const studentModal = document.getElementById('studentModal');

    function fetchStudents() {
        fetchWithAuth('/api/students')
            .then(res => res.json())
            .then(data => {
                studentTableBody.innerHTML = '';
                if(Array.isArray(data)) {
                    data.forEach(s => {
                        studentTableBody.innerHTML += `
                            <tr>
                                <td>${s.student_id}</td>
                                <td>${s.first_name} ${s.last_name}</td>
                                <td>${s.email}</td>
                                <td>${new Date(s.dob).toLocaleDateString()}</td>
                                <td>${s.department_name || s.department_id || '-'}</td>
                                <td><button class="btn btn-danger" onclick="deleteItem('students', ${s.student_id})"><i class="fas fa-trash"></i></button></td>
                            </tr>
                        `;
                    });
                }
            });
    }

    document.getElementById('addStudentBtn').onclick = () => studentModal.style.display = "flex";

    document.getElementById('studentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Fix for silent Add Data bug: parse to integer or null instead of empty string!
        let deptIdRaw = document.getElementById('studentDeptId').value;
        const data = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            department_id: deptIdRaw ? parseInt(deptIdRaw) : null 
        };
        createItem('students', data, studentModal, fetchStudents);
    });

    // --- COURSES LOGIC ---
    const courseTableBody = document.getElementById('courseTableBody');
    const courseModal = document.getElementById('courseModal');

    function fetchCourses() {
        fetchWithAuth('/api/courses')
            .then(res => res.json())
            .then(data => {
                courseTableBody.innerHTML = '';
                if(Array.isArray(data)){
                    data.forEach(c => {
                        courseTableBody.innerHTML += `
                            <tr>
                                <td>${c.course_id}</td>
                                <td>${c.course_name}</td>
                                <td>${c.credits}</td>
                                <td>${c.department_name || c.department_id || '-'}</td>
                                <td><button class="btn btn-danger" onclick="deleteItem('courses', ${c.course_id})"><i class="fas fa-trash"></i></button></td>
                            </tr>
                        `;
                    });
                }
            });
    }

    document.getElementById('addCourseBtn').onclick = () => courseModal.style.display = "flex";

    document.getElementById('courseForm').addEventListener('submit', (e) => {
        e.preventDefault();
         // Parse string to number to avoid SQL invisible failures
        let deptIdRaw = document.getElementById('courseDeptId').value;
        const data = {
            course_name: document.getElementById('courseName').value,
            credits: parseInt(document.getElementById('courseCredits').value) || 0,
            department_id: deptIdRaw ? parseInt(deptIdRaw) : null
        };
        createItem('courses', data, courseModal, fetchCourses);
    });

    // --- DEPARTMENTS LOGIC ---
    const deptTableBody = document.getElementById('departmentTableBody');
    const deptModal = document.getElementById('departmentModal');

    function fetchDepartments() {
        fetchWithAuth('/api/departments')
            .then(res => res.json())
            .then(data => {
                deptTableBody.innerHTML = '';
                if(Array.isArray(data)){
                    data.forEach(d => {
                        deptTableBody.innerHTML += `
                            <tr>
                                <td>${d.department_id}</td>
                                <td>${d.department_name}</td>
                                <td>${d.head_of_dept}</td>
                                <td><button class="btn btn-danger" onclick="deleteItem('departments', ${d.department_id})"><i class="fas fa-trash"></i></button></td>
                            </tr>
                        `;
                    });
                }
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

    // --- RESULTS LOGIC & AI PLANNER ---
    const resultsTableBody = document.getElementById('resultsTableBody');
    const resultModal = document.getElementById('resultModal');

    function getAIInsightButton(r) {
        if (r.marks === null || r.marks === undefined) return '<span class="ai-badge risk">No Data</span>';
        const dataPayload = encodeURIComponent(JSON.stringify({
            student_name: `${r.first_name} ${r.last_name}`,
            course_name: r.course_name,
            department_name: r.department_name || 'General',
            grade: r.grade,
            marks: r.marks
        }));
        return `<button class="ai-btn" onclick="openAIStudentPlan('${dataPayload}')"><i class="fas fa-magic ai-glow"></i> Ask AI</button>`;
    }

    window.openAIStudentPlan = (encodedData) => {
        const studentData = JSON.parse(decodeURIComponent(encodedData));
        const modal = document.getElementById('aiPlanModal');
        const contentBox = document.getElementById('aiPlanContent');
        document.getElementById('aiPlanStudentName').textContent = studentData.student_name;
        contentBox.innerHTML = '<i class="fas fa-spinner fa-spin ai-glow"></i> Analyzing grades and formulating strategy...';
        modal.style.display = 'flex';
        fetchWithAuth('/api/ai/student', { method: 'POST', body: JSON.stringify(studentData) })
        .then(res => res.json())
        .then(data => {
            if (data.message && data.message.includes('missing')) throw new Error(data.message);
            let htmlPlan = data.plan.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            contentBox.innerHTML = htmlPlan;
        })
        .catch(err => {
            contentBox.innerHTML = `<span style="color:var(--danger-color)"><i class="fas fa-exclamation-triangle"></i> AI Failed: ${err.message}</span>`;
        });
    };

    function fetchResults() {
        fetchWithAuth('/api/marks')
            .then(res => res.json())
            .then(data => {
                resultsTableBody.innerHTML = '';
                if (Array.isArray(data)) {
                    data.forEach(r => {
                        resultsTableBody.innerHTML += `
                            <tr>
                                <td>${r.first_name} ${r.last_name}</td>
                                <td>${r.course_name}</td>
                                <td>${r.department_name || '-'}</td>
                                <td><span style="background:rgba(59,130,246,0.1);color:#3b82f6;padding:2px 8px;border-radius:4px;font-weight:500;">${r.grade || '-'}</span></td>
                                <td><strong>${r.marks !== null && r.marks !== undefined ? r.marks : 'N/A'}</strong></td>
                                <td>${getAIInsightButton(r)}</td>
                                <td><button class="btn btn-danger" style="padding:4px 10px;font-size:0.8rem;" onclick="deleteResult(${r.enrollment_id})"><i class="fas fa-trash"></i></button></td>
                            </tr>
                        `;
                    });
                }
            })
            .catch(err => console.error('Error fetching results:', err));
    }

    // Populate student and course dropdowns in the result modal
    function populateResultDropdowns() {
        Promise.all([
            fetchWithAuth('/api/students').then(r => r.json()),
            fetchWithAuth('/api/courses').then(r => r.json())
        ]).then(([students, courses]) => {
            const studentSel = document.getElementById('resultStudentId');
            const courseSel = document.getElementById('resultCourseId');
            studentSel.innerHTML = '<option value="">Select Student...</option>';
            courseSel.innerHTML = '<option value="">Select Course...</option>';
            if (Array.isArray(students)) {
                students.forEach(s => {
                    studentSel.innerHTML += `<option value="${s.student_id}">${s.first_name} ${s.last_name}</option>`;
                });
            }
            if (Array.isArray(courses)) {
                courses.forEach(c => {
                    courseSel.innerHTML += `<option value="${c.course_id}">${c.course_name}</option>`;
                });
            }
        });
    }

    document.getElementById('addResultBtn').onclick = () => {
        populateResultDropdowns();
        resultModal.style.display = 'flex';
    };

    document.getElementById('resultForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            student_id: parseInt(document.getElementById('resultStudentId').value),
            course_id: parseInt(document.getElementById('resultCourseId').value),
            grade: document.getElementById('resultGrade').value || null,
            marks: document.getElementById('resultMarks').value || null
        };
        if (!data.student_id || !data.course_id) {
            alert('Please select both a student and a course.');
            return;
        }
        fetchWithAuth('/api/marks', { method: 'POST', body: JSON.stringify(data) })
            .then(res => {
                if (!res.ok) throw new Error('Failed to save result');
                return res.json();
            })
            .then(() => {
                resultModal.style.display = 'none';
                document.getElementById('resultForm').reset();
                fetchResults();
            })
            .catch(err => alert('Error: ' + err.message));
    });

    window.deleteResult = (enrollmentId) => {
        if (confirm('Delete this result? This will also remove the enrollment record.')) {
            fetchWithAuth(`/api/marks/${enrollmentId}`, { method: 'DELETE' })
                .then(res => {
                    if (!res.ok) throw new Error('Delete failed');
                    fetchResults();
                })
                .catch(err => alert('Error: ' + err.message));
        }
    };

    // --- SHARED HELPER FUNCTIONS ---

    function createItem(endpoint, data, modal, refreshCallback) {
        fetchWithAuth(`/api/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(res => {
                if(res.status === 401 || res.status === 403) {
                    alert('Session expired. Please log in again.');
                    document.getElementById('logoutBtn').click();
                    throw new Error('Unauthorized');
                }
                if (!res.ok) throw new Error('API Error - Database Validation Failed');
                return res.json();
            })
            .then(() => {
                modal.style.display = "none";
                refreshCallback();
                if (endpoint === 'departments') populateDepartmentDropdowns();
            })
            .catch(err => alert('Error creating item: ' + err.message));
    }

    window.deleteItem = (endpoint, id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            fetchWithAuth(`/api/${endpoint}/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (!res.ok) throw new Error('Delete Failed');
                    // Refresh the correct table based on endpoint name
                    if (endpoint === 'students') fetchStudents();
                    else if (endpoint === 'courses') fetchCourses();
                    else if (endpoint === 'departments') {
                        fetchDepartments();
                        populateDepartmentDropdowns();
                    }
                })
                .catch(err => alert('Error deleting: ' + err.message));
        }
    };

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

    // ========== CHATBOT LOGIC ==========
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotHeader = document.getElementById('chatbotHeader');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    // Toggle open/close
    chatbotHeader.onclick = () => {
        chatbotWidget.classList.toggle('collapsed');
    };
    // Start collapsed
    chatbotWidget.classList.add('collapsed');

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('chat-message', sender);
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    async function sendChatMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        chatInput.value = '';
        appendMessage(question, 'user');

        const typingEl = appendMessage('CloudBot is thinking...', 'typing');

        // Build live context from cached stats and counts
        const context = {
            totalStudents: document.getElementById('statsStudentCount').textContent,
            totalCourses: document.getElementById('statsCourseCount').textContent,
            totalDepartments: document.getElementById('statsDeptCount').textContent,
            chartStats: cachedStats || {}
        };

        try {
            const res = await fetchWithAuth('/api/ai/chat', {
                method: 'POST',
                body: JSON.stringify({ question, context })
            });
            const data = await res.json();
            typingEl.remove();
            appendMessage(data.answer || data.message || 'Sorry, I could not process that.', 'bot');
        } catch (err) {
            typingEl.remove();
            appendMessage('Connection error. Please check your Gemini API key.', 'bot');
        }
    }

    chatSendBtn.onclick = sendChatMessage;
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // ========== PDF EXPORT (Structured) ==========
    window.exportToPDF = (tableBodyId, title) => {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) return alert('PDF library not loaded yet. Please wait a moment and try again.');

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const now = new Date();

        // ---- Header Banner ----
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, pageW, 22, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('☁ Cloud SMS — ' + title, 10, 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`School: ${localStorage.getItem('school_name') || 'N/A'}`, pageW - 10, 9, { align: 'right' });
        doc.text(`Exported: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, pageW - 10, 15, { align: 'right' });

        // ---- Summary Row ----
        doc.setFillColor(240, 244, 255);
        doc.rect(0, 22, pageW, 12, 'F');
        doc.setTextColor(79, 70, 229);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const students = document.getElementById('statsStudentCount').textContent;
        const courses = document.getElementById('statsCourseCount').textContent;
        const depts = document.getElementById('statsDeptCount').textContent;
        doc.text(`Total Students: ${students}   |   Total Courses: ${courses}   |   Departments: ${depts}`, 10, 29);

        // ---- Table Data ----
        const table = document.getElementById(tableBodyId).closest('table');
        const headers = [...table.querySelectorAll('thead th')]
            .map(th => th.textContent.trim())
            .filter(h => h !== 'Actions'); // exclude Actions column

        const rows = [...table.querySelectorAll(`#${tableBodyId} tr`)].map(tr => {
            const cells = [...tr.querySelectorAll('td')];
            return cells
                .filter((_, i) => headers.length > i) // skip Actions column
                .map(td => {
                    // Strip all HTML tags and get clean text content
                    const clone = td.cloneNode(true);
                    // Replace button/badge HTML with their text
                    clone.querySelectorAll('button').forEach(btn => {
                        const txt = btn.textContent.trim().replace('Ask AI', 'AI Available').replace('', '');
                        btn.replaceWith(document.createTextNode(txt));
                    });
                    clone.querySelectorAll('.ai-badge').forEach(badge => {
                        badge.replaceWith(document.createTextNode(badge.textContent.trim()));
                    });
                    return clone.textContent.trim() || '—';
                });
        });

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 36,
            styles: {
                fontSize: 9,
                cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
                lineColor: [220, 225, 240],
                lineWidth: 0.3,
                textColor: [15, 23, 42]
            },
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 8.5,
                cellPadding: { top: 5, right: 6, bottom: 5, left: 6 }
            },
            alternateRowStyles: { fillColor: [248, 250, 255] },
            columnStyles: { 0: { cellWidth: 'auto' } },
            margin: { left: 10, right: 10 },
            didDrawPage: (data) => {
                // Footer on every page
                const pgCount = doc.internal.getNumberOfPages();
                doc.setFontSize(7.5);
                doc.setTextColor(150);
                doc.setFont('helvetica', 'normal');
                doc.text(
                    `Page ${data.pageNumber} of ${pgCount}  |  Generated by Cloud SMS`,
                    pageW / 2, doc.internal.pageSize.getHeight() - 6,
                    { align: 'center' }
                );
            }
        });

        doc.save(`CloudSMS_${title.replace(/\s+/g, '_')}_${now.toISOString().slice(0,10)}.pdf`);
    };


    // ========== EXCEL EXPORT ==========
    window.exportToExcel = (tableBodyId, sheetName) => {
        if (!window.XLSX) return alert('Excel library not loaded yet.');

        const table = document.getElementById(tableBodyId).closest('table');
        const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
        const rows = [...table.querySelectorAll(`#${tableBodyId} tr`)].map(tr =>
            [...tr.querySelectorAll('td')].map(td => td.textContent.trim())
        );

        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

        // Style the header row width
        ws['!cols'] = headers.map(() => ({ wch: 20 }));

        XLSX.writeFile(wb, `${sheetName}_${Date.now()}.xlsx`);
    };

    // Initial Execution
    checkAuth();
});
