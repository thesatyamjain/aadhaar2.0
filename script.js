document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the stats section, run counters
                if(entry.target.id === 'impact-stats' && !entry.target.classList.contains('counted')) {
                    runCounters();
                    entry.target.classList.add('counted');
                }

                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('.observe-me');
    elementsToObserve.forEach(el => observer.observe(el));
    
    // Smooth Scrolling for Navbar Links
    document.querySelectorAll('.nav-links a, .hero-cta a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter Animation Logic
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const runCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '').replace(/[^\d\.]/g, ''); // strip out current prefixes
                const inc = target / speed;
                
                let currentPrefix = counter.getAttribute('data-prefix') || '';
                let currentSuffix = counter.getAttribute('data-suffix') || '';

                if (count < target) {
                    let nextVal = Math.ceil(count + inc);
                    if (nextVal > target) nextVal = target; // cap it
                    counter.innerText = currentPrefix + formatNumber(nextVal) + currentSuffix;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = currentPrefix + formatNumber(target) + currentSuffix;
                }
            };
            updateCount();
        });
    }
});
