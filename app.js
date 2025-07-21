const users = [
  { username: "john", password: "mtolive300", role: "student", name: "John", gradeLevel: "Grade 5", parent: "mike", teacher: "joe" },
  { username: "joe", password: "mtolive300", role: "teacher", name: "Joe" },
  { username: "mike", password: "mtolive300", role: "parent", name: "Mike" }
];

// Courses
const courses = [
  { student: "john", list: ["Math", "English", "Science", "History"] }
];

// Assignments
const assignments = [
  { student: "john", title: "Math Homework 2", desc: "Complete all exercises on fractions.", due: "2025-07-25" },
  { student: "john", title: "Math Test", desc: "Test on multiplication.", due: "2025-07-30" },
  { student: "john", title: "Science Worksheet 3", desc: "Label the parts of a plant.", due: "2025-07-28" }
];

// Grades
const grades = [
  { student: "john", title: "Math Homework 2", grade: "B", feedback: "Excellent work on fractions." },
  { student: "john", title: "Math Test", grade: "C", feedback: "Study harder." },
  { student: "john", title: "Math Test", grade: "B+", feedback: "Great effort. Improve labeling accuracy." }
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
    showTeacherDashboard(user);
    showScreen("teacher-screen");
  } else if (user.role === "parent") {
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
  const teacherDiv = document.getElementById("teacher-dashboard");
  teacherDiv.innerHTML = `<h2>Welcome, ${teacher.name}</h2><h3>Your Students:</h3>`;

  const students = users.filter(u => u.role === "student" && u.teacher === teacher.username);

  students.forEach(student => {
    teacherDiv.innerHTML += `<p><strong>${student.name}</strong> - ${student.gradeLevel}</p>`;
  });
}

function showParentDashboard(parent) {
  const parentDiv = document.getElementById("parent-dashboard");
  parentDiv.innerHTML = `<h2>Welcome, ${parent.name}</h2><h3>Your Child:</h3>`;

  const child = users.find(u => u.role === "student" && u.parent === parent.username);

  if (child) {
    parentDiv.innerHTML += `<p><strong>${child.name}</strong> - ${child.gradeLevel}</p>`;
    const studentAssignments = assignments.filter(a => a.student === child.username);
    const studentGrades = grades.filter(g => g.student === child.username);

    parentDiv.innerHTML += `<h4>Assignments:</h4><ul>`;
    studentAssignments.forEach(a => {
      parentDiv.innerHTML += `<li>${a.title} - Due: ${a.due}</li>`;
    });
    parentDiv.innerHTML += `</ul><h4>Grades:</h4><ul>`;
    studentGrades.forEach(g => {
      parentDiv.innerHTML += `<li>${g.title} - Grade: ${g.grade}</li>`;
    });
    parentDiv.innerHTML += `</ul>`;
  } else {
    parentDiv.innerHTML += `<p>No child account found.</p>`;
  }
}
