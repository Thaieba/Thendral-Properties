// Simple user credentials (in production, use secure backend)
const customerCredentials = {
  email: 'customer@example.com',
  password: 'customer123'
};

const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

let isCustomerLogin = true;

function toggleLogin() {
  const title = document.getElementById('login-title');
  const form = document.getElementById('customer-login-form');
  const button = document.querySelector('.toggle-btn');

  if (isCustomerLogin) {
    title.textContent = 'Admin Login';
    form.innerHTML = `
      <input type="text" id="admin-username" placeholder="Username" required>
      <input type="password" id="admin-password" placeholder="Password" required>
      <button type="submit">Login as Admin</button>
    `;
    button.textContent = 'Switch to Customer Login';
    isCustomerLogin = false;
  } else {
    title.textContent = 'Customer Login';
    form.innerHTML = `
      <input type="email" id="customer-email" placeholder="Email" required>
      <input type="password" id="customer-password" placeholder="Password" required>
      <button type="submit">Login as Customer</button>
    `;
    button.textContent = 'Switch to Admin Login';
    isCustomerLogin = true;
  }
}

document.addEventListener('submit', function(e) {
  e.preventDefault();
  const errorMsg = document.getElementById('error-msg');

  if (isCustomerLogin) {
    const email = document.getElementById('customer-email').value;
    const password = document.getElementById('customer-password').value;

    if (email === customerCredentials.email && password === customerCredentials.password) {
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', 'Customer User');
      window.location.href = 'index.html';
    } else {
      errorMsg.textContent = 'Invalid email or password.';
    }
  } else {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'index.html';
    } else {
      errorMsg.textContent = 'Invalid username or password.';
    }
  }
});

// Check if user is already logged in
window.onload = function() {
  if (localStorage.getItem('userType')) {
    // Redirect based on user type
    if (localStorage.getItem('userType') === 'customer') {
      window.location.href = 'index.html';
    } else if (localStorage.getItem('userType') === 'admin') {
      window.location.href = 'index.html';
    }
  }
};
