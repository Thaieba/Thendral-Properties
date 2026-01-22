const locationDetails = {
  'Chennai': [
    { name: 'T. Nagar', type: 'Apartments', status: 'Ready to Occupy', price: '₹90 Lakhs' },
    { name: 'Pallavaram', type: 'Duplex Houses', status: 'Completed', price: '₹80 Lakhs' },
    { name: 'Anna Nagar', type: 'Apartments', status: 'Under Construction', price: '₹60 Lakhs' }
  ],
  'Coimbatore': [
    { name: 'RS Puram', type: 'Apartments', status: 'Ready to Occupy', price: '₹70 Lakhs' },
    { name: 'Peelamedu', type: 'Duplex Houses', status: 'Completed', price: '₹85 Lakhs' },
    { name: 'Saravanampatti', type: 'Villa', status: 'Under Construction', price: '₹1.1 Crores' }
  ],
  'Trichy': [
    { name: 'Samayapuram', type: 'Apartments', status: 'Ready to Occupy', price: '₹55 Lakhs' },
    { name: 'Melur', type: 'Duplex Houses', status: 'Completed', price: '₹70 Lakhs' },
    { name: 'Srirangam', type: 'Villa', status: 'Under Construction', price: '₹95 Lakhs' }
  ],
  'Tirunelveli': [
    { name: 'Palayamkottai', type: 'Apartment', status: 'Ready to Occupy', price: '₹50 Lakhs' },
    { name: 'Vannarapettai', type: 'Duplex Houses', status: 'Completed', price: '₹75 Lakhs' },
    { name: 'Melapalayam', type: 'Villa', status: 'Under Construction', price: '₹85 Lakhs' }
  ],
  'Madurai': [
    { name: 'KK Nagar', type: 'Apartment', status: 'Ready to Occupy', price: '₹60 Lakhs' },
    { name: 'Anna Nagar', type: 'Duplex Houses', status: 'Completed', price: '₹75 Lakhs' },
    { name: 'Othakadai', type: 'Villa', status: 'Under Construction', price: '₹1.05 Crores' }
  ],
  'Salem': [
    { name: 'Gugai', type: 'Apartments', status: 'Ready to Occupy', price: '₹45 Lakhs' },
    { name: 'Fairlands', type: 'Duplex Houses', status: 'Completed', price: '₹60 Lakhs' },
    { name: 'Suramangalam', type: 'Villa', status: 'Under Construction', price: '₹75 Lakhs' }
  ],
  'Virudhunagar': [
    { name: 'Sivakasi', type: 'Apartments', status: 'Ready to Occupy', price: '₹55 Lakhs' },
    { name: 'Aruppukkottai', type: 'Duplex Houses', status: 'Completed', price: '₹70 Lakhs' },
    { name: 'Rajapalayam', type: 'Villa', status: 'Under Construction', price: '₹90 Lakhs' }
  ],
  'Thanjavur': [
    { name: 'Kumbakonam', type: 'Apartments', status: 'Ready to Occupy', price: '₹50 Lakhs' },
    { name: 'Papanasam', type: 'Duplex Houses', status: 'Completed', price: '₹65 Lakhs' },
    { name: 'Thiruvaiyaru', type: 'Villa', status: 'Under Construction', price: '₹85 Lakhs' }
  ],
  'Kanyakumari': [
    { name: 'Nagercoil', type: 'Apartments', status: 'Ready to Occupy', price: '₹65 Lakhs' },
    { name: 'Marthandam', type: 'Duplex Houses', status: 'Completed', price: '₹80 Lakhs' },
    { name: 'Kuzhithurai', type: 'Villa', status: 'Under Construction', price: '₹1.1 Crores' }
  ],
  'Thoothukudi': [
    { name: 'Tiruchendur', type: 'Apartments', status: 'Ready to Occupy', price: '₹60 Lakhs' },
    { name: 'Sathankulam', type: 'Duplex Houses', status: 'Completed', price: '₹75 Lakhs' },
    { name: 'Ottapidaram', type: 'Villa', status: 'Under Construction', price: '₹95 Lakhs' }
  ]
};

function openModal(city) {
  const modal = document.getElementById('locationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocations = document.getElementById('modalLocations');

  const locations = locationDetails[city] || [];

  modalTitle.textContent = `${city} Projects - Location Details`;
  modalLocations.innerHTML = '';

  if (city === 'Chennai') {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'modal-cards';

    const imageMap = {
      'T. Nagar': 'T.Nagar.jpg',
      'Pallavaram': 'Pallavaram.jpg',
      'Anna Nagar': 'Anna Nagar.jpg'
    };

    locations.forEach(location => {
      const card = document.createElement('div');
      card.className = 'modal-card';
      card.innerHTML = `
        <img src="${imageMap[location.name] || 'chennai.jpg'}" alt="${location.name}">
        <div class="modal-card-body">
          <h4>${location.name} – ${location.type}</h4>
          <p><strong>Status:</strong> ${location.status}</p>
          <p><strong>Price:</strong> <span style="color:#e63946; font-weight:bold;">${location.price}</span></p>
        </div>
      `;
      cardsContainer.appendChild(card);
    });

    modalLocations.appendChild(cardsContainer);
  } else {
    const ul = document.createElement('ul');
    ul.className = 'modal-locations';

    locations.forEach(location => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h4>${location.name} – ${location.type}</h4>
        <p><strong>Status:</strong> ${location.status}</p>
        <p><strong>Price:</strong> <span style="color:#e63946; font-weight:bold;">${location.price}</span></p>
      `;
      ul.appendChild(li);
    });

    modalLocations.appendChild(ul);
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('locationModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.getElementById('locationModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

const cityCards = document.querySelectorAll('.city-card');

cityCards.forEach(card => {
  const img = card.querySelector('img');
  if (img) {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      const city = card.getAttribute('data-city');
      openModal(city);
    });
  }
});

// Special handling for Thendral Celestia image click
const thendralCelestiaCard = document.querySelector('.card[data-city="Chennai"]');
if (thendralCelestiaCard) {
  const img = thendralCelestiaCard.querySelector('img');
  if (img) {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      openModal('Chennai');
    });
  }
}

// Search functionality
function searchProjects() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.city-card');
  let foundCount = 0;

  if (searchValue === '') {
    cards.forEach(card => card.style.display = 'block');
    return;
  }

  cards.forEach(card => {
    const city = card.getAttribute('data-city').toLowerCase();
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();

    if (city.includes(searchValue) || title.includes(searchValue) || description.includes(searchValue)) {
      card.style.display = 'block';
      foundCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (foundCount === 0) {
    alert('No projects found matching your search.');
  }

  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

// Allow Enter key to search
document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchProjects();
  }
});

// View all projects
function viewAllProjects() {
  const cards = document.querySelectorAll('.city-card');
  cards.forEach(card => card.style.display = 'block');
  document.getElementById('searchInput').value = '';
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

// Enquiry modal functions
function openEnquiryModal(projectName) {
  document.getElementById('enquiryProjectName').textContent = projectName;
  document.getElementById('enquiryModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  document.getElementById('enquiryModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal on outside click
document.getElementById('enquiryModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeEnquiryModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('enquiryModal').classList.contains('active')) {
    closeEnquiryModal();
  }
});

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
    // Admin stays on properties page, add admin dashboard link
    const nav = document.querySelector('nav');
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'ADMIN DASHBOARD';
    adminLink.style.color = '#ffd166';
    adminLink.style.fontWeight = 'bold';
    nav.appendChild(adminLink);
  } else {
    // Allow non-logged-in users to stay on the home page, redirect others to login
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = 'login.html';
    }
  }
};
