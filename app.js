const users = [
  { username: "john", password: "mtolive300", role: "student", name: "John", gradeLevel: "Grade 5", parent: "mike", teacher: "joe" },
  { username: "jeff", password: "mtolive300", role: "student", name: "Jeff", gradeLevel: "Grade 7", parent: "mike", teacher: "joe" },
  { username: "joe", password: "mtolive300", role: "teacher", name: "Joe" },
  { username: "mike", password: "mtolive300", role: "parent", name: "Mike" }
];

// Courses
const courses = [
  { student: "john", list: ["Math", "English", "Science", "History"] },
  { student: "jeff", list: ["Math", "English", "Science", "History"] }
];

// Assignments
const assignments = [
  { student: "john", title: "Math Homework 2", desc: "Complete all exercises on fractions.", due: "2025-07-25" },
  { student: "john", title: "Math Test", desc: "Test on multiplication.", due: "2025-07-30" },
  { student: "jeff", title: "Science Worksheet 3", desc: "Label the parts of a plant.", due: "2025-07-28" }
];

// Grades
const grades = [
  { student: "john", title: "Math Homework 2", grade: "B", feedback: "Excellent work on fractions." },
  { student: "john", title: "Math Test", grade: "C", feedback: "Study harder." },
  { student: "jeff", title: "Math Test", grade: "B+", feedback: "Great effort. Improve labeling accuracy." }
];

