let lightboxItems = [];
let lightboxIndex = -1;

function normalizeUrl(value) {
    try {
        return new URL(value, window.location.href).href;
    } catch (error) {
        return value;
    }
}

function getLightboxItems() {
    return Array.from(document.querySelectorAll('img[onclick*="openLightbox"]'));
}

function renderLightboxAt(index) {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !image || !caption || lightboxItems.length === 0) return;

    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const selected = lightboxItems[lightboxIndex];
    if (!selected) return;

    image.src = selected.src;
    image.alt = selected.alt;
    caption.textContent = selected.alt;
    lightbox.style.display = 'flex';
}

function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !image || !caption) return;

    lightboxItems = getLightboxItems();
    const targetSrc = normalizeUrl(src);
    const foundIndex = lightboxItems.findIndex(function (item) {
        return normalizeUrl(item.src) === targetSrc;
    });

    if (foundIndex >= 0) {
        renderLightboxAt(foundIndex);
        return;
    }

    image.src = src;
    image.alt = alt;
    caption.textContent = alt;
    lightbox.style.display = 'flex';
    lightboxIndex = -1;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.style.display = 'none';
}

function isLightboxOpen() {
    const lightbox = document.getElementById('lightbox');
    return !!lightbox && lightbox.style.display === 'flex';
}

function showNextLightboxItem() {
    if (!isLightboxOpen() || lightboxItems.length === 0) return;
    renderLightboxAt(lightboxIndex + 1);
}

function showPreviousLightboxItem() {
    if (!isLightboxOpen() || lightboxItems.length === 0) return;
    renderLightboxAt(lightboxIndex - 1);
}

