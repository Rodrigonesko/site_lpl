/* =====================================================
   Modern Header JavaScript - 2024
   ===================================================== */

(function() {
    'use strict';

    // Elements
    const header = document.querySelector('.header');
    const openNavMenu = document.querySelector('.open-nav-menu');
    const closeNavMenu = document.querySelector('.close-nav-menu');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;
    
    // Constants
    const MOBILE_BREAKPOINT = 1024;
    const SCROLL_THRESHOLD = 50;

    // Initialize
    function init() {
        if (!header || !openNavMenu || !closeNavMenu || !navMenu || !menuOverlay) {
            console.warn('Header elements not found');
            return;
        }

        setupEventListeners();
        handleResize();
        handleScroll();
    }

    // Event Listeners
    function setupEventListeners() {
        // Menu toggle events
        openNavMenu.addEventListener('click', toggleMobileMenu);
        closeNavMenu.addEventListener('click', toggleMobileMenu);
        menuOverlay.addEventListener('click', closeMobileMenu);

        // Window events
        window.addEventListener('resize', debounce(handleResize, 250));
        window.addEventListener('scroll', throttle(handleScroll, 16));

        // Menu item clicks (for mobile)
        const menuLinks = navMenu.querySelectorAll('.menu-item a');
        menuLinks.forEach(link => {
            link.addEventListener('click', handleMenuLinkClick);
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        // Prevent menu close when clicking inside nav menu
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        navMenu.classList.add('open');
        menuOverlay.classList.add('active');
        body.classList.add('menu-open');
        
        // Update ARIA attributes
        openNavMenu.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus management
        closeNavMenu.focus();
        
        // Trap focus within menu
        trapFocus(navMenu);
    }

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Update ARIA attributes
        openNavMenu.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Return focus to menu button
        openNavMenu.focus();
        
        // Remove focus trap
        removeFocusTrap();
    }

    // Handle menu link clicks
    function handleMenuLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Close mobile menu when clicking internal links
        if (window.innerWidth <= MOBILE_BREAKPOINT && href.startsWith('#')) {
            setTimeout(closeMobileMenu, 150);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        const isMenuOpen = navMenu.classList.contains('open');
        
        // ESC key closes mobile menu
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    }

    // Handle window resize
    function handleResize() {
        const windowWidth = window.innerWidth;
        
        // Close mobile menu if window is resized to desktop
        if (windowWidth > MOBILE_BREAKPOINT && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    }

    // Handle scroll effects
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Focus trap for accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        function handleFocusTrap(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
        
        element.addEventListener('keydown', handleFocusTrap);
        element._focusTrapHandler = handleFocusTrap;
    }

    // Remove focus trap
    function removeFocusTrap() {
        if (navMenu._focusTrapHandler) {
            navMenu.removeEventListener('keydown', navMenu._focusTrapHandler);
            delete navMenu._focusTrapHandler;
        }
    }

    // Utility: Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Smooth scroll for anchor links
    function setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced scroll behavior for better UX
    function enhancedScrollBehavior() {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateScrollDirection() {
            const scrollY = window.scrollY;
            
            if (scrollY > lastScrollY && scrollY > 100) {
                // Scrolling down
                header.classList.add('scroll-down');
                header.classList.remove('scroll-up');
            } else if (scrollY < lastScrollY) {
                // Scrolling up
                header.classList.add('scroll-up');
                header.classList.remove('scroll-down');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Additional features
    document.addEventListener('DOMContentLoaded', function() {
        setupSmoothScroll();
        enhancedScrollBehavior();
    });

    // Performance optimization: Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animations
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                observer.observe(section);
            });
        });
    }

})();