/* ============================================================
   Case Study — Interaction Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.cs-main-scroll');
    const sections = document.querySelectorAll('.cs-block');
    const navLinks = document.querySelectorAll('.cs-section-link');
    const indicator = document.querySelector('.cs-nav-indicator');
    const progressBar = document.getElementById('progressBar');
    
    // Floating Nav Elements (Mobile)
    const floatingNav = document.querySelector('.cs-floating-nav');
    const navPill = document.querySelector('.cs-nav-pill');
    const activeLabel = document.querySelector('.cs-active-label');
    const floatingLinks = document.querySelectorAll('.cs-floating-link');

    // Detect if we are in mobile scroll mode (body scrolls) or desktop mode (container scrolls)
    const isMobile = () => window.innerWidth <= 850;

    /* ---------- Custom Smooth Scroll (Ease-In-Out) ---------- */
    function customScrollTo(targetY, duration = 1000) {
        const startY = isMobile() ? window.pageYOffset : scrollContainer.scrollTop;
        const diff = targetY - startY;
        let start = null;

        const easing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            const val = startY + diff * easing(percentage);

            if (isMobile()) {
                window.scrollTo(0, val);
            } else {
                scrollContainer.scrollTop = val;
            }

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    /* ---------- Floating Nav Toggle (Mobile) ---------- */
    if (navPill && floatingNav) {
        navPill.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingNav.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            floatingNav.classList.remove('active');
        });

        floatingLinks.forEach(link => {
            link.addEventListener('click', () => {
                floatingNav.classList.remove('active');
            });
        });
    }

    /* ---------- Scroll Progress Tracking ---------- */
    const onScroll = () => {
        const currentScroll = isMobile() ? window.pageYOffset : scrollContainer.scrollTop;
        const totalHeight = isMobile() ? 
            document.documentElement.scrollHeight - window.innerHeight : 
            scrollContainer.scrollHeight - scrollContainer.clientHeight;
        
        const scrolled = (currentScroll / totalHeight) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
        
        updateActiveSection(currentScroll);
    };

    if (isMobile()) {
        window.addEventListener('scroll', onScroll);
    } else if (scrollContainer) {
        scrollContainer.addEventListener('scroll', onScroll);
    }

    /* ---------- Active Section Highlighting ---------- */
    function updateActiveSection(currentScroll) {
        let currentSectionId = "";
        let currentSectionName = "Overview";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (currentScroll >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute('id');
                const label = section.querySelector('.cs-block-label');
                if (label) {
                    currentSectionName = label.textContent.split(' — ')[0] || "Overview";
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                if (indicator) {
                    const parentLi = link.parentElement;
                    indicator.style.transform = `translateY(${parentLi.offsetTop}px)`;
                }
            }
        });

        if (activeLabel) activeLabel.textContent = currentSectionName;

        floatingLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /* ---------- Navigation Clicks ---------- */
    const allNavLinks = [...navLinks, ...floatingLinks];
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                customScrollTo(targetSection.offsetTop);
            }
        });
    });

    /* ---------- Theme Toggle ---------- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Handle Resize (switch listeners if needed)
    window.addEventListener('resize', () => {
        window.removeEventListener('scroll', onScroll);
        if (scrollContainer) scrollContainer.removeEventListener('scroll', onScroll);
        
        if (isMobile()) {
            window.addEventListener('scroll', onScroll);
        } else if (scrollContainer) {
            scrollContainer.addEventListener('scroll', onScroll);
        }
    });

    onScroll();
});
