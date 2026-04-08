document.addEventListener('DOMContentLoaded', () => {

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scroll-progress');
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });

    // ===== INTERSECTION OBSERVER (Scroll Animations) =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'stats' && !entry.target.dataset.counted) {
                    runCounters();
                    entry.target.dataset.counted = 'true';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));

    // ===== STAGGERED CARD ANIMATION =====
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll(
                    '.info-card, .pillar-card, .dimension-box, .stat-box, .module-card, .env-item, .doc-tag, .timeline-item'
                );
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.cards-grid-2, .dimensions-grid, .stats-grid, .modules-grid, .env-stats, .doc-grid, .timeline').forEach(el => {
        cardObserver.observe(el);
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 88, behavior: 'smooth' });
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    });

    // ===== ACCORDION =====
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const isOpen = content.classList.contains('open');
            content.classList.toggle('open');
            const arrow = btn.querySelector('.acc-arrow');
            if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // ===== MOBILE MENU =====
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // ===== SCROLLSPY =====
    const sections = document.querySelectorAll('section[id], header[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarEl = document.getElementById('sidebar');
    let scrollSpyTick = false;

    const scrollSpy = () => {
        if (scrollSpyTick) return;
        scrollSpyTick = true;
        requestAnimationFrame(() => {
            const scrollPos = window.scrollY + 130;
            let currentId = '';
            sections.forEach(section => {
                if (section.offsetTop <= scrollPos) currentId = section.id;
            });
            let activeLink = null;
            sidebarLinks.forEach(link => {
                const isActive = link.getAttribute('href') === '#' + currentId;
                link.classList.toggle('active', isActive);
                if (isActive) activeLink = link;
            });

            // Auto-scroll sidebar to keep active link visible
            if (activeLink && sidebarEl) {
                const sidebarRect = sidebarEl.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();
                const linkTop = linkRect.top - sidebarRect.top;
                const linkBottom = linkTop + linkRect.height;
                const visibleHeight = sidebarEl.clientHeight;

                if (linkTop < 60 || linkBottom > visibleHeight - 60) {
                    sidebarEl.scrollTo({
                        top: activeLink.offsetTop - visibleHeight / 3,
                        behavior: 'smooth'
                    });
                }
            }

            scrollSpyTick = false;
        });
    };
    window.addEventListener('scroll', scrollSpy, { passive: true });
    scrollSpy();

    // ===== COUNTER ANIMATION =====
    const formatNum = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const runCounters = () => {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.dataset.target;
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';
            const duration = 2200;
            const startTime = performance.now();

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                const current = Math.floor(target * easedProgress);
                counter.textContent = prefix + formatNum(current) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
                else counter.textContent = prefix + formatNum(target) + suffix;
            };
            requestAnimationFrame(tick);
        });
    };

    // ===== PARALLAX GLOW ON CARDS (mouse tracking) =====
    document.querySelectorAll('.info-card, .dimension-box, .module-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
            card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(123,97,255,0.04), transparent 40%), var(--bg-card)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });
});
