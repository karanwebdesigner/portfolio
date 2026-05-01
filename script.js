// Typing Animation for Hero Title
const typingTexts = document.querySelectorAll('.typing-text');

typingTexts.forEach((text, index) => {
    const originalText = text.textContent;
    text.textContent = '';
    let charIndex = 0;
    
    setTimeout(() => {
        const typeWriter = () => {
            if (charIndex < originalText.length) {
                text.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }, index * 500);
});

function smoothScrollToElement(targetElement, duration = 800) {
    if (!targetElement) return;

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const startPosition = window.pageYOffset;
    const rawTargetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetPosition = Math.min(Math.max(0, rawTargetPosition), maxScroll);
    const distance = targetPosition - startPosition;

    // Prefer native smooth scrolling when available (best cross-browser feel)
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (supportsNativeSmoothScroll) {
        try {
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            return;
        } catch {
            // Fall back to RAF animation below
        }
    }
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const eased = easeInOutCubic(percentage);
        window.scrollTo(0, startPosition + distance * eased);
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}

// About Modal
const aboutModal = document.getElementById('aboutModal');
const aboutModalClose = document.getElementById('aboutModalClose');
const aboutLink = document.getElementById('aboutLink');

function openAboutModal() {
    aboutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate sections on open
    setTimeout(() => {
        const sections = aboutModal.querySelectorAll('.about-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('visible');
            }, index * 200);
        });
    }, 300);
}

function closeAboutModal() {
    aboutModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset animations
    const sections = aboutModal.querySelectorAll('.about-section');
    sections.forEach(section => {
        section.classList.remove('visible');
    });
}

if (aboutModal && aboutModalClose && aboutLink) {
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAboutModal();
    });

    aboutModalClose.addEventListener('click', closeAboutModal);

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            closeAboutModal();
        }
    });
}

// Escape key to close about modal
document.addEventListener('keydown', (e) => {
    if (aboutModal && e.key === 'Escape' && aboutModal.classList.contains('active')) {
        closeAboutModal();
    }
});

// Parallax effect for about modal sections
if (aboutModal) aboutModal.addEventListener('mousemove', (e) => {
    const sections = aboutModal.querySelectorAll('.about-section');
    const rect = aboutModal.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    sections.forEach((section, index) => {
        const speed = 0.02;
        const xOffset = (mouseX - rect.width / 2) * speed;
        const yOffset = (mouseY - rect.height / 2) * speed;
        
        section.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Custom Cursor (disabled on touch/coarse pointer devices)
const cursor = document.querySelector('.cursor');
const isCoarsePointer = window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches);

if (cursor && !isCoarsePointer) {
    let mouseX = 0;
    let mouseY = 0;

    // Initialize cursor position
    document.addEventListener('DOMContentLoaded', () => {
        cursor.style.left = '0px';
        cursor.style.top = '0px';
    });

    // Use direct mouse tracking for better performance
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Direct position update for responsiveness
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .work-item, .nav-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('.theme-icon');
    const html = document.documentElement;

    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '◐' : '◑';
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
});

// Smooth scrolling for navigation and CTA buttons - Cross-browser compatible
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = element.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;

            // Close mobile menu if open
            const floatingNav = document.getElementById('floatingNav');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            if (floatingNav && floatingNav.classList.contains('mobile-open')) {
                floatingNav.classList.remove('mobile-open');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            }

            smoothScrollToElement(targetElement);
        });
    });
    
    // About modal functionality
    const aboutLink = document.getElementById('aboutLink');
    const aboutModal = document.getElementById('aboutModal');
    const aboutModalClose = document.getElementById('aboutModalClose');
    
    if (aboutLink && aboutModal) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (aboutModalClose && aboutModal) {
        aboutModalClose.addEventListener('click', () => {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal on background click
    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Hide/show navigation on scroll (CSS-class driven to avoid mobile transform conflicts)
    let lastScrollTop = 0;
    let ticking = false;
    const floatingNavEl = document.getElementById('floatingNav');

    function updateNavVisibility() {
        if (!floatingNavEl) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobileOpen = floatingNavEl.classList.contains('mobile-open');

        if (!isMobileOpen && scrollTop > lastScrollTop && scrollTop > 100) {
            floatingNavEl.classList.add('nav-hidden');
        } else {
            floatingNavEl.classList.remove('nav-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavVisibility);
            ticking = true;
        }
    });
});

// Mobile menu toggle (morph floating nav into dropdown)
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const floatingNav = document.getElementById('floatingNav');

if (mobileMenuToggle && navMenu && floatingNav) {
    mobileMenuToggle.addEventListener('click', () => {
        floatingNav.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (floatingNav.classList.contains('mobile-open')) {
                floatingNav.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
}

// Add parallax effect to about modal content
document.addEventListener('DOMContentLoaded', () => {
    const aboutModal = document.getElementById('aboutModal');
    if (aboutModal) {
        const modalContent = aboutModal.querySelector('.about-modal-content');
        
        aboutModal.addEventListener('mousemove', (e) => {
            const rect = aboutModal.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 50;
            const moveY = (y - centerY) / 50;
            
            if (modalContent) {
                modalContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        aboutModal.addEventListener('mouseleave', () => {
            if (modalContent) {
                modalContent.style.transform = 'translate(0, 0)';
            }
        });
    }
});

// Download resume functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            // Create a temporary link to download resume
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Darbara_Singh_Resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});

// Parallax Effect
const parallaxElements = document.querySelectorAll('[data-parallax]');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax');
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Work items
const workItems = document.querySelectorAll('.work-item');

// Tilt Effect for Work Items
if (workItems && workItems.length) {
    workItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Modern PDF Modal
const pdfModal = document.getElementById('pdfModal');
const pdfModalClose = document.getElementById('pdfModalClose');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfFrame = document.getElementById('pdfFrame');
const resumeLink = document.getElementById('resumeLink');

function openPdfModal(title) {
    if (!pdfModal || !pdfModalTitle || !pdfFrame) return;
    pdfModalTitle.textContent = title;
    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePdfModal() {
    if (!pdfModal || !pdfFrame) return;
    pdfModal.classList.remove('active');
    document.body.style.overflow = '';
    pdfFrame.src = '';
}

if (pdfModal && pdfModalClose && pdfModalTitle && pdfFrame) {
    pdfModalClose.addEventListener('click', closePdfModal);

    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closePdfModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });
}

// View Case Studies CTA
const viewCaseStudies = document.getElementById('viewCaseStudies');
if (viewCaseStudies) {
    viewCaseStudies.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('work');
        if (!targetElement) return;

        // Close mobile menu if open
        const floatingNav = document.getElementById('floatingNav');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (floatingNav && floatingNav.classList.contains('mobile-open')) {
            floatingNav.classList.remove('mobile-open');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        }

        smoothScrollToElement(targetElement);
    });
}

// Work CTA buttons - open modern PDF viewer
const workCtaButtons = document.querySelectorAll('.work-cta');
workCtaButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        // If this CTA is a normal link (recommended), allow default behavior.
        if (button.tagName === 'A') return;

        e.stopPropagation();
        if (!pdfModal || !pdfModalTitle || !pdfFrame) return;
        const caseStudy = button.getAttribute('data-case-study');
        const title = caseStudy === 'mobile-growth' ?
            'Mobile Growth Case Study' :
            'Design for High-Intent Actions Case Study';

        openPdfModal(title);
    });
});

