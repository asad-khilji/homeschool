let users = [];

fetch('users.json')
  .then(response => response.json())
  .then(data => users = data)
  .catch(err => console.error('Failed to load user data', err));

function showLogin() {
  switchView('login-screen');
}

function backToWelcome() {
  switchView('welcome-screen');
}

function logout() {
  switchView('welcome-screen');
}

function switchView(viewId) {
  document.querySelectorAll('.container').forEach(div => {
    div.classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    document.getElementById("welcome-message").textContent = `Welcome, ${user.username}`;
    document.getElementById("role-info").textContent = `Role: ${user.role}`;
    document.getElementById("main-content").innerHTML = `
      <h3>Your Courses:</h3>
      <ul>${user.courses.map(course => `<li>${course}</li>`).join('')}</ul>
    `;
    switchView('dashboard-screen');
  } else {
    alert("Invalid credentials!");
  }
}
