let users = [];

// Load users from JSON file
fetch('users.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Could not load JSON file');
    }
    return response.json();
  })
  .then(data => {
    users = data;
    console.log('Users loaded:', users);
  })
  .catch(err => {
    console.error('Failed to load user data', err);
    alert('User data could not be loaded.');
  });

// Screen navigation
function switchView(viewId) {
  document.querySelectorAll('.container').forEach(div => {
    div.classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
}

function showLogin() {
  switchView('login-screen');
}

function backToWelcome() {
  switchView('welcome-screen');
}

function logout() {
  switchView('welcome-screen');
}

// Login logic
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid credentials!");
    return;
  }

  document.getElementById("welcome-message").textContent = `Welcome, ${user.username}`;
  document.getElementById("role-info").textContent = `Role: ${user.role}`;

  let dashboardHTML = '';

  if (user.role === "Student") {
    dashboardHTML = `
      <h3>Your Courses:</h3>
      <ul>${user.courses.map(course => `<li>${course}</li>`).join('')}</ul>

      <h3>Your Assignments:</h3>
      <ul>
        ${user.assignments?.length
          ? user.assignments.map(a => `<li>${a.title} - ${a.status}</li>`).join('')
          : '<li>No assignments found</li>'}
      </ul>

      <h3>Your Grades:</h3>
      <ul>
        ${user.grades?.length
          ? user.grades.map(g => `<li>${g.course}: ${g.grade}</li>`).join('')
          : '<li>No grades found</li>'}
      </ul>
    `;

  } else if (user.role === "Parent") {
    const child = users.find(u => u.username === user.child);
    if (!child) {
      dashboardHTML = `<p>No data found for child "${user.child}".</p>`;
    } else {
      dashboardHTML = `
        <h3>Child: ${child.username}</h3>

        <h3>Courses:</h3>
        <ul>${child.courses.map(course => `<li>${course}</li>`).join('')}</ul>

        <h3>Assignments:</h3>
        <ul>
          ${child.assignments?.length
            ? child.assignments.map(a => `<li>${a.title} - ${a.status}</li>`).join('')
            : '<li>No assignments found</li>'}
        </ul>

        <h3>Grades:</h3>
        <ul>
          ${child.grades?.length
            ? child.grades.map(g => `<li>${g.course}: ${g.grade}</li>`).join('')
            : '<li>No grades found</li>'}
        </ul>
      `;
    }

  } else if (user.role === "Teacher") {
    const teacherStudents = users.filter(u => u.role === "Student" && u.teacher === user.username);

    dashboardHTML = `<h3>Your Students:</h3>`;

    if (teacherStudents.length === 0) {
      dashboardHTML += `<p>No students assigned to you.</p>`;
    } else {
      teacherStudents.forEach(student => {
        const parent = users.find(p => p.username === student.parent);
        dashboardHTML += `
          <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">
            <strong>${student.username}</strong><br/>
            Courses: ${student.courses.join(', ')}<br/>
            Assignments:
            <ul>
              ${student.assignments.map(a => `<li>${a.title} - ${a.status}</li>`).join('')}
            </ul>
            Grades:
            <ul>
              ${student.grades.map(g => `<li>${g.course}: ${g.grade}</li>`).join('')}
            </ul>
            Parent: ${parent ? parent.username : "N/A"}
          </div>
        `;
      });
    }
  }

  document.getElementById("main-content").innerHTML = dashboardHTML;
  switchView('dashboard-screen');
}
