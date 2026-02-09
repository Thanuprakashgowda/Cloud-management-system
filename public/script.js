document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('studentTableBody');
    const modal = document.getElementById('studentModal');
    const addBtn = document.getElementById('addStudentBtn');
    const closeBtn = document.querySelector('.close');
    const studentForm = document.getElementById('studentForm');

    // API Base URL
    const API_URL = 'http://localhost:8080/api/students';

    // Fetch and display students
    fetchStudents();

    function fetchStudents() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = '';
                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.student_id}</td>
                        <td>${student.first_name} ${student.last_name}</td>
                        <td>${student.email}</td>
                        <td>${new Date(student.dob).toLocaleDateString()}</td>
                        <td>${student.department_name || student.department_id}</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteStudent(${student.student_id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching students:', error));
    }

    // Modal logic
    addBtn.onclick = () => {
        studentForm.reset();
        modal.style.display = "block";
    }

    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Add Student
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const studentData = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            department_id: document.getElementById('departmentId').value
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
            .then(response => response.json())
            .then(data => {
                modal.style.display = "none";
                fetchStudents(); // Refresh list
            })
            .catch(error => console.error('Error adding student:', error));
    });

    // Delete Student
    window.deleteStudent = (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    fetchStudents();
                })
                .catch(error => console.error('Error deleting student:', error));
        }
    }
});
