function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !image || !caption) return;

    image.src = src;
    image.alt = alt;
    caption.textContent = alt;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.style.display = 'none';
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    if (!answer || !toggle) return;

    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        toggle.textContent = '+';
        element.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('active');
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggle.textContent = '-';
        element.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeLightbox();
});

(function setupPageTransitions() {
    const main = document.querySelector('main');
    if (!main) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = main.querySelector(':scope > section') || main.querySelector(':scope > div') || main;
    target.classList.add('page-transition', 'page-transition-ready');
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            target.classList.remove('page-transition');
            target.classList.add('page-transition-in');
        });
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            target.classList.remove('page-transition-out');
            target.classList.add('page-transition-in');
        }
    });
})();

(function setupLanguageSwitch() {
    const KEY = 'pm_site_language';

    function getLang() {
        try {
            return localStorage.getItem(KEY) === 'en' ? 'en' : 'fr';
        } catch (error) {
            return 'fr';
        }
    }

    function setLang(lang) {
        try {
            localStorage.setItem(KEY, lang);
        } catch (error) {
            // ignore
        }
    }

    function pageKey() {
        const file = window.location.pathname.split('/').pop();
        return file || 'index.html';
    }

    function setText(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    }

    function setHtml(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = value;
    }

    function setList(selector, values) {
        document.querySelectorAll(selector).forEach(function (item, index) {
            if (values[index]) item.textContent = values[index];
        });
    }

    function setListHtml(selector, values) {
        document.querySelectorAll(selector).forEach(function (item, index) {
            if (values[index]) item.innerHTML = values[index];
        });
    }

    function setMeta(selector, content) {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', content);
    }

    function setNav(lang) {
        const labels = lang === 'en'
            ? ['Home', 'Our Team', 'Services & Pricing', 'Photos/Videos', 'FAQ', 'Contact']
            : ['Accueil', 'Notre équipe', 'Prestations & Tarifs', 'Photos/Vidéos', 'FAQ', 'Contact'];
        const links = [
            'index.html',
            'about.html',
            'services.html',
            'gallery.html',
            'faq.html',
            'contact.html'
        ];
        links.forEach(function (href, index) {
            const link = document.querySelector('header nav a[href="' + href + '"]');
            if (link) link.textContent = labels[index];
        });
    }

    function applyEnglish() {
        document.documentElement.lang = 'en';
        setNav('en');
        setText('footer p', '© 2025 Parapente Meribel. All rights reserved.');
        const closeBtn = document.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.setAttribute('aria-label', 'Close gallery');

        const key = pageKey();

        if (key === 'index.html') {
            document.title = 'Parapente Meribel - Tandem Flights & First Flights';
            setMeta('meta[name="description"]', 'Discover paragliding in Meribel with Stephane and Pierre, professional pilots. Tandem flights, prices, photos and bookings.');
            setMeta('meta[property="og:title"]', 'Parapente Meribel - Tandem Flights & First Flights');
            setMeta('meta[property="og:description"]', 'Discover paragliding in Meribel with Stephane and Pierre, professional pilots.');
            setHtml('.hero h1', 'Welcome to<br>Parapente Meribel Aero-dynamique');
            setText('.hero p', 'Take off now above Meribel!');
            setText('.hero .cta-btn', 'Book your flight');
            setText('.about h2', 'About us');
            setText('.about p', 'Passionate about paragliding and professional pilots for more than 35 years, Stephane and Pierre share their love of free flight in Meribel. Their promise: safety, thrills and unforgettable memories.');
            setText('.about .cta-link', 'Learn more about our team');
            setText('.why-us h2', 'Why choose Parapente Meribel?');
            setList('.why-us li', [
                '✔️ Certified and experienced pilots',
                '✔️ Safety and teaching first',
                '✔️ Flights for all levels',
                '✔️ Stunning views over the Alps and Meribel valley',
                '✔️ Warm and friendly atmosphere'
            ]);
            setText('.day-flow h2', 'Clear outline of your day');
            setList('.roadmap-step p', [
                'Meet at the Chaudanne roundabout',
                '4x4 ride to takeoff',
                'Equipment and briefing',
                'Tandem flight above the valley',
                'Landing at the initial meeting point'
            ]);
            setText('.home-offers h2', 'Our offers');
            setText('.offers-intro', 'Choose the experience that suits you and book your place in the sky.');
            setText('.home-offers .offer-card:nth-of-type(1) .offer-badge', 'Most popular');
            setText('.home-offers .offer-card:nth-of-type(1) h3', 'Discovery Flight');
            setText('.home-offers .offer-card:nth-of-type(1) p', 'An accessible first flight for everyone, ideal for an unforgettable first time above Meribel.');
            setList('.home-offers .offer-card:nth-of-type(1) .offer-points li', [
                'Every flight is unique',
                'Tour of Meribel valley',
                'Gentle and/or strong sensations'
            ]);
            setText('.home-offers .offer-card:nth-of-type(1) .price', 'From 140 EUR');
            setText('.home-offers .offer-card:nth-of-type(2) .offer-badge', 'Premium experience');
            setText('.home-offers .offer-card:nth-of-type(2) h3', 'Premium Flight');
            setText('.home-offers .offer-card:nth-of-type(2) p', 'A longer flight to visit several valleys and enjoy an exceptional alpine panorama.');
            setList('.home-offers .offer-card:nth-of-type(2) .offer-points li', [
                'Extended flight time',
                'Multi-valley scenic route',
                'A strong memory to offer or enjoy'
            ]);
            setText('.home-offers .offer-card:nth-of-type(2) .price', 'From 300 EUR');
            setText('.offers-reassurance', 'Limited slots depending on weather. Book in advance to secure your slot.');
            setText('.home-offers .cta-btn', 'See all prices and options');
            setText('.gallery-preview h2', 'In pictures: the Parapente Meribel experience');
            setText('.gallery-preview .cta-link', 'See all photos');
            setText('.cta-bottom h2', 'Ready for the adventure?');
            setText('.cta-bottom p', 'Contact us today to book your flight or ask your questions. We are here to support you in this unforgettable experience in Meribel!');
            setText('.cta-bottom .cta-btn', 'Book your flight now');
        }

        if (key === 'about.html') {
            document.title = 'Our Team - Parapente Meribel';
            setMeta('meta[name="description"]', 'Meet the Parapente Meribel team: Stephane and Pierre, professional pilots passionate about free flight in Meribel.');
            setText('.about h1', 'Our Team');
            setHtml('.about > p', 'At <strong>Parapente Meribel</strong>, you are in good hands.<br>Meet the people behind your unforgettable flights.');
            setText('.team-member:nth-of-type(1) p', 'State-certified pilot, passionate about paragliding for over 35 years. Stephane loves sharing his passion and helping everyone discover the magic of free flight.');
            setText('.team-member:nth-of-type(2) p', 'Professional pilot, reassuring and educational, Pierre guides you for a first flight or a thrill flight, in a warm and friendly atmosphere.');
            setText('.about .cta-link', 'Contact us to learn more');
        }

        if (key === 'services.html') {
            document.title = 'Services & Pricing - Parapente Meribel';
            setText('.services-preview h1', 'Services & Pricing');
            setHtml('.services-preview > p', 'Our flight packages vary by season and your preferences.<br>All flights are supervised by state-certified pilots, safety equipment is provided and transport to takeoff is included.');
            setText('.service-discovery .service-tag', 'Most requested');
            setText('.service-discovery h2', 'Discovery Flight');
            setText('.service-discovery .service-hook', 'The perfect offer for an unforgettable first flight.');
            setList('.service-discovery .service-benefits li', [
                'At least 30 minutes of flight',
                'Time slot of your choice: morning or afternoon',
                'Transport and safety equipment included'
            ]);
            setText('.service-discovery summary', 'Learn more');
            setList('.service-discovery details p', [
                'In-flight GoPro videos: not included',
                'Accessible from 30kg, no experience required',
                'Gondola/chairlift ascent included (deduction if you already have a lift pass). Landing at La Chaudanne.'
            ]);
            setText('.service-premium .service-tag', 'Premium experience');
            setText('.service-premium h2', 'Premium Flight');
            setText('.service-premium .service-hook', 'Visit Meribel and nearby areas');
            setList('.service-premium .service-benefits li', [
                'Flight over several valleys',
                'All included: videos, equipment and transport',
                'Route adapted to best conditions of the day'
            ]);
            setText('.service-premium .service-price', '300 EUR / flight');
            setText('.service-premium summary', 'Learn more');
            setList('.service-premium details p', [
                'Flight duration: around 45 minutes',
                'Accessible from age 5, no experience required',
                'Photos and videos available as an option'
            ]);
            setText('.options h3', 'Options & Info');
            setListHtml('.options ul li', [
                'HD video & photos of your flight: <strong>30 EUR</strong>',
                'Custom flights (families, groups, bachelor/bachelorette parties, birthdays...): <strong>Quote on request</strong>',
                'Special rates for Meribel seasonal workers: <a class="inline-contact-btn" href="contact.html">Contact us</a>'
            ]);
            setHtml('.options > p', '<strong>Bookings:</strong><br>Stephane: <a href="tel:0612457517">06 12 45 75 17</a><br>Pierre: <a href="tel:0663765654">06 63 76 56 54</a><br>Tourist office (July-August): <a href="tel:0479086725">04 79 08 67 25</a>');
            setText('.services-preview > .cta-btn', 'Book your flight');
        }

        if (key === 'gallery.html') {
            document.title = 'Gallery - Parapente Meribel';
            setText('.gallery-page-panel h1', 'Photo gallery');
        }

        if (key === 'faq.html') {
            document.title = 'FAQ - Parapente Meribel';
            setText('.faq-section h1', 'FAQ - Frequently Asked Questions');
            setList('.faq-question h2', [
                'Is paragliding accessible to everyone?',
                'Is there an age or weight limit?',
                'Do I need prior experience or a specific fitness level?',
                'How do takeoff and landing work?',
                'What should I bring?',
                'What happens in case of bad weather?',
                'Can we take photos or videos during the flight?',
                'How to book?',
                'Where is the meeting point?'
            ]);
            setListHtml('.faq-answer p', [
                'Yes, tandem flights are accessible to most people, children and adults. You only need to be in good physical shape and able to run a few meters at takeoff. For children, minimum weight is around 25 kg.',
                'There is no strict age limit, but minimum weight is 25 kg and recommended maximum weight is around 100 kg. Contact us if you are unsure.',
                'No, no experience is needed. Our pilots handle everything and explain all steps before flight.',
                'Takeoff is smooth with a short run. Landing is also progressive, often standing, guided by the pilot.',
                'Bring weather-appropriate clothes, closed shoes (sneakers/hiking shoes), and sunglasses. The rest of the equipment is provided.',
                'Safety is our priority. If conditions are not favorable, the flight is postponed or canceled at no cost.',
                'Yes, our pilots offer an HD photo/video option. You may also bring your own GoPro-type camera.',
                'Contact us by phone, WhatsApp, or via the <a href="contact.html">Contact</a> page.',
                'Meeting point is at the Corbey slalom stadium landing area, near Saulire Express gondola in Meribel.'
            ]);
        }

        if (key === 'contact.html') {
            document.title = 'Contact & Bookings - Parapente Meribel';
            setText('.contact-section h1', 'Contact & Bookings');
            setText('.contact-section > p', 'To book a flight, ask a question, or organize an event, contact us directly:');
            setText('.contact-card:nth-of-type(1) h2', 'Our Secretary');
            setText('.contact-card:nth-of-type(1) .contact-card-subnote', '*Available during daytime.');
            setHtml('.contact-card:nth-of-type(1) > p:last-child', '<strong>Phone:</strong> <a href="tel:0479086725">04 79 08 67 25</a>');
            setText('.contact-card:nth-of-type(2) h2', 'Stephane Gorrand');
            setText('.contact-card:nth-of-type(2) .contact-card-subnote', '*Available in the evening.');
            setHtml('.contact-card:nth-of-type(2) > p:last-child', '<strong>Phone:</strong> <a href="tel:0612457517">06 12 45 75 17</a><br><strong>WhatsApp:</strong> <a href="https://wa.me/33612457517" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>');
            setText('.contact-card:nth-of-type(3) h2', 'Pierre Bouvier Garzon');
            setText('.contact-card:nth-of-type(3) .contact-card-subnote', '*Available in the evening.');
            setHtml('.contact-card:nth-of-type(3) > p:last-child', '<strong>Phone:</strong> <a href="tel:0663765654">06 63 76 56 54</a><br><strong>WhatsApp:</strong> <a href="https://wa.me/33663765654" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>');
            setText('.contact-info h3', 'Where to find us?');
            setText('.contact-info p', 'Meeting point at the Corbey slalom stadium landing area, near Saulire Express gondola, Meribel.');
            setHtml('.contact-note p', '<strong>Tip:</strong> Leave us a message and we will call you back during the day.<br><br><a href="services.html" class="cta-btn">See our services & pricing</a>');
        }
    }

    function applyFrench() {
        document.documentElement.lang = 'fr';
        location.reload();
    }

    function setupSwitchUI() {
        const navList = document.querySelector('header nav ul');
        if (!navList || navList.querySelector('.lang-switch-item')) return;

        const switchItem = document.createElement('li');
        switchItem.className = 'lang-switch-item';

        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.className = 'lang-switch-btn';
        switchBtn.innerHTML = '<span class="lang-option lang-option--fr">FR</span><span class="lang-knob"></span><span class="lang-option lang-option--en">EN</span>';

        switchBtn.addEventListener('click', function () {
            const toEnglish = document.documentElement.lang !== 'en';
            if (toEnglish) {
                setLang('en');
                applyEnglish();
                switchBtn.classList.add('is-en');
            } else {
                setLang('fr');
                applyFrench();
            }
        });

        switchItem.appendChild(switchBtn);
        navList.appendChild(switchItem);

        if (getLang() === 'en') {
            switchBtn.classList.add('is-en');
        }
    }

    setupSwitchUI();

    if (getLang() === 'en') {
        applyEnglish();
    } else {
        document.documentElement.lang = 'fr';
        setNav('fr');
    }
})();
