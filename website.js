// Website Synchronization Script
// Syncs data from Admin Portal (localStorage) to the main website

document.addEventListener('DOMContentLoaded', function () {
    syncWebsiteContent();
    syncSettings();
    setupAdminShortcut();
    setupCallFloatingButton();
});

function syncWebsiteContent() {
    const stored = localStorage.getItem('thendral_website_content');
    if (!stored) return;

    try {
        const content = JSON.parse(stored);

        // Migration: Update Copyright Year from 2024 to 2026
        if (content.footerCopyright && content.footerCopyright.includes('2024')) {
            content.footerCopyright = content.footerCopyright.replace(/2024/g, '2026');
            localStorage.setItem('thendral_website_content', JSON.stringify(content));
            console.log('Migrated copyright year to 2026');
        }

        // Update Page Title
        if (content.siteTitle) {
            if (document.title.includes('THENDRAL PROPERTIES')) {
                const pagePrefix = document.title.split('|')[0].trim();
                document.title = `${pagePrefix} | ${content.siteTitle}`;
            }
        }

        // Update Tagline in Header
        const headerTaglines = document.querySelectorAll('.header-tagline');
        headerTaglines.forEach(tagline => {
            if (content.siteTagline) tagline.textContent = content.siteTagline;
        });

        // 1. Update Hero Section (index.html)
        const heroHeading = document.querySelector('.hero h2');
        const heroDesc = document.querySelector('.hero p');
        if (heroHeading && content.heroHeading) heroHeading.textContent = content.heroHeading;
        if (heroDesc && content.heroDescription) heroDesc.textContent = content.heroDescription;

        // 2. Update Why Choose Us (index.html)
        const wcuTitle = document.getElementById('wcu-title');
        if (wcuTitle && content.whyChooseUsTitle) wcuTitle.textContent = content.whyChooseUsTitle;

        const wcuContainer = document.getElementById('wcu-badges-container');
        if (wcuContainer && content.whyChooseUs) {
            wcuContainer.innerHTML = '';
            content.whyChooseUs.forEach(badge => {
                const div = document.createElement('div');
                div.className = 'trust-badge';
                div.innerHTML = `
                    <span class="trust-badge-icon">${badge.icon}</span>
                    <div class="animated-number" data-target="${badge.target}">0</div>
                    <span class="number-suffix">${badge.suffix}</span>
                    <h3>${badge.title}</h3>
                    <p>${badge.desc}</p>
                `;
                wcuContainer.appendChild(div);
            });
            // Re-trigger numbers animation if defined in index.html
            if (typeof animateNumbers === 'function') animateNumbers();
        }

        // 3. Update About Us Page Content (about.html)
        const aboutTitle = document.getElementById('about-title');
        const aboutTrustTitle = document.getElementById('about-trust-title');
        if (aboutTitle && content.aboutContent?.title) aboutTitle.textContent = content.aboutContent.title;
        if (aboutTrustTitle && content.aboutContent?.trustTitle) aboutTrustTitle.textContent = content.aboutContent.trustTitle;

        const aboutMainText = document.getElementById('about-main-text');
        if (aboutMainText && content.aboutContent?.mainText) {
            aboutMainText.innerHTML = content.aboutContent.mainText.replace(/\n/g, '<br>');
        }
        const aboutTrustContainer = document.getElementById('about-trust-container');
        if (aboutTrustContainer && content.aboutContent?.trustBadges) {
            aboutTrustContainer.innerHTML = '';
            content.aboutContent.trustBadges.forEach(badge => {
                const div = document.createElement('div');
                div.className = 'trust-badge';
                div.innerHTML = `
                    <span class="trust-badge-icon">${badge.icon}</span>
                    <h3>${badge.title}</h3>
                    <p>${badge.desc}</p>
                `;
                aboutTrustContainer.appendChild(div);
            });
        }

        // 4. Update Contact Page & Footer
        const contactTitle = document.getElementById('contact-title');
        if (contactTitle && content.contactTitle) contactTitle.textContent = content.contactTitle;

        const citySelect = document.getElementById('contact-city-select');
        if (citySelect && content.contactCities) {
            // Keep the first "Select City" option if it exists
            const firstOption = citySelect.options[0]?.text === 'Select City' ? citySelect.options[0] : null;
            citySelect.innerHTML = '';
            if (firstOption) citySelect.appendChild(firstOption);

            content.contactCities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }

        const footerAddress = document.getElementById('footer-address');
        if (footerAddress && content.contactAddress) {
            footerAddress.innerHTML = content.contactAddress.replace(/\n/g, '<br>');
        }

        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright && content.footerCopyright) {
            footerCopyright.textContent = content.footerCopyright;
        }


        // 5. Update Quick Links (Footer - all pages)
        const qlContainers = document.querySelectorAll('#footer-quick-links');
        qlContainers.forEach(container => {
            if (content.quickLinks) {
                container.innerHTML = '';
                content.quickLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.label;
                    container.appendChild(a);
                });
            }
        });

    } catch (e) {
        console.error('Error syncing website content:', e);
    }
}

