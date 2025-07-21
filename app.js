// app.js

// Dummy users
const users = [
  { username: "teacher1", password: "pass789", role: "teacher" },
  { username: "student1", password: "pass123", role: "student", teacher: "teacher1", parent: "parent1" },
  { username: "student2", password: "pass124", role: "student", teacher: "teacher1", parent: "parent2" },
  { username: "parent1", password: "pass456", role: "parent" },
  { username: "parent2", password: "pass457", role: "parent" }
];

// Show one screen and hide others
function showScreen(screenId) {
  document.querySelectorAll(".container").forEach(div => {
    div.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}

// Show login screen
function showLogin() {
  showScreen("login-screen");
}

// Back to welcome screen
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

// Login handler
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

// Load dashboard content by role
function loadDashboard(user) {
  const mainContent = document.getElementById("main-content");

  if (user.role === "teacher") {
    const students = users.filter(u => u.role === "student" && u.teacher === user.username);
    let html = "<h3>Your Students:</h3><ul>";

    students.forEach(student => {
      html += `<li>${student.username} (Parent: ${student.parent})</li>`;
    });

    html += "</ul>";
    mainContent.innerHTML = html;
  } else if (user.role === "student") {
    mainContent.innerHTML = "<p>Here are your assignments and grades.</p>";
  } else if (user.role === "parent") {
    const child = users.find(u => u.role === "student" && u.parent === user.username);
    mainContent.innerHTML = child
      ? `<p>Your child's username: ${child.username}</p>`
      : "<p>No child linked to your account.</p>";
  } else {
    mainContent.innerHTML = "<p>Unknown role.</p>";
  }
}
