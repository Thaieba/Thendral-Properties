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
    loadUsers();
    loadSettings();
    loadWebsiteContent();
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
    const session = getSession();
    const superAdminSections = ['website', 'users', 'settings'];

    // Security check: regular admins cannot access superadmin sections
    if (session && session.role !== 'superadmin' && superAdminSections.includes(sectionId)) {
        console.warn(`Unauthorized access attempt to ${sectionId} by ${session.role}`);
        navigateToSection('dashboard');
        return;
    }

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
    } else if (sectionId === 'users') {
        loadUsers();
    } else if (sectionId === 'settings') {
        loadSettings();
    } else if (sectionId === 'website') {
        loadWebsiteContent();
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

    // Reset image preview
    const imageInput = document.getElementById('propertyImage');
    if (imageInput) imageInput.value = '';
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) previewContainer.style.display = 'none';
    const previewImg = document.getElementById('imagePreview');
    if (previewImg) previewImg.src = '';

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

    // Handle image field
    const imageInput = document.getElementById('propertyImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (property.image) {
        if (imageInput) imageInput.value = property.image;
        if (imagePreview) imagePreview.src = property.image;
        if (previewContainer) previewContainer.style.display = 'block';
    } else {
        if (imageInput) imageInput.value = '';
        if (imagePreview) imagePreview.src = '';
        if (previewContainer) previewContainer.style.display = 'none';
    }

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
    const image = document.getElementById('propertyImage').value.trim();

    const editCity = document.getElementById('editCity').value;
    const editLocationIndex = document.getElementById('editLocationIndex').value;

    const propertyData = getPropertyData();

    const newProperty = {
        name: locationName,
        type: propertyType,
        status: status,
        price: price
    };

    if (image) {
        newProperty.image = image;
    }

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
    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Remove property image
function removePropertyImage() {
    const imageInput = document.getElementById('propertyImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (imageInput) imageInput.value = '';
    if (imagePreview) imagePreview.src = '';
    if (previewContainer) previewContainer.style.display = 'none';
}

// Setup real-time image preview
document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('propertyImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (imageInput && imagePreview && previewContainer) {
        imageInput.addEventListener('input', function () {
            const url = this.value.trim();
            if (url) {
                imagePreview.src = url;
                previewContainer.style.display = 'block';
            } else {
                imagePreview.src = '';
                previewContainer.style.display = 'none';
            }
        });

        // Handle error (invalid image)
        imagePreview.addEventListener('error', function () {
            previewContainer.style.display = 'none';
        });
    }
});

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
    if (e.key === 'Escape' && document.getElementById('userModal') && document.getElementById('userModal').classList.contains('active')) {
        closeUserModal();
    }
});

// ===========================
// USER MANAGEMENT FUNCTIONS
// ===========================

const USER_STORAGE_KEY = 'thendral_admin_users';

// Get default user data
function getDefaultUserData() {
    return [
        { username: 'superadmin', name: 'Super Administrator', role: 'superadmin', status: 'Active', password: 'super123' },
        { username: 'admin', name: 'Administrator', role: 'admin', status: 'Active', password: 'admin123' }
    ];
}

// Get user data from localStorage or default
function getUserData() {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored user data:', e);
            return getDefaultUserData();
        }
    }
    return getDefaultUserData();
}

// Save user data to localStorage
function saveUserData(data) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
}

