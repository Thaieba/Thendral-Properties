// Admin Dashboard JavaScript
// Property Management System

// Check authentication on page load
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
    loadProperties();
    setupEventListeners();
});

// Initialize dashboard based on user role
function initializeDashboard() {
    const session = getSession();

    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Update user info
    document.getElementById('userName').textContent = session.name;
    document.getElementById('userRole').textContent = session.role === 'superadmin' ? 'Super Admin' : 'Admin';

    // Show/hide menu items based on role
    if (session.role === 'superadmin') {
        document.querySelectorAll('.superadmin-only').forEach(el => {
            el.style.display = 'flex';
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Property form submission
    document.getElementById('propertyForm').addEventListener('submit', handlePropertySubmit);
}

// Navigate to section
function navigateToSection(sectionId) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update page title and breadcrumb
    const titles = {
        'dashboard': 'Dashboard',
        'properties': 'Property Management',
        'website': 'Website Editor',
        'users': 'User Management',
        'settings': 'Settings'
    };

    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';
    document.getElementById('breadcrumb').textContent = `Home / ${titles[sectionId] || 'Dashboard'}`;

    // Refresh data if needed
    if (sectionId === 'properties') {
        loadProperties();
    } else if (sectionId === 'dashboard') {
        updateDashboardStats();
    }
}

// Property data management
const PROPERTY_STORAGE_KEY = 'thendral_properties_data';

// Get default property data
function getDefaultPropertyData() {
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

// Get property data from localStorage or default
function getPropertyData() {
    const stored = localStorage.getItem(PROPERTY_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored property data:', e);
            return getDefaultPropertyData();
        }
    }
    return getDefaultPropertyData();
}

// Save property data to localStorage
function savePropertyData(data) {
    localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(data));

    // Also update the properties.js data for the main website
    updateMainWebsiteData(data);
}

// Update main website data
function updateMainWebsiteData(data) {
    // Store in a separate key that properties.js can read
    localStorage.setItem('locationDetails', JSON.stringify(data));
}

// Load and display properties
function loadProperties() {
    const propertyData = getPropertyData();
    const tbody = document.getElementById('propertyTableBody');

    tbody.innerHTML = '';

    let totalProperties = 0;
    let readyCount = 0;
    let underConstructionCount = 0;

    // Flatten the data for table display
    Object.keys(propertyData).forEach(city => {
        propertyData[city].forEach((property, index) => {
            totalProperties++;
            if (property.status === 'Ready to Occupy') readyCount++;
            if (property.status === 'Under Construction') underConstructionCount++;

            const row = document.createElement('tr');
            row.innerHTML = `
        <td><strong>${city}</strong></td>
        <td>${property.name}</td>
        <td>${property.type}</td>
        <td><span style="color: ${getStatusColor(property.status)}; font-weight: 600;">${property.status}</span></td>
        <td><strong style="color: #e63946;">${property.price}</strong></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-edit" onclick="editProperty('${city}', ${index})" title="Edit">✏️</button>
            <button class="btn-icon btn-delete" onclick="deleteProperty('${city}', ${index})" title="Delete">🗑️</button>
          </div>
        </td>
      `;
            tbody.appendChild(row);
        });
    });

    // Update stats
    document.getElementById('totalCities').textContent = Object.keys(propertyData).length;
    document.getElementById('totalProperties').textContent = totalProperties;
    document.getElementById('readyProperties').textContent = readyCount;
    document.getElementById('underConstruction').textContent = underConstructionCount;
}

// Get status color
function getStatusColor(status) {
    switch (status) {
        case 'Ready to Occupy': return '#28a745';
        case 'Under Construction': return '#ffc107';
        case 'Completed': return '#17a2b8';
        default: return '#6c757d';
    }
}

// Update dashboard stats
function updateDashboardStats() {
    loadProperties();
}

// Refresh properties
function refreshProperties() {
    loadProperties();
    showAlert('Properties refreshed successfully!', 'success');
}

// Open add property modal
function openAddPropertyModal() {
    document.getElementById('modalTitle').textContent = 'Add New Property';
    document.getElementById('submitBtnText').textContent = 'Add Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('editCity').value = '';
    document.getElementById('editLocationIndex').value = '';
    document.getElementById('propertyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Edit property
function editProperty(city, index) {
    const propertyData = getPropertyData();
    const property = propertyData[city][index];

    document.getElementById('modalTitle').textContent = 'Edit Property';
    document.getElementById('submitBtnText').textContent = 'Update Property';

    document.getElementById('city').value = city;
    document.getElementById('locationName').value = property.name;
    document.getElementById('propertyType').value = property.type;
    document.getElementById('status').value = property.status;
    document.getElementById('price').value = property.price;

    document.getElementById('editCity').value = city;
    document.getElementById('editLocationIndex').value = index;

    document.getElementById('propertyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete property
function deleteProperty(city, index) {
    if (!confirm('Are you sure you want to delete this property?')) {
        return;
    }

    const propertyData = getPropertyData();
    const property = propertyData[city][index];

    propertyData[city].splice(index, 1);

    // Remove city if no properties left
    if (propertyData[city].length === 0) {
        delete propertyData[city];
    }

    savePropertyData(propertyData);
    loadProperties();
    showAlert(`Property "${property.name}" deleted successfully!`, 'success');
}

// Close property modal
function closePropertyModal() {
    document.getElementById('propertyModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle property form submission
function handlePropertySubmit(e) {
    e.preventDefault();

    const city = document.getElementById('city').value;
    const locationName = document.getElementById('locationName').value.trim();
    const propertyType = document.getElementById('propertyType').value;
    const status = document.getElementById('status').value;
    const price = document.getElementById('price').value.trim();

    const editCity = document.getElementById('editCity').value;
    const editLocationIndex = document.getElementById('editLocationIndex').value;

    const propertyData = getPropertyData();

    const newProperty = {
        name: locationName,
        type: propertyType,
        status: status,
        price: price
    };

    if (editCity && editLocationIndex !== '') {
        // Edit existing property
        const index = parseInt(editLocationIndex);

        // If city changed, remove from old city and add to new
        if (editCity !== city) {
            propertyData[editCity].splice(index, 1);
            if (propertyData[editCity].length === 0) {
                delete propertyData[editCity];
            }

            if (!propertyData[city]) {
                propertyData[city] = [];
            }
            propertyData[city].push(newProperty);
        } else {
            // Same city, just update
            propertyData[city][index] = newProperty;
        }

        showAlert('Property updated successfully!', 'success');
    } else {
        // Add new property
        if (!propertyData[city]) {
            propertyData[city] = [];
        }
        propertyData[city].push(newProperty);
        showAlert('Property added successfully!', 'success');
    }

    savePropertyData(propertyData);
    loadProperties();
    closePropertyModal();
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Close modal on outside click
document.getElementById('propertyModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closePropertyModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('propertyModal').classList.contains('active')) {
        closePropertyModal();
    }
});