function syncSettings() {
    const stored = localStorage.getItem('thendral_admin_settings');
    if (!stored) return;

    try {
        const settings = JSON.parse(stored);

        // Update Footer and Contact Info
        const emailElements = document.querySelectorAll('p, a');
        const phoneElements = document.querySelectorAll('p, a');

        emailElements.forEach(el => {
            if (el.textContent.includes('info@thendralproperties.com') || (el.href && el.href.includes('mailto:info@thendralproperties.com'))) {
                if (el.tagName === 'A' && el.href.startsWith('mailto:')) {
                    el.href = `mailto:${settings.contactEmail}`;
                    el.textContent = settings.contactEmail;
                } else if (el.textContent.includes('✉️')) {
                    el.textContent = `✉️ ${settings.contactEmail}`;
                } else {
                    el.textContent = el.textContent.replace('info@thendralproperties.com', settings.contactEmail);
                }
            }
        });

        phoneElements.forEach(el => {
            // Match the default phone number pattern
            const defaultPhone = '+91 98765 43210';
            const cleanDefaultPhone = '919876543210';

            if (el.textContent.includes(defaultPhone) || (el.href && el.href.includes(cleanDefaultPhone))) {
                if (el.tagName === 'A' && el.href.startsWith('tel:')) {
                    const cleanPhone = settings.contactPhone.replace(/\s+/g, '').replace('+', '');
                    el.href = `tel:${cleanPhone}`;
                    // If it's a mobile bar or floating button, we might want to keep the icon
                    if (el.textContent === '📞') {
                        // keep as is
                    } else {
                        el.textContent = settings.contactPhone;
                    }
                } else if (el.textContent.includes('📞')) {
                    el.textContent = `📞 ${settings.contactPhone}`;
                } else {
                    el.textContent = el.textContent.replace(defaultPhone, settings.contactPhone);
                }
            }
        });

        // Update all mailto forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.action && form.action.includes('mailto:info@thendralproperties.com')) {
                form.action = `mailto:${settings.contactEmail}`;
            }
        });

    } catch (e) {
        console.error('Error syncing settings:', e);
    }
}

function setupAdminShortcut() {
    const siteTitle = document.querySelector('.logo-container h1') || document.querySelector('.logo-container h1 a');
    if (siteTitle) {
        siteTitle.addEventListener('dblclick', function () {
            window.location.href = 'admin-login.html';
        });
        siteTitle.style.cursor = 'pointer';
    }
}

