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

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            Object.values(views).forEach(view => view.style.display = 'none');

            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            if (views[targetId]) {
                views[targetId].style.display = 'block';
                if (targetId === 'studentsView') fetchStudents();
                if (targetId === 'coursesView') fetchCourses();
                if (targetId === 'departmentsView') fetchDepartments();
                if (targetId === 'resultsView') fetchResults();
                if (targetId === 'homeView') loadStats();
            }
        });
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
        const getThemeColor = () => document.body.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#1f2937';
        
        const deptCtx = document.getElementById('deptChart');
        if (window.deptChartInstance) window.deptChartInstance.destroy();
        
        if (stats.departmentDistribution && stats.departmentDistribution.length > 0) {
            window.deptChartInstance = new Chart(deptCtx, {
                type: 'doughnut',
                data: {
                    labels: stats.departmentDistribution.map(d => d.department_name),
                    datasets: [{
                        data: stats.departmentDistribution.map(d => d.student_count),
                        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: { plugins: { legend: { position: 'bottom', labels: { color: getThemeColor } } } }
            });
        }

        const perfCtx = document.getElementById('perfChart');
        if (window.perfChartInstance) window.perfChartInstance.destroy();
        
        if (stats.coursePerformance && stats.coursePerformance.length > 0) {
            window.perfChartInstance = new Chart(perfCtx, {
                type: 'bar',
                data: {
                    labels: stats.coursePerformance.map(c => c.course_name),
                    datasets: [{
                        label: 'Average Marks',
                        data: stats.coursePerformance.map(c => c.average_marks),
                        backgroundColor: '#6366f1',
                        borderRadius: 6
                    }]
                },
                options: {
                    scales: {
                        x: { ticks: { color: getThemeColor } },
                        y: { ticks: { color: getThemeColor }, beginAtZero: true, max: 100 }
                    },
                    plugins: { legend: { display: false } }
                }
            });
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
                                <td><button class="btn btn-danger" onclick="deleteItem('students', ${s.student_id})">Delete</button></td>
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
                                <td><button class="btn btn-danger" onclick="deleteItem('courses', ${c.course_id}, fetchCourses)">Delete</button></td>
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
                                <td><button class="btn btn-danger" onclick="deleteItem('departments', ${d.department_id}, fetchDepartments)">Delete</button></td>
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

    function getAIInsightButton(r) {
        if (r.marks === null || r.marks === undefined) return '<span class="ai-badge risk">No Data</span>';
        
        // Return a clickable AI button mapping all data
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

        fetchWithAuth('/api/ai/student', {
            method: 'POST',
            body: JSON.stringify(studentData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message && data.message.includes('missing')) throw new Error(data.message);
            // Replace newlines with <br> and bold markers
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
                if(Array.isArray(data)){
                    data.forEach(r => {
                        resultsTableBody.innerHTML += `
                            <tr>
                                <td>${r.first_name} ${r.last_name}</td>
                                <td>${r.course_name}</td>
                                <td>${r.department_name || '-'}</td>
                                <td><span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 2px 8px; border-radius: 4px; font-weight: 500;">${r.grade}</span></td>
                                <td>${r.marks || 'N/A'}</td>
                                <td>${getAIInsightButton(r)}</td>
                            </tr>
                        `;
                    });
                }
            })
            .catch(err => console.error('Error fetching results:', err));
    }

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

    window.deleteItem = (endpoint, id, refreshCallback) => {
        if (confirm('Are you sure?')) {
            fetchWithAuth(`/api/${endpoint}/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (!res.ok) throw new Error('Delete Failed');
                    if (refreshCallback) refreshCallback();
                    else fetchStudents();
                    
                    if (endpoint === 'departments') populateDepartmentDropdowns();
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

    // ========== PDF EXPORT ==========
    window.exportToPDF = (tableBodyId, title) => {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) return alert('PDF library not loaded yet.');

        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(title, 14, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Exported on ${new Date().toLocaleDateString()}`, 14, 26);

        const table = document.getElementById(tableBodyId).closest('table');
        const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
        const rows = [...table.querySelectorAll(`#${tableBodyId} tr`)].map(tr =>
            [...tr.querySelectorAll('td')].map(td => td.textContent.trim())
        );

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 32,
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 14, right: 14 }
        });

        doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
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
