// Website Synchronization Script
// Syncs data from Admin Portal (localStorage) to the main website

document.addEventListener('DOMContentLoaded', function () {
    syncWebsiteContent();
    syncSettings();
});

function syncWebsiteContent() {
    const stored = localStorage.getItem('thendral_website_content');
    if (!stored) return;

    try {
        const content = JSON.parse(stored);

        // Update Page Title (if it's the home page or general title)
        if (content.siteTitle) {
            // Only update if it contains the brand name to avoid overwriting specific page titles
            if (document.title.includes('THENDRAL PROPERTIES')) {
                const pagePrefix = document.title.split('|')[0].trim();
                document.title = `${pagePrefix} | ${content.siteTitle}`;
            }
        }

        // Update Hero Section (index.html)
        const heroHeading = document.querySelector('.hero h2');
        const heroDesc = document.querySelector('.hero p');

        if (heroHeading && content.heroHeading) {
            heroHeading.textContent = content.heroHeading;
        }
        if (heroDesc && content.heroDescription) {
            heroDesc.textContent = content.heroDescription;
        }

        // Update Tagline in Header
        const headerTaglines = document.querySelectorAll('.header-tagline');
        headerTaglines.forEach(tagline => {
            if (content.siteTagline) {
                tagline.textContent = content.siteTagline;
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
