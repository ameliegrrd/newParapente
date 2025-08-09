function openLightbox(src, alt) {
    document.getElementById('lightbox-img').src = src.replace('/200/130', '/800/520');
    document.getElementById('lightbox-img').alt = alt;
    document.getElementById('lightbox-caption').textContent = alt;
    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');

    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        toggle.textContent = '+';
        faqItem.classList.remove('active');
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        toggle.textContent = '−';
        faqItem.classList.add('active');
    }
}