function showScreen(id) {
  document.querySelectorAll(".container, .dashboard-layout").forEach(el => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function showLogin() {
  showScreen("login-screen");
}

function backToWelcome() {
  showScreen("welcome-screen");
}

function logout() {
  showScreen("welcome-screen");
  document.getElementById("assignment-list").innerHTML = "";
  document.getElementById("grade-list").innerHTML = "";
  document.getElementById("course-list").innerHTML = "";
  document.getElementById("teacher-dashboard").innerHTML = "";
  document.getElementById("parent-dashboard").innerHTML = "";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return alert("Invalid credentials");

  if (user.role === "student") {
    document.getElementById("welcome-message").innerText = `Welcome, ${user.name}`;
    document.getElementById("grade-info").innerText = `Grade Level: ${user.gradeLevel}`;
    showCourses(user.username);
    showAssignments(user.username);
    showGrades(user.username);
    showScreen("dashboard-screen");
  } else if (user.role === "teacher") {
    document.getElementById("teacher-sidebar-name").innerText = `Teacher Panel - ${user.name}`;
    showTeacherDashboard(user);
    showScreen("teacher-screen");
  } else if (user.role === "parent") {
    document.getElementById("parent-sidebar-name").innerText = `Parent Panel - ${user.name}`;
    showParentDashboard(user);
    showScreen("parent-screen");
  }
}

function showTab(tab) {
  document.getElementById("dashboard-tab").classList.add("hidden");
  document.getElementById("assignments-tab").classList.add("hidden");
  document.getElementById("grades-tab").classList.add("hidden");
  document.getElementById(`${tab}-tab`).classList.remove("hidden");
}

function showTeacherTab(tab) {
  ["dashboard", "assignments", "grades"].forEach(t =>
    document.getElementById(`teacher-${t}-tab`).classList.add("hidden")
  );
  document.getElementById(`teacher-${tab}-tab`).classList.remove("hidden");
}

function showParentTab(tab) {
  ["dashboard", "assignments", "grades"].forEach(t =>
    document.getElementById(`parent-${t}-tab`).classList.add("hidden")
  );
  document.getElementById(`parent-${tab}-tab`).classList.remove("hidden");
}

function showCourses(studentUsername) {
  const courseData = courses.find(c => c.student === studentUsername);
  const list = document.getElementById("course-list");
  list.innerHTML = "";

  if (courseData) {
    courseData.list.forEach(course => {
      const li = document.createElement("li");
      li.textContent = course;
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No courses found.</li>";
  }
}

function showAssignments(studentUsername) {
  const list = document.getElementById("assignment-list");
  list.innerHTML = "";
  const studentAssignments = assignments.filter(a => a.student === studentUsername);

  studentAssignments.forEach(a => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${a.title}</strong><br>${a.desc}<br><small>Due: ${a.due}</small>`;
    list.appendChild(li);
  });
}

function showGrades(studentUsername) {
  const list = document.getElementById("grade-list");
  list.innerHTML = "";
  const studentGrades = grades.filter(g => g.student === studentUsername);

  studentGrades.forEach(g => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${g.title}</strong><br>Grade: <strong>${g.grade}</strong><br><small>Feedback: ${g.feedback}</small>`;
    list.appendChild(li);
  });
}

function showTeacherDashboard(teacher) {
  const dashboardTab = document.getElementById("teacher-dashboard-tab");
  const assignmentsTab = document.getElementById("teacher-assignments-tab");
  const gradesTab = document.getElementById("teacher-grades-tab");

  const students = users.filter(u => u.role === "student" && u.teacher === teacher.username);

  dashboardTab.innerHTML = `
    <h2>Welcome, ${teacher.name}</h2>
    <h3>Your Students:</h3>
    <ul>
      ${students.map(s => `<li>${s.name} - ${s.gradeLevel}</li>`).join("")}
    </ul>
  `;

  assignmentsTab.innerHTML = `<h3>Student Assignments</h3>`;
  gradesTab.innerHTML = `<h3>Student Grades</h3>`;

  students.forEach(student => {
    const studentAssignments = assignments.filter(a => a.student === student.username);
    const studentGrades = grades.filter(g => g.student === student.username);

    assignmentsTab.innerHTML += `
      <div class="section">
        <strong>${student.name}</strong>
        <ul>${studentAssignments.map(a => `<li>${a.title} - Due: ${a.due}</li>`).join("")}</ul>
      </div>
    `;

    gradesTab.innerHTML += `
      <div class="section">
        <strong>${student.name}</strong>
        <ul>${studentGrades.map(g => `<li>${g.title} - Grade: ${g.grade}</li>`).join("")}</ul>
      </div>
    `;
  });

  showTeacherTab("dashboard");
}



function showParentDashboard(parent) {
  const dashboardTab = document.getElementById("parent-dashboard-tab");
  const assignmentsTab = document.getElementById("parent-assignments-tab");
  const gradesTab = document.getElementById("parent-grades-tab");

  // Get all children for the parent
  const children = users.filter(u => u.role === "student" && u.parent === parent.username);

  // Clear previous content
  dashboardTab.innerHTML = "";
  assignmentsTab.innerHTML = "";
  gradesTab.innerHTML = "";

  if (children.length === 0) {
    dashboardTab.innerHTML = `
      <h2>Welcome, ${parent.name}</h2>
      <p>No child account found.</p>
    `;
    return;
  }

  // Dashboard tab content
  dashboardTab.innerHTML = `<h2>Welcome, ${parent.name}</h2><h3>Your Children:</h3>`;
  children.forEach(child => {
    dashboardTab.innerHTML += `<p><strong>${child.name}</strong> - ${child.gradeLevel}</p>`;
  });

  // Assignments tab content
  assignmentsTab.innerHTML = `<h3>Assignments</h3>`;
  children.forEach(child => {
    const childAssignments = assignments.filter(a => a.student === child.username);
    assignmentsTab.innerHTML += `<h4>${child.name}</h4><ul>${
      childAssignments.map(a => `<li>${a.title} - Due: ${a.due}</li>`).join("")
    }</ul>`;
  });

  // Grades tab content
  gradesTab.innerHTML = `<h3>Grades</h3>`;
  children.forEach(child => {
    const childGrades = grades.filter(g => g.student === child.username);
    gradesTab.innerHTML += `<h4>${child.name}</h4><ul>${
      childGrades.map(g => `<li>${g.title} - Grade: ${g.grade}</li>`).join("")
    }</ul>`;
  });

  // Show default tab
  showParentTab('dashboard');
}



