// Function to get location details - reads from admin portal if available
function getLocationDetails() {
  const adminData = localStorage.getItem('locationDetails');
  if (adminData) {
    try {
      return JSON.parse(adminData);
    } catch (e) {
      console.error('Error parsing admin data:', e);
      return getDefaultLocationDetails();
    }
  }
  return getDefaultLocationDetails();
}

// Default location details
function getDefaultLocationDetails() {
  return {
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
}

// Get the location details (from admin or default)
const locationDetails = getLocationDetails();


function openModal(city) {
  const modal = document.getElementById('locationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocations = document.getElementById('modalLocations');

  const locations = locationDetails[city] || [];

  modalTitle.textContent = `${city} Projects - Location Details`;
  modalLocations.innerHTML = '';

  // Image mapping for all cities
  const imageMap = {
    'Chennai': {
      'T. Nagar': 'T.Nagar.jpg',
      'Pallavaram': 'Pallavaram.jpg',
      'Anna Nagar': 'Anna Nagar.jpg'
    },
    'Coimbatore': {
      'RS Puram': 'RS Puram.jpg',
      'Peelamedu': 'Peelamedu.jpg',
      'Saravanampatti': 'Saravanampatti.jpg'
    },
    'Trichy': {
      'Samayapuram': 'Samayapuram.jpg',
      'Melur': 'Melur.jpg',
      'Srirangam': 'Srirangam.jpg'
    },
    'Tirunelveli': {
      'Palayamkottai': 'Palayamkottai.jpg',
      'Vannarapettai': 'Vannarapettai.jpg',
      'Melapalayam': 'Melapalayam.jpg'
    },
    'Madurai': {
      'KK Nagar': 'KK Nagar.jpg',
      'Anna Nagar': 'anna nagar(m).jpg',
      'Othakadai': 'Othakadai.jpg'
    },
    'Salem': {
      'Gugai': 'Gugai.jpg',
      'Fairlands': 'Fairlands.jpg',
      'Suramangalam': 'Suramangalam.jpg'
    },
    'Virudhunagar': {
      'Sivakasi': 'Sivakasi.jpg',
      'Aruppukkottai': 'Aruppukkottai.jpg',
      'Rajapalayam': 'Rajapalayam.jpg'
    },
    'Thanjavur': {
      'Kumbakonam': 'Kumbakonam.jpg',
      'Papanasam': 'Papanasam.jpg',
      'Thiruvaiyaru': 'Thiruvaiyaru.jpg'
    },
    'Kanyakumari': {
      'Nagercoil': 'Nagercoil.jpg',
      'Marthandam': 'Marthandam.jpg',
      'Kuzhithurai': 'Kuzhithurai.jpg'
    },
    'Thoothukudi': {
      'Tiruchendur': 'Tiruchendur.jpg',
      'Sathankulam': 'Sathankulam.jpg',
      'Ottapidaram': 'Ottapidaram.jpg'
    }
  };

  // Create cards container with images for all cities
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'modal-cards';

  locations.forEach(location => {
    const card = document.createElement('div');
    card.className = 'modal-card';

    // Get the image for this location
    // 1. Check if property object has a custom image from admin
    // 2. Fallback to the imageMap
    // 3. Fallback to city-based default image
    const imageSrc = location.image || (imageMap[city] && imageMap[city][location.name]) || city.toLowerCase() + '.jpg';

    card.innerHTML = `
      <img src="${imageSrc}" alt="${location.name}">
      <div class="modal-card-body">
        <h4>${location.name} – ${location.type}</h4>
        <p><strong>Status:</strong> ${location.status}</p>
        <p><strong>Price:</strong> <span style="color:#e63946; font-weight:bold;">${location.price}</span></p>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  modalLocations.appendChild(cardsContainer);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('locationModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.getElementById('locationModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

const cityCards = document.querySelectorAll('.city-card');

cityCards.forEach(card => {
  const img = card.querySelector('img');
  if (img) {
    img.addEventListener('click', function (e) {
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
    img.addEventListener('click', function (e) {
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
document.getElementById('searchInput').addEventListener('keypress', function (e) {
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
document.getElementById('enquiryModal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeEnquiryModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && document.getElementById('enquiryModal').classList.contains('active')) {
    closeEnquiryModal();
  }
});

// Handle enquiry form submission
const enquiryForm = document.querySelector('.enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const projectName = document.getElementById('enquiryProjectName').textContent;

    // In a production environment, you would send this data to a backend API
    // For now, we'll show a success message
    const successMsg = document.getElementById('enquiry-success-message');
    const submitBtn = this.querySelector('button[type="submit"]');

    if (successMsg) {
      successMsg.style.display = 'block';
      if (submitBtn) submitBtn.style.display = 'none';

      // Reset form and close modal after a delay
      setTimeout(() => {
        this.reset();
        successMsg.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'block';
        closeEnquiryModal();
      }, 3000);
    } else {
      alert(`Thank you for your enquiry about ${projectName}! Our team will contact you shortly.`);
      this.reset();
      closeEnquiryModal();
    }

    // Optional: Log to console (for development/testing)
    console.log('Enquiry submitted for:', projectName);
    console.log('Form data:', Object.fromEntries(formData));
  });
}
