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