// Work section animations and interactions with updated pagination
const workCurrent = document.querySelector('.work-current');
const workTotal = document.querySelector('.work-total');
const workLabelIndicator = document.querySelector('.work-label-indicator');

// Intersection Observer for work items
const workObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Update pagination
            const workNumberEl = entry.target.querySelector('.work-number');
            const workNumber = workNumberEl ? workNumberEl.textContent : null;
            if (workNumber && workCurrent) workCurrent.textContent = workNumber;
            
            // Update indicator color
            if (workLabelIndicator && workNumber) {
                if (workNumber === '01') {
                    workLabelIndicator.style.background = 'var(--text-primary)';
                } else if (workNumber === '02') {
                    workLabelIndicator.style.background = 'var(--accent)';
                }
            }
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
});

if (workItems && workItems.length) {
    workItems.forEach(item => {
        workObserver.observe(item);
    });
}

// Work items click to view details
if (workItems && workItems.length) {
    workItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('work-cta')) {
                const ctaButton = item.querySelector('.work-cta');
                if (ctaButton) {
                    ctaButton.click();
                }
            }
        });
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe work items for animation
workItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Fix viewport issues
function fixViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

fixViewport();

// Magnetic Interaction for AI CTA
document.addEventListener('DOMContentLoaded', () => {
    const aiCta = document.querySelector('.hero-ai-cta');
    if (!aiCta) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    aiCta.addEventListener('mousemove', (e) => {
        const rect = aiCta.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull strength Factor
        const strength = 0.3;
        
        aiCta.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
        
        const glow = aiCta.querySelector('.ai-glow');
        if (glow) {
            glow.style.transform = `translate(calc(-50% + ${x * 0.1}px), calc(-50% + ${y * 0.1}px))`;
        }
    });

    aiCta.addEventListener('mouseleave', () => {
        aiCta.style.transform = 'translate(0, 0) scale(1)';
        const glow = aiCta.querySelector('.ai-glow');
        if (glow) {
            glow.style.transform = 'translate(-50%, -50%)';
        }
    });
});