function onLightboxNavClick(direction, event) {
    if (event) event.stopPropagation();
    if (direction === 'next') {
        showNextLightboxItem();
        return;
    }
    showPreviousLightboxItem();
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
    if (!isLightboxOpen()) return;
    if (event.key === 'Escape') {
        closeLightbox();
        return;
    }
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNextLightboxItem();
        return;
    }
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPreviousLightboxItem();
    }
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
        const prevBtn = document.querySelector('.lightbox-nav-prev');
        const nextBtn = document.querySelector('.lightbox-nav-next');
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Previous image');
        if (nextBtn) nextBtn.setAttribute('aria-label', 'Next image');

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
            setText('.day-flow h2', 'Clear outline of your experience');
            setList('.roadmap-step p', [
                'Meet at the Chaudanne roundabout',
                '4x4 or gondola ride up to takeoff',
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
                'Panoramic view over the entire Meribel valley',
                'Gentle and/or strong sensations'
            ]);
            setText('.home-offers .offer-card:nth-of-type(1) .price', 'From 140 €');
            setText('.home-offers .offer-card:nth-of-type(2) .offer-badge', 'Premium experience');
            setText('.home-offers .offer-card:nth-of-type(2) h3', 'Premium Flight');
            setText('.home-offers .offer-card:nth-of-type(2) p', 'A longer flight to visit several valleys and enjoy an exceptional alpine panorama.');
            setList('.home-offers .offer-card:nth-of-type(2) .offer-points li', [
                'Extended flight time',
                'Multi-valley scenic route',
                'A strong memory to offer or enjoy'
            ]);
            setText('.home-offers .offer-card:nth-of-type(2) .price', 'From 300 €');
            setText('.offers-reassurance', 'Limited slots depending on weather. Book in advance to secure your slot.');
            setText('.home-offers .cta-btn', 'See all prices and options');
            setText('.gallery-preview h2', 'In pictures: the Parapente Meribel experience');
            setText('.gallery-preview .cta-link', 'See all photos');
            setText('.home-social h3', 'Follow us on Instagram');
            setText('.home-social p', 'Discover our latest flight photos and videos in Meribel.');
            setText('.home-social-link span', '@parapentemeribel');
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
            setText('.team-member:nth-of-type(3) p', 'Team secretary, Sarah manages bookings and coordinates communication with guests so each flight is prepared smoothly and efficiently.');
            setText('.team-member:nth-of-type(4) p', 'Employed pilot at Parapente Meribel for over 15 years, Djampal is an experienced pilot, educational, and always attentive to passengers.');
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
                'Morning or afternoon slot depending on your weight',
                'Transport and safety equipment included'
            ]);
            setText('.service-discovery .service-price', '140 € / flight');
            setText('.service-discovery summary', 'Learn more');
            setHtml('.service-discovery details', '<summary>Learn more</summary><p>In-flight GoPro videos: not included</p><p>Accessible from 25 kg, no experience required</p><p class="meeting-slot"><strong>In the morning:</strong> meet at the Tougnette gondola departure, on the Chaudanne plateau.</p><p class="meeting-slot"><strong>In the afternoon:</strong> meet at the Rhodos aerial parking area, at the entrance to the Chaudanne plateau, near the roundabout.</p><p>Gondola or car ascent included (deduction if you already have a lift pass for ski lifts). Landing at La Chaudanne, in front of the Saulire Express gondola.</p>');
            setText('.service-premium .service-tag', 'Premium experience');
            setText('.service-premium h2', 'Premium Flight');
            setText('.service-premium .service-hook', 'Visit Meribel and nearby areas');
            setList('.service-premium .service-benefits li', [
                'Flight over several valleys',
                'Route adapted to best conditions of the day'
            ]);
            setText('.service-premium .service-price', '300 € / flight');
            setText('.service-premium summary', 'Learn more');
            setHtml('.service-premium details', '<summary>Learn more</summary><p>Flight duration: around 45 minutes</p><p>Accessible from age 5, no experience required</p><p class="meeting-slot"><strong>In the morning:</strong> meet at the Tougnette gondola departure, on the Chaudanne plateau.</p><p class="meeting-slot"><strong>In the afternoon:</strong> meet at the Rhodos aerial parking area, at the entrance to the Chaudanne plateau, near the roundabout.</p><p>Photos and videos available as an option</p>');
            setText('.options h3', 'Options & Info');
            setListHtml('.options ul li', [
                'HD video & photos of your flight: <strong>30 €</strong>',
                'Custom flights (families, groups, bachelor/bachelorette parties, birthdays...): <strong>Quote on request</strong>',
                'Special rates for Meribel seasonal workers: <a class="inline-contact-btn" href="contact.html">Contact us</a>',
                'Want to offer a gift? Ask us for a voucher by contacting us.'
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
            const faqItems = document.querySelectorAll('.faq-item');
            const faqQuestions = [
                'Do you feel vertigo while paragliding?',
                'What should I bring?',
                'At what altitude will we fly?',
                'Is paragliding accessible to everyone?',
                'Takeoff: do we need to jump off a cliff?',
                'How does landing work?',
                'What happens in case of bad weather?',
                'What happens in case of cancellation?',
                'Can we take photos or videos during the flight?',
                'How to book?',
                'Where is the meeting point?'
            ];
            const faqAnswers = [
                '<p>No, you usually do not feel vertigo while paragliding. The unpleasant vertigo sensation generally appears when there is a fixed ground reference. In paragliding, you move through the air with a sink rate of about 1 meter per second and a horizontal speed of around 30 km/h, so that fixed visual reference is not present. At most, some passengers may feel apprehension about height or the ground. In case of real phobia, flights close to the ground are possible on our sites. Most passengers are surprised to feel comfortable in the air after about 5 minutes.</p>',
                '<p>Temperature drops by about 0.6°C to 1°C every 100 meters, and we fly at an average speed of 30 km/h. The combination of these two effects strongly impacts perceived temperature, not to mention possible humidity saturation (micro water droplets/cloud).</p><p>In short, you are rarely too warm in the air: plan for long pants, a fleece, a sweater or sweatshirt, plus a windbreaker and thin gloves if you have them. Avoid capri pants and shorts.</p><p>Takeoff areas are sloped and require minimum grip, and terrain is not always even: wear high shoes that cover the ankles (hiking style), or at least sneakers. We can lend you a helmet, gloves and a jacket if you are not equipped. (Prescription glasses and sunglasses are compatible with our helmets.)</p>',
                '<p>Each flight is different because solar heating and the nature of the air mass can vary a lot. Thermals can be cyclical, from weak to strong, and their usable altitude depends on temperature contrasts between air layers, terrain exposure, and general weather patterns. In short, we often reach between 2600 and 3000 m. Sometimes the flight is long but lower in altitude, with very detailed views of the landscape and local wildlife. In other situations, the cloud base can be well above 3000 m, and it is possible to fly higher than nearby summits.</p>',
                '<p>Tandem paragliding can be practiced from about age 7 to 77 and beyond. Below age 6, children may not fully appreciate the activity due to maturity, but they are not excluded if they weigh at least 25 kg, with low-wind flights in early or late day. For older passengers and people over 90 kg, afternoon slots are often preferred because a windier takeoff reduces the required run. In some cases, passengers with reduced mobility, including certain paraplegic passengers, can also fly. We organize flights according to physical constraints unless there is a medical contraindication. No medical certificate is required, but passengers (or guardians for minors) must inform us of known contraindications, such as heart fragility or pregnancy.</p>',
                '<p>Paragliding is often associated by the general public with activities such as skydiving or base jumping. Because of that, some people imagine takeoff as a jump into the void, but that is not the case.</p><p>In practice, takeoff is done in 4 steps:</p><ol><li>Wing preparation on the ground with pre-flight checks and pre-inflation done by the pilot.</li><li>Wing inflation (progressive movement and, if needed, light resistance to stay standing).</li><li>A committed run down the slope (about 10 to 20 meters) to load the wing.</li><li>Once the paraglider takes both pilot and passenger, you sit comfortably in the harness (a soft seat, much more comfortable than a basic climbing harness).</li></ol>',
                '<p>While you can choose the takeoff moment, landing is inevitable and depends on conditions. You may land gently on your feet with a good headwind, or seated with more speed when the wind is lighter or variable in strength and direction.</p><p>The pilot&rsquo;s anticipation and experience ensure a safe return to the ground. The passenger has no strict instruction and does not need to worry about landing, so staying seated is fine. In rarer stronger landing conditions, the passenger harness includes an airbag to absorb what the pilot might not anticipate at the last moment (for example a strong gradient close to the ground). This airbag inflates with relative wind (our own airspeed in flight).</p><p>In short, takeoff and landing are accessible to all ages, without any &ldquo;sport level&rdquo; requirement, and are much more reassuring than people usually imagine.</p>',
                '<p>Safety is our priority. If conditions are not favorable, the flight is postponed or canceled at no cost.</p>',
                '<p>If the cancellation comes from us, which can happen because of weather or safety conditions, you will be refunded 100%. If the cancellation comes from your side, a refund is possible if you notify us at least 24 hours in advance.</p>',
                '<p>Yes, you can bring your phone. However, if you drop it during the flight, it remains your responsibility.</p><p>People accompanying you can also film your landing from the ground.</p><p>We offer a photo/video option made by us with a GoPro, sold at 30 €.</p>',
                '<p>Contact us by phone, WhatsApp, or via the <a href="contact.html">Contact</a> page.</p><p>No bookings are made through social media.</p>',
                '<p><strong>In the morning:</strong> meet at the Tougnette gondola departure, on the Chaudanne plateau.</p><p><strong>In the afternoon:</strong> meet at the Rhodos aerial parking area, at the entrance to the Chaudanne plateau, near the roundabout.</p>'
            ];

            faqItems.forEach(function (item, index) {
                const question = item.querySelector('.faq-question h2');
                const answer = item.querySelector('.faq-answer');
                if (question && faqQuestions[index]) {
                    question.textContent = faqQuestions[index];
                }
                if (answer && faqAnswers[index]) {
                    answer.innerHTML = faqAnswers[index];
                }
            });
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
            setText('.contact-social h3', 'Follow us on Instagram');
            setText('.contact-social p', 'Discover our latest flight photos and videos in Meribel.');
            setText('.contact-social-link span', '@parapentemeribel');
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

    function setupInstagramCornerLink() {
        const navList = document.querySelector('header nav ul');
        if (!navList || navList.querySelector('.insta-corner-link')) return;

        const link = document.createElement('a');
        link.className = 'insta-corner-link';
        link.href = 'https://www.instagram.com/parapentemeribel/';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Instagram Parapente Meribel');
        link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>';

        const item = document.createElement('li');
        item.className = 'insta-nav-item';
        item.appendChild(link);

        const langItem = navList.querySelector('.lang-switch-item');
        if (langItem) {
            navList.insertBefore(item, langItem);
        } else {
            navList.appendChild(item);
        }
    }

    setupSwitchUI();
    setupInstagramCornerLink();

    if (getLang() === 'en') {
        applyEnglish();
    } else {
        document.documentElement.lang = 'fr';
        setNav('fr');
    }
})();

