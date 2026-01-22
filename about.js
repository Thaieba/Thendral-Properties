// Session Management
window.onload = function() {
  const loginLink = document.querySelector('nav a[href="login.html"]');
  const userType = localStorage.getItem('userType');

  if (userType === 'customer') {
    const userName = localStorage.getItem('userName') || 'User';
    loginLink.textContent = `LOGOUT (${userName})`;
    loginLink.href = '#';
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.href = 'index.html';
    });
  } else if (userType === 'admin') {
    // Admin stays on about page, add admin dashboard link
    const nav = document.querySelector('nav');
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'ADMIN DASHBOARD';
    adminLink.style.color = '#ffd166';
    adminLink.style.fontWeight = 'bold';
    nav.appendChild(adminLink);
  } else {
    // Allow non-logged-in users to stay on the home page, redirect others to login
    if (window.location.pathname.split('/').pop() !== 'index.html') {
      window.location.href = 'login.html';
    }
  }
};
