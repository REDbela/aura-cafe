/* ========================================
   AURA CAFE - SCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile menu toggle ---
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('open') && 
            !navLinks.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // --- Menu tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuGrids = document.querySelectorAll('.menu-grid');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            menuGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === target) {
                    grid.classList.add('active');
                    // Re-trigger animations for menu cards
                    grid.querySelectorAll('[data-animate]').forEach(el => {
                        el.classList.remove('visible');
                        setTimeout(() => {
                            if (isElementInViewport(el)) {
                                el.classList.add('visible');
                            }
                        }, 50);
                    });
                }
            });
        });
    });

    // --- Scroll animations (Intersection Observer) ---
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.92;
    }

    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                const delay = Array.from(entry.target.parentElement.children)
                    .filter(child => child.hasAttribute('data-animate'))
                    .indexOf(entry.target) * 80;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Gallery lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Smooth parallax for hero ---
    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const parallax = window.scrollY * 0.3;
            heroBg.style.transform = `scale(1.05) translateY(${parallax}px)`;
        }
    });

    // --- Counter animation for about stats ---
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const aboutSection = document.getElementById('hakkimizda');
        if (!aboutSection) return;

        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            statsAnimated = true;

            stats.forEach(stat => {
                const text = stat.textContent;
                const numMatch = text.match(/(\d+)/);
                
                if (numMatch) {
                    const target = parseInt(numMatch[1]);
                    const suffix = text.replace(numMatch[1], '');
                    let current = 0;
                    const increment = target / 40;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current) + suffix;
                    }, 30);
                }
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats();
});