// Load and display users
function loadUsers() {
    const userData = getUserData();
    const tbody = document.getElementById('userTableBody');

    if (!tbody) return; // Exit if user section doesn't exist

    tbody.innerHTML = '';

    userData.forEach((user, index) => {
        const row = document.createElement('tr');
        const roleColor = user.role === 'superadmin' ? '#e63946' : '#1b9c85';
        const statusColor = user.status === 'Active' ? '#28a745' : '#dc3545';

        // Super admin can't be deleted
        const deleteButton = user.role === 'superadmin'
            ? ''
            : `<button class="btn-icon btn-delete" onclick="deleteUser(${index})" title="Delete">🗑️</button>`;

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td><span style="color: ${roleColor}; font-weight: bold;">${user.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span></td>
            <td><span style="color: ${statusColor};">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${index})" title="Edit">✏️</button>
                    ${deleteButton}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add user modal
function openAddUserModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('userModal')) {
        createUserModal();
    }

    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userSubmitBtnText').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('editUserIndex').value = '';
    document.getElementById('userPasswordGroup').style.display = 'block';
    document.getElementById('userModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Edit user
function editUser(index) {
    const userData = getUserData();
    const user = userData[index];

    // Create modal if it doesn't exist
    if (!document.getElementById('userModal')) {
        createUserModal();
    }

    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userSubmitBtnText').textContent = 'Update User';

    document.getElementById('username').value = user.username;
    document.getElementById('fullName').value = user.name;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;

    // Hide password field when editing (optional: can be shown to change password)
    document.getElementById('userPasswordGroup').style.display = 'none';

    document.getElementById('editUserIndex').value = index;

    document.getElementById('userModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete user
function deleteUser(index) {
    const userData = getUserData();
    const user = userData[index];

    // Prevent deleting super admin
    if (user.role === 'superadmin') {
        showAlert('Cannot delete Super Administrator!', 'error');
        return;
    }

    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
        return;
    }

    userData.splice(index, 1);
    saveUserData(userData);
    loadUsers();
    showAlert(`User "${user.username}" deleted successfully!`, 'success');
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle user form submission
function handleUserSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const userRole = document.getElementById('userRole').value;
    const userStatus = document.getElementById('userStatus').value;
    const password = document.getElementById('userPassword').value;
    const editUserIndex = document.getElementById('editUserIndex').value;

    const userData = getUserData();

    if (editUserIndex !== '') {
        // Edit existing user
        const index = parseInt(editUserIndex);
        userData[index].username = username;
        userData[index].name = fullName;
        userData[index].role = userRole;
        userData[index].status = userStatus;

        // Update password if provided
        if (password) {
            userData[index].password = password;
        }

        showAlert('User updated successfully!', 'success');
    } else {
        // Add new user
        // Check if username already exists
        if (userData.some(u => u.username === username)) {
            showAlert('Username already exists!', 'error');
            return;
        }

        if (!password) {
            showAlert('Password is required for new users!', 'error');
            return;
        }

        const newUser = {
            username: username,
            name: fullName,
            role: userRole,
            status: userStatus,
            password: password
        };

        userData.push(newUser);
        showAlert('User added successfully!', 'success');
    }

    saveUserData(userData);
    loadUsers();
    closeUserModal();
}

// Create user modal dynamically
function createUserModal() {
    const modalHTML = `
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="userModalTitle">Add New User</h2>
                <button class="modal-close" onclick="closeUserModal()">×</button>
            </div>

            <form id="userForm" onsubmit="handleUserSubmit(event)">
                <input type="hidden" id="editUserIndex" />

                <div class="form-group">
                    <label for="username">Username *</label>
                    <input type="text" id="username" required placeholder="e.g., john.doe" />
                </div>

                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input type="text" id="fullName" required placeholder="e.g., John Doe" />
                </div>

                <div class="form-group">
                    <label for="userRole">Role *</label>
                    <select id="userRole" required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="userStatus">Status *</label>
                    <select id="userStatus" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div class="form-group" id="userPasswordGroup">
                    <label for="userPassword">Password *</label>
                    <input type="password" id="userPassword" placeholder="Enter password" />
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeUserModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <span id="userSubmitBtnText">Add User</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close modal on outside click
    document.getElementById('userModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeUserModal();
        }
    });
}

// ===========================
// SETTINGS FUNCTIONS
// ===========================

const SETTINGS_STORAGE_KEY = 'thendral_admin_settings';

// Get default settings
function getDefaultSettings() {
    return {
        contactEmail: 'info@thendralproperties.com',
        contactPhone: '+91 98765 43210',
        sessionTimeout: '60'
    };
}

// Load settings from localStorage or default
function loadSettings() {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    let settings = getDefaultSettings();

    if (stored) {
        try {
            settings = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored settings:', e);
        }
    }

    // Update UI
    const emailElem = document.getElementById('contactEmail');
    const phoneElem = document.getElementById('contactPhone');
    const timeoutElem = document.getElementById('sessionTimeout');

    if (emailElem) emailElem.value = settings.contactEmail;
    if (phoneElem) phoneElem.value = settings.contactPhone;
    if (timeoutElem) timeoutElem.value = settings.sessionTimeout;
}

// Save settings to localStorage
function saveSettings() {
    const contactEmail = document.getElementById('contactEmail').value.trim();
    const contactPhone = document.getElementById('contactPhone').value.trim();
    const sessionTimeout = document.getElementById('sessionTimeout').value.trim();

    if (!contactEmail || !contactPhone || !sessionTimeout) {
        showAlert('Please fill in all fields!', 'error');
        return;
    }

    const settings = {
        contactEmail,
        contactPhone,
        sessionTimeout
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    showAlert('Settings saved successfully!', 'success');
}

// ===========================
// WEBSITE EDITOR FUNCTIONS
// ===========================

const WEBSITE_STORAGE_KEY = 'thendral_website_content';

// Get default website content
function getDefaultWebsiteContent() {
    return {
        siteTitle: 'THENDRAL PROPERTIES | REAL ESTATE IN TAMILNADU',
        siteTagline: 'Trust Meets Living',
        heroHeading: 'Where Trust Meets Timeless Living',
        heroDescription: "Premium apartments, villas & plots in Tamil Nadu's most desirable locations.",
        whyChooseUsTitle: 'Why Choose Us',
        whyChooseUs: [
            { icon: '🏆', target: '500', suffix: '+ Projects', title: 'Premium Projects', desc: 'Delivering excellence across Tamil Nadu with our carefully curated selection of properties.' },
            { icon: '👥', target: '10000', suffix: '+ Families', title: 'Happy Families', desc: 'Trusted by thousands of families who have made Thendral their home.' },
            { icon: '⭐', target: '15', suffix: '+ Years', title: 'Industry Experience', desc: 'Over a decade of excellence in real estate and customer satisfaction.' },
            { icon: '🌟', target: '98', suffix: '%', title: 'Client Satisfaction', desc: 'Maintaining the highest standards of service and customer care.' }
        ],
        aboutContent: {
            title: 'ABOUT THENDRAL PROPERTIES',
            trustTitle: 'WHY TRUST THENDRAL PROPERTIES',
            mainText: "Founded in 2010, Thendral Properties is a leading real estate developer based out of Chennai. We offer a wide range of properties, from apartments to independent villas, all equipped with lifestyle amenities. Our projects cover luxury, mid-range, and affordable categories, meeting the needs of different customers.\n\nBeyond Chennai, we've expanded into other major cities like Coimbatore, Trichy, Madurai, Tirunelveli, Salem, Virudhunagar, Thanjavur, Kanyakumari, and Thoothukudi. We focus on delivering quality homes with committed completion timelines.\n\nOur emphasis on research and delivery of a seamless living experience over the last decade ensures customer satisfaction. We have also launched ventures in commercial real estate and industrial projects.",
            trustBadges: [
                { icon: '🏆', title: 'Award Winning', desc: 'Recognized by industry leaders for excellence in real estate development and customer service' },
                { icon: '🔐', title: '100% Transparent', desc: 'Complete clarity in pricing, legal documentation, and project timelines for your peace of mind' },
                { icon: '⚡', title: 'On-Time Delivery', desc: '15+ years of commitment to delivering projects on schedule with premium quality standards' },
                { icon: '👥', title: '5000+ Happy Customers', desc: 'Trusted by thousands of families across Tamil Nadu for their dream homes' }
            ]
        },
        contactTitle: 'ENQUIRE NOW',
        contactCities: ['Chennai', 'Coimbatore', 'Trichy', 'Tirunelveli', 'Madurai', 'Salem', 'Virudhunagar', 'Thanjavur', 'Kanyakumari', 'Thoothukudi'],
        contactAddress: 'No. 123, Real Estate Tower,\nAnna Salai, Chennai - 600002,\nTamil Nadu, India.',
        footerCopyright: '© 2024 THENDRAL PROPERTIES. All Rights Reserved. | Designed with ❤️ for Tamil Nadu',
        quickLinks: [
            { label: 'Properties', url: 'properties.html' },
            { label: 'About Us', url: 'about.html' },
            { label: 'Contact', url: 'contact.html' }
        ],
        floatingButton: {
            enabled: true,
            whatsappNumber: '919876543210',
            callNumber: '+91 98765 43210'
        }
    };
}

// Load website content from localStorage or default
function loadWebsiteContent() {
    const stored = localStorage.getItem(WEBSITE_STORAGE_KEY);
    const defaults = getDefaultWebsiteContent();
    let content = defaults;

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Deep merge to ensure new fields (like Titles and Cities) are available even if storage is old
            content = {
                ...defaults,
                ...parsed,
                aboutContent: {
                    ...defaults.aboutContent,
                    ...(parsed.aboutContent || {})
                }
            };
        } catch (e) {
            console.error('Error parsing stored website content:', e);
        }
    }

    // Update UI General Site Info
    const titleElem = document.getElementById('siteTitle');
    const taglineElem = document.getElementById('siteTagline');
    const headingElem = document.getElementById('heroHeading');
    const descElem = document.getElementById('heroDescription');
    const whyChooseUsTitleElem = document.getElementById('whyChooseUsTitle');
    const aboutTitleElem = document.getElementById('aboutTitle');
    const aboutTrustTitleElem = document.getElementById('aboutTrustTitle');
    const aboutMainElem = document.getElementById('aboutMainText');
    const contactTitleElem = document.getElementById('contactTitle');
    const contactAddrElem = document.getElementById('contactAddress');
    const copyrightElem = document.getElementById('footerCopyright');

    if (titleElem) titleElem.value = content.siteTitle || '';
    if (taglineElem) taglineElem.value = content.siteTagline || '';
    if (headingElem) headingElem.value = content.heroHeading || '';
    if (descElem) descElem.value = content.heroDescription || '';
    if (whyChooseUsTitleElem) whyChooseUsTitleElem.value = content.whyChooseUsTitle || '';
    if (aboutTitleElem) aboutTitleElem.value = content.aboutContent?.title || '';
    if (aboutTrustTitleElem) aboutTrustTitleElem.value = content.aboutContent?.trustTitle || '';
    if (aboutMainElem) aboutMainElem.value = content.aboutContent?.mainText || '';
    if (contactTitleElem) contactTitleElem.value = content.contactTitle || '';
    if (contactAddrElem) contactAddrElem.value = content.contactAddress || '';
    if (copyrightElem) copyrightElem.value = content.footerCopyright || '';

    // Populate Why Choose Us
    const whyChooseUsContainer = document.getElementById('whyChooseUsContainer');
    if (whyChooseUsContainer && content.whyChooseUs) {
        whyChooseUsContainer.innerHTML = '';
        content.whyChooseUs.forEach((badge, index) => {
            const card = document.createElement('div');
            card.className = 'editor-card';
            card.innerHTML = `
                <h4>Badge ${index + 1}</h4>
                <div class="form-group"><label>Icon (Emoji)</label><input type="text" class="wcu-icon" value="${badge.icon}"></div>
                <div class="form-group"><label>Number</label><input type="text" class="wcu-target" value="${badge.target}"></div>
                <div class="form-group"><label>Suffix</label><input type="text" class="wcu-suffix" value="${badge.suffix}"></div>
                <div class="form-group"><label>Title</label><input type="text" class="wcu-title" value="${badge.title}"></div>
                <div class="form-group"><label>Description</label><textarea class="wcu-desc">${badge.desc}</textarea></div>
            `;
            whyChooseUsContainer.appendChild(card);
        });
    }

    // Populate About Us Trust Badges
    const aboutTrustContainer = document.getElementById('aboutTrustContainer');
    if (aboutTrustContainer && content.aboutContent?.trustBadges) {
        aboutTrustContainer.innerHTML = '';
        content.aboutContent.trustBadges.forEach((badge, index) => {
            const card = document.createElement('div');
            card.className = 'editor-card';
            card.innerHTML = `
                <h4>Trust Badge ${index + 1}</h4>
                <div class="form-group"><label>Icon (Emoji)</label><input type="text" class="atb-icon" value="${badge.icon}"></div>
                <div class="form-group"><label>Title</label><input type="text" class="atb-title" value="${badge.title}"></div>
                <div class="form-group"><label>Description</label><textarea class="atb-desc">${badge.desc}</textarea></div>
            `;
            aboutTrustContainer.appendChild(card);
        });
    }

    // Populate Quick Links
    const quickLinksContainer = document.getElementById('quickLinksContainer');
    if (quickLinksContainer) {
        quickLinksContainer.innerHTML = '';
        if (content.quickLinks) {
            content.quickLinks.forEach(link => {
                addQuickLinkField(link.label, link.url);
            });
        }
    }

    // Populate Contact Cities
    const contactCitiesContainer = document.getElementById('contactCitiesContainer');
    if (contactCitiesContainer) {
        contactCitiesContainer.innerHTML = '';
        if (content.contactCities) {
            content.contactCities.forEach(city => {
                addCityField(city);
            });
        }
    }

    // Populate Floating Button Settings
    const fbEnabledElem = document.getElementById('fbEnabled');
    const fbWhatsappElem = document.getElementById('fbWhatsapp');
    const fbCallElem = document.getElementById('fbCall');

    if (fbEnabledElem && content.floatingButton) {
        fbEnabledElem.value = content.floatingButton.enabled.toString();
        fbWhatsappElem.value = content.floatingButton.whatsappNumber || '';
        fbCallElem.value = content.floatingButton.callNumber || '';
    }
}

// Add City Field
function addCityField(cityName = '') {
    const container = document.getElementById('contactCitiesContainer');
    const div = document.createElement('div');
    div.className = 'link-item';
    div.innerHTML = `
        <input type="text" class="city-name" placeholder="City Name" value="${cityName}" style="flex: 1;">
        <button type="button" class="btn-icon btn-delete" onclick="this.parentElement.remove()">🗑️</button>
    `;
    container.appendChild(div);
}

// Add Quick Link Field
function addQuickLinkField(label = '', url = '') {
    const container = document.getElementById('quickLinksContainer');
    const div = document.createElement('div');
    div.className = 'link-item';
    div.innerHTML = `
        <input type="text" class="ql-label" placeholder="Label" value="${label}" style="flex: 1;">
        <input type="text" class="ql-url" placeholder="URL" value="${url}" style="flex: 1;">
        <button type="button" class="btn-icon btn-delete" onclick="this.parentElement.remove()">🗑️</button>
    `;
    container.appendChild(div);
}

// Save website content to localStorage
function saveWebsiteContent() {
    // Basic fields
    const siteTitle = document.getElementById('siteTitle').value.trim();
    const siteTagline = document.getElementById('siteTagline').value.trim();
    const heroHeading = document.getElementById('heroHeading').value.trim();
    const heroDescription = document.getElementById('heroDescription').value.trim();
    const whyChooseUsTitle = document.getElementById('whyChooseUsTitle').value.trim();
    const aboutTitle = document.getElementById('aboutTitle').value.trim();
    const aboutTrustTitle = document.getElementById('aboutTrustTitle').value.trim();
    const aboutMainText = document.getElementById('aboutMainText').value.trim();
    const contactTitle = document.getElementById('contactTitle').value.trim();
    const contactAddress = document.getElementById('contactAddress').value.trim();
    const footerCopyright = document.getElementById('footerCopyright').value.trim();

    if (!siteTitle || !siteTagline || !heroHeading) {
        showAlert('Please fill in essential fields!', 'error');
        return;
    }

    // Gater Why Choose Us
    const whyChooseUs = [];
    const wcuCards = document.querySelectorAll('#whyChooseUsContainer .editor-card');
    wcuCards.forEach(card => {
        whyChooseUs.push({
            icon: card.querySelector('.wcu-icon').value.trim(),
            target: card.querySelector('.wcu-target').value.trim(),
            suffix: card.querySelector('.wcu-suffix').value.trim(),
            title: card.querySelector('.wcu-title').value.trim(),
            desc: card.querySelector('.wcu-desc').value.trim()
        });
    });

    // Gather About Us Trust Badges
    const aboutTrustBadges = [];
    const atbCards = document.querySelectorAll('#aboutTrustContainer .editor-card');
    atbCards.forEach(card => {
        aboutTrustBadges.push({
            icon: card.querySelector('.atb-icon').value.trim(),
            title: card.querySelector('.atb-title').value.trim(),
            desc: card.querySelector('.atb-desc').value.trim()
        });
    });

    // Gather Contact Cities
    const contactCities = [];
    const cityItems = document.querySelectorAll('.city-name');
    cityItems.forEach(item => {
        const cityName = item.value.trim();
        if (cityName) contactCities.push(cityName);
    });

    // Gather Quick Links
    const quickLinks = [];
    const qlItems = document.querySelectorAll('.link-item');
    qlItems.forEach(item => {
        const labelElem = item.querySelector('.ql-label');
        if (labelElem) {
            const label = labelElem.value.trim();
            const url = item.querySelector('.ql-url').value.trim();
            if (label && url) {
                quickLinks.push({ label, url });
            }
        }
    });

    const content = {
        siteTitle,
        siteTagline,
        heroHeading,
        heroDescription,
        whyChooseUsTitle,
        whyChooseUs,
        aboutContent: {
            title: aboutTitle,
            trustTitle: aboutTrustTitle,
            mainText: aboutMainText,
            trustBadges: aboutTrustBadges
        },
        contactTitle,
        contactCities,
        contactAddress,
        footerCopyright,
        quickLinks
    };

    // Gather Floating Button Settings
    const fbEnabled = document.getElementById('fbEnabled').value === 'true';
    const fbWhatsapp = document.getElementById('fbWhatsapp').value.trim();
    const fbCall = document.getElementById('fbCall').value.trim();

    content.floatingButton = {
        enabled: fbEnabled,
        whatsappNumber: fbWhatsapp,
        callNumber: fbCall
    };

    localStorage.setItem(WEBSITE_STORAGE_KEY, JSON.stringify(content));
    showAlert('Website content updated successfully!', 'success');
}
