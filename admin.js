// Simple user credentials (in production, use secure backend)
const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  if (username === adminCredentials.username && password === adminCredentials.password) {
    localStorage.setItem('userType', 'admin');
    localStorage.setItem('adminLoggedIn', 'true');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    errorMsg.textContent = '';
  } else {
    errorMsg.textContent = 'Invalid username or password.';
  }
});

function logout() {
  localStorage.removeItem('userType');
  localStorage.removeItem('adminLoggedIn');
  window.location.href = 'login.html';
}

function manageProperties() {
  alert('Manage Properties functionality will be implemented soon.');
}

function viewEnquiries() {
  alert('View Enquiries functionality will be implemented soon.');
}

function viewReports() {
  alert('View Reports functionality will be implemented soon.');
}

// Check if admin is already logged in
window.onload = function() {
  if (localStorage.getItem('userType') === 'admin' && localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
  } else if (localStorage.getItem('userType') === 'customer') {
    window.location.href = 'index.html';
  }
};
