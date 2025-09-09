/**
 * Enhanced Client Cards Animation and Interaction
 */
document.addEventListener('DOMContentLoaded', function() {
    const clientCards = document.querySelectorAll('.client-card');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Initialize cards with animation-ready state
    clientCards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Observe card for scroll animation
        cardObserver.observe(card);
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add subtle parallax effect to logo
        const logo = card.querySelector('.client-logo');
        if (logo) {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) / rect.width;
                const deltaY = (e.clientY - centerY) / rect.height;
                
                const img = logo.querySelector('img');
                if (img) {
                    img.style.transform = `translate(${deltaX * 5}px, ${deltaY * 3}px) scale(1.05)`;
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const img = logo.querySelector('img');
                if (img) {
                    img.style.transform = 'translate(0, 0) scale(1)';
                }
            });
        }
    });
    
    // Add smooth reveal animation for the entire clients section
    const clientsSection = document.getElementById('clients-section');
    if (clientsSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(clientsSection);
    }
    
    // Performance optimization: Throttle mousemove events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply throttling to all mousemove events
    clientCards.forEach(card => {
        const originalMouseMove = card.onmousemove;
        if (originalMouseMove) {
            card.onmousemove = throttle(originalMouseMove, 16); // ~60fps
        }
    });
});

/**
 * CSS Classes for additional animations
 */
const additionalStyles = `
    .client-card {
        will-change: transform, box-shadow;
    }
    
    .client-logo img {
        will-change: transform, filter;
    }
    
    .section-visible .client-card {
        animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        .client-card {
            transition: none !important;
        }
        
        .client-logo img {
            transition: filter 0.3s ease !important;
        }
        
        .client-card:hover {
            transform: none !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
