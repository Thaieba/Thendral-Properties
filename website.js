// Website Synchronization Script
// Syncs data from Admin Portal (localStorage) to the main website

document.addEventListener('DOMContentLoaded', function () {
    syncWebsiteContent();
    syncSettings();
    setupAdminShortcut();
});

function syncWebsiteContent() {
    const stored = localStorage.getItem('thendral_website_content');
    if (!stored) return;

    try {
        const content = JSON.parse(stored);

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
