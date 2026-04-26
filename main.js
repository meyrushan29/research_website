/* Well360 — Premium UI Engine */

/* ── Mobile Navigation ── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const navbar    = document.getElementById('navbar');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('nav-open');
        navToggle.classList.toggle('is-active');
        navToggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-open');
            navToggle.classList.remove('is-active');
            navToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('nav-open')) {
            navMenu.classList.remove('nav-open');
            navToggle.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    });
}

/* ── Navbar scroll effect ── */
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('nav-scrolled', window.scrollY > 20);
    }
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }
}, { passive: true });

/* ── Active nav link ── */
(function () {
    const raw = location.pathname.split('/').pop();
    const page = (raw === '' || raw === '/') ? 'index.html' : raw;
    document.querySelectorAll('.nav-link').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page) a.classList.add('active');
    });
})();

/* ── Back to Top ── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ── Scroll-reveal animations ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered children reveal ── */
document.querySelectorAll('.reveal-group').forEach(group => {
    const children = group.children;
    Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
        child.classList.add('reveal');
        revealObserver.observe(child);
    });
});

/* ── Animated counters ── */
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 16 : 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
    });
});

/* ── Contact form handler ── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name    = contactForm.querySelector('#name').value.trim();
        const email   = contactForm.querySelector('#email').value.trim();
        const subject = contactForm.querySelector('#subject').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        const body    = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
        window.location.href = `mailto:it22564818@my.sliit.lk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const btn = contactForm.querySelector('.form-btn');
        const orig = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

/* ── Typewriter effect ── */
const typeEl = document.getElementById('typewriter');
if (typeEl) {
    const words = typeEl.dataset.words.split('|');
    let wi = 0, ci = 0, deleting = false;

    function type() {
        const word = words[wi];
        typeEl.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

        if (!deleting && ci === word.length) {
            setTimeout(() => { deleting = true; type(); }, 2000);
            return;
        }
        if (deleting && ci === 0) {
            deleting = false;
            wi = (wi + 1) % words.length;
        }
        setTimeout(type, deleting ? 50 : 100);
    }
    type();
}

/* ── Copy Email Template ── */
function copyEmailTemplate() {
    const body = document.getElementById('emailTemplateBody');
    const btn  = document.getElementById('copyTemplateBtn');
    if (!body || !btn) return;
    navigator.clipboard.writeText(body.textContent).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy Template'; btn.classList.remove('copied'); }, 2500);
    }).catch(() => {
        const range = document.createRange();
        range.selectNode(body);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy Template'; }, 2500);
    });
}

/* ── Milestone Assessment Dropdown ── */
function showAssessment(value) {
    document.querySelectorAll('.assessment-detail-card').forEach(c => c.classList.remove('active'));
    const target = document.getElementById('detail-' + value);
    if (target) target.classList.add('active');
}

/* ── Site Search ── */
const SEARCH_INDEX = [
    { icon: '🏠', title: 'Home',             desc: 'Well360 overview, project goals, AI modules, hero',             tag: 'home',          href: 'index.html' },
    { icon: '🔬', title: 'Project Domain',   desc: 'Literature survey, research gap, objectives, methodology',      tag: 'domain',        href: 'domain.html' },
    { icon: '🏁', title: 'Milestones',       desc: 'Project timeline, proposal, progress presentations, viva',      tag: 'milestones',    href: 'milestones.html' },
    { icon: '📄', title: 'Documents',        desc: 'Project charter, proposals, status reports, research papers',   tag: 'documents',     href: 'documents.html' },
    { icon: '📊', title: 'Presentations',    desc: 'Proposal and progress slides, final presentation, videos',      tag: 'presentations', href: 'presentations.html' },
    { icon: '👥', title: 'About Us',         desc: 'Team: Meyrushan, Laxshika, Kavilakshan; faculty advisors',     tag: 'about',         href: 'about.html' },
    { icon: '📬', title: 'Contact',          desc: 'Team emails, SLIIT address, contact form, FAQ',                tag: 'contact',       href: 'contact.html' },
    { icon: '💧', title: 'Hydration Module', desc: 'XGBoost, MobileNetV2, SHAP, Grad-CAM, lip image, dehydration', tag: 'domain',        href: 'domain.html' },
    { icon: '🏋️', title: 'Fitness Module',   desc: 'MediaPipe, pose estimation, exercise recognition, form score', tag: 'domain',        href: 'domain.html' },
    { icon: '🧠', title: 'Mental Health',    desc: 'FER, MTCNN, ResNet, Librosa, emotion detection, stress',       tag: 'domain',        href: 'domain.html' },
];

const searchBtn      = document.getElementById('navSearchBtn');
const searchOverlay  = document.getElementById('searchOverlay');
const searchInput    = document.getElementById('searchInput');
const searchResults  = document.getElementById('searchResults');
const searchClose    = document.getElementById('searchClose');
const searchBackdrop = document.getElementById('searchBackdrop');

function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 50);
    renderSearchResults('');
}

function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
}

function renderSearchResults(query) {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();
    if (!q) {
        searchResults.innerHTML = '<p class="search-hint">Try: "hydration", "milestones", "contact", "team", "documents"</p>';
        return;
    }
    const matches = SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tag.includes(q)
    );
    if (!matches.length) {
        searchResults.innerHTML = `<p class="search-no-results">No results for "<strong>${query}</strong>" — try a different keyword.</p>`;
        return;
    }
    searchResults.innerHTML = matches.map(item => `
        <a class="search-result-item" href="${item.href}">
            <span class="search-result-icon">${item.icon}</span>
            <span class="search-result-text">
                <span class="search-result-title">${item.title}</span>
                <span class="search-result-desc">${item.desc}</span>
            </span>
            <span class="search-result-tag">${item.tag}</span>
        </a>`).join('');
}

if (searchBtn)      searchBtn.addEventListener('click', openSearch);
if (searchClose)    searchClose.addEventListener('click', closeSearch);
if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
    searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) {
        closeSearch();
        return;
    }
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || e.key === '/') {
        const tag = document.activeElement.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
            e.preventDefault();
            openSearch();
        }
    }
});
