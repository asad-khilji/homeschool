// app.js

// Dummy data
const users = [
  { username: "joe", password: "mtolive300", role: "teacher" },
  { username: "john", password: "mtolive300", role: "student", teacher: "joe", parent: "mike" },
  { username: "jake", password: "mtolive300", role: "student", teacher: "joe", parent: "mike" },
  { username: "mike", password: "mtolive300", role: "parent" },
  { username: "david", password: "mtolive300", role: "teacher" },
  { username: "danny", password: "mtolive300", role: "student", teacher: "david", parent: "jeff" },
  { username: "jeff", password: "mtolive300", role: "parent" }
];

// Assignments DB
const assignments = [
  { student: "john", title: "Math Homework", grade: "A" },
  { student: "john", title: "History Essay", grade: "B+" },
  { student: "jake", title: "Science Project", grade: "A-" },
  { student: "danny", title: "Science Project", grade: "" }
];

// Show one screen
function showScreen(screenId) {
  document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
}

// Show login screen
function showLogin() {
  showScreen("login-screen");
}

// Back to welcome
function backToWelcome() {
  showScreen("welcome-screen");
}

// Logout
function logout() {
  showScreen("welcome-screen");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("main-content").innerHTML = "";
}

// Login
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    document.getElementById("welcome-message").textContent = `Welcome, ${user.username}!`;
    document.getElementById("role-info").textContent = `Role: ${user.role}`;
    loadDashboard(user);
    showScreen("dashboard-screen");
  } else {
    alert("Invalid credentials.");
  }
}

// Dashboard view
function loadDashboard(user) {
  const main = document.getElementById("main-content");

  if (user.role === "teacher") {
    const students = users.filter(u => u.role === "student" && u.teacher === user.username);
    let html = "<h3>Your Students:</h3><ul>";

    students.forEach(student => {
      html += `<li><strong>${student.username}</strong> (Parent: ${student.parent})<br/>Assignments:<ul>`;

      const studentAssignments = assignments.filter(a => a.student === student.username);
      studentAssignments.forEach(a => {
        html += `<li>${a.title} — Grade: ${a.grade}</li>`;
      });

      html += "</ul></li>";
    });

    html += "</ul>";
    main.innerHTML = html;

  } else if (user.role === "student") {
    const studentAssignments = assignments.filter(a => a.student === user.username);
    let html = "<h3>Your Assignments:</h3><ul>";
    studentAssignments.forEach(a => {
      html += `<li>${a.title} — Grade: ${a.grade}</li>`;
    });
    html += "</ul>";
    main.innerHTML = html;

  } else if (user.role === "parent") {
    const child = users.find(u => u.role === "student" && u.parent === user.username);
    if (child) {
      const studentAssignments = assignments.filter(a => a.student === child.username);
      let html = `<p>Your child's username: <strong>${child.username}</strong></p><h3>Assignments:</h3><ul>`;
      studentAssignments.forEach(a => {
        html += `<li>${a.title} — Grade: ${a.grade}</li>`;
      });
      html += "</ul>";
      main.innerHTML = html;
    } else {
      main.innerHTML = "<p>No child linked to your account.</p>";
    }
  }
}