function setupCallFloatingButton() {
    // 1. Get Settings
    const storedContent = localStorage.getItem('thendral_website_content');
    const storedSettings = localStorage.getItem('thendral_admin_settings');

    let websiteContent = {};
    let adminSettings = {};

    try {
        if (storedContent) websiteContent = JSON.parse(storedContent);
        if (storedSettings) adminSettings = JSON.parse(storedSettings);
    } catch (e) {
        console.error('Error parsing settings for floating button:', e);
    }

    const config = websiteContent.floatingButton || {
        enabled: true,
        whatsappNumber: adminSettings.contactPhone || '919876543210',
        callNumber: adminSettings.contactPhone || '+91 98765 43210'
    };

    if (config.enabled === false) return;

    // 2. Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .floating-call-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 15px;
            font-family: Arial, sans-serif;
        }

        .call-options {
            display: none;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 5px;
            transition: all 0.3s ease;
            transform: translateY(10px);
            opacity: 0;
        }

        .call-options.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
        }

        .call-option-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            border-radius: 30px;
            text-decoration: none;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
            white-space: nowrap;
        }

        .call-option-btn:hover {
            transform: scale(1.05);
        }

        .whatsapp-btn { background-color: #25D366; }
        .phone-btn { background-color: #007bff; }

        .main-call-btn {
            width: 65px;
            height: 65px;
            background: linear-gradient(135deg, #f77f00, #fcbf49);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(247, 127, 0, 0.4);
            transition: all 0.3s ease;
            border: none;
        }

        .main-call-btn:hover {
            transform: rotate(15deg) scale(1.1);
        }

        .main-call-btn.active {
            background: #e63946;
            transform: rotate(45deg);
        }

        @media (max-width: 768px) {
            .floating-call-container {
                bottom: 85px; /* Stay above the mobile enquire bar if it exists */
                right: 20px;
            }
            .main-call-btn {
                width: 55px;
                height: 55px;
                font-size: 24px;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. Inject HTML
    const container = document.createElement('div');
    container.className = 'floating-call-container';

    // Clean numbers for links
    let whatsappNum = config.whatsappNumber || adminSettings.contactPhone || '919876543210';
    let callNum = config.callNumber || adminSettings.contactPhone || '+91 98765 43210';

    const cleanWhatsapp = whatsappNum.replace(/\s+/g, '').replace('+', '');
    const cleanPhone = callNum.replace(/\s+/g, '').replace('+', '');

    container.innerHTML = `
        <div class="call-options" id="callOptions">
            <a href="https://wa.me/${cleanWhatsapp}" class="call-option-btn whatsapp-btn" target="_blank">
                <span>💬</span> WhatsApp Message
            </a>
            <a href="tel:${cleanPhone}" class="call-option-btn phone-btn">
                <span>📞</span> Call Us Now
            </a>
        </div>
        <button class="main-call-btn" id="mainCallBtn" title="Call Us">
            <span>📞</span>
        </button>
    `;
    document.body.appendChild(container);

    // 4. Add Event Listeners
    const mainBtn = document.getElementById('mainCallBtn');
    const options = document.getElementById('callOptions');

    mainBtn.addEventListener('click', () => {
        const isActive = options.classList.toggle('active');
        mainBtn.classList.toggle('active');
        mainBtn.querySelector('span').textContent = isActive ? '×' : '📞';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && options.classList.contains('active')) {
            options.classList.remove('active');
            mainBtn.classList.remove('active');
            mainBtn.querySelector('span').textContent = '+';
        }
    });
}

// Handle generic form submissions for enquiry forms
document.addEventListener('submit', function (e) {
    const form = e.target;
    // Check if it's an enquiry form (exists on index or contact)
    if (form.closest('.enquiry') || form.querySelector('button[type="submit"]')) {
        // Prevent default only if we want to bypass mailto for the success message demo
        // For mailto forms, the browser usually opens the mail client. 
        // We'll show the success message regardless.

        const successMessage = form.querySelector('#success-message');
        if (successMessage) {
            e.preventDefault(); // Bypass mailto for better UX as requested

            successMessage.style.display = 'block';
            form.querySelector('button[type="submit"]').style.display = 'none';

            // Log for debugging
            console.log('Form submitted successfully');

            // Optional: Reset form after delay
            setTimeout(() => {
                form.reset();
                // We keep the message visible or could hide it and show button again
            }, 3000);
        }
    }
});
