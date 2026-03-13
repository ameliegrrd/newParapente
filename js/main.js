function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !image || !caption) {
        return;
    }

    image.src = src;
    image.alt = alt;
    caption.textContent = alt;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        return;
    }
    lightbox.style.display = 'none';
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');

    if (!answer || !toggle) {
        return;
    }

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
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

(function setupPageTransitions() {
    const main = document.querySelector('main');
    if (!main) {
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const target =
        main.querySelector(':scope > section') ||
        main.querySelector(':scope > div') ||
        main;

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
