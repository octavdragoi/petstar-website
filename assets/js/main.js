/**
 * Main JavaScript
 * Handles: Page loading, preloader, accessibility, utilities
 */

(function() {
    'use strict';

    /**
     * Preloader
     */
    function initPreloader() {
        const preloader = document.querySelector('.preloader');

        if (!preloader) return;

        // Hide preloader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');

                // Remove from DOM after transition
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 300); // Small delay for better UX
        });

        console.log('Preloader initialized');
    }

    /**
     * Keyboard Navigation Support
     */
    function initKeyboardNav() {
        // Add class when user navigates with keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        // Remove class when user uses mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        console.log('Keyboard navigation support initialized');
    }

    /**
     * Focus Trap for Modal (if needed)
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }

            // Close on Escape
            if (e.key === 'Escape') {
                element.classList.remove('active');
            }
        });
    }

    /**
     * Detect Touch Device
     */
    function detectTouchDevice() {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouch) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('no-touch');
        }

        console.log('Touch device detection:', isTouch ? 'Touch' : 'No touch');
    }

    /**
     * Performance Observer (Optional - for debugging)
     */
    function initPerformanceObserver() {
        if (!window.PerformanceObserver) return;

        try {
            // Observe Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Observe First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Observe Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (e) {
            console.log('Performance observer not supported');
        }
    }

    /**
     * Handle External Links
     */
    function initExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');

        links.forEach(link => {
            const currentDomain = window.location.hostname;
            const linkDomain = new URL(link.href).hostname;

            if (currentDomain !== linkDomain) {
                // External link
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');

                // Add visual indicator (optional)
                if (!link.querySelector('.external-icon')) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-external-link-alt external-icon';
                    icon.style.fontSize = '0.8em';
                    icon.style.marginLeft = '4px';
                    link.appendChild(icon);
                }
            }
        });

        console.log('External links initialized');
    }

    /**
     * Handle Print
     */
    function initPrint() {
        // Listen for print events
        window.addEventListener('beforeprint', () => {
            console.log('Preparing to print...');
            // You can hide/show elements before printing here
        });

        window.addEventListener('afterprint', () => {
            console.log('Print dialog closed');
        });
    }

    /**
     * Console Welcome Message
     */
    function showWelcomeMessage() {
        const styles = [
            'color: #0075ff',
            'font-size: 16px',
            'font-weight: bold'
        ].join(';');

        console.log('%cWelcome to our website!', styles);
        console.log('Built with modern web technologies');
        console.log('- HTML5, CSS3, JavaScript');
        console.log('- GSAP, WOW.js, Swiper');
        console.log('- Mobile-first responsive design');
    }

    /**
     * Add Loading Class to Images
     */
    function handleImageLoading() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (!img.complete) {
                img.classList.add('loading');

                img.addEventListener('load', function() {
                    this.classList.remove('loading');
                    this.classList.add('loaded');
                });

                img.addEventListener('error', function() {
                    this.classList.remove('loading');
                    this.classList.add('error');
                    console.error('Failed to load image:', this.src);
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }

    /**
     * Debounce Function
     */
    function debounce(func, wait = 250) {
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

    /**
     * Throttle Function
     */
    function throttle(func, limit = 250) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Handle Window Resize
     */
    function initResizeHandler() {
        const handleResize = debounce(() => {
            console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);

            // You can add custom resize logic here
            // For example, recalculate layouts, update charts, etc.
        }, 250);

        window.addEventListener('resize', handleResize);
    }

    /**
     * Handle Visibility Change
     */
    function initVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page is hidden');
                // Pause animations, videos, etc.
            } else {
                console.log('Page is visible');
                // Resume animations, videos, etc.
            }
        });
    }

    /**
     * Service Worker Registration (Optional - for PWA)
     */
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Uncomment to enable service worker
                /*
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
                */
            });
        }
    }

    /**
     * Check Browser Support
     */
    function checkBrowserSupport() {
        const warnings = [];

        // Check for IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            warnings.push('IntersectionObserver not supported');
        }

        // Check for CSS Grid
        if (!CSS.supports('display', 'grid')) {
            warnings.push('CSS Grid not supported');
        }

        // Check for CSS Custom Properties
        if (!CSS.supports('color', 'var(--test)')) {
            warnings.push('CSS Custom Properties not supported');
        }

        if (warnings.length > 0) {
            console.warn('Browser support warnings:', warnings);
            // You could show a message to the user about upgrading their browser
        } else {
            console.log('All features supported');
        }
    }

    /**
     * Initialize all main functionality
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing main.js...');

        // Show welcome message
        showWelcomeMessage();

        // Check browser support
        checkBrowserSupport();

        // Initialize preloader
        initPreloader();

        // Initialize keyboard navigation
        initKeyboardNav();

        // Detect touch device
        detectTouchDevice();

        // Initialize external links
        initExternalLinks();

        // Handle image loading
        handleImageLoading();

        // Initialize resize handler
        initResizeHandler();

        // Initialize visibility change handler
        initVisibilityChange();

        // Initialize print handlers
        initPrint();

        // Register service worker (if needed)
        registerServiceWorker();

        // Initialize performance observer (development only)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            initPerformanceObserver();
        }

        console.log('Main.js initialized successfully');
    }

    // Expose utility functions globally
    window.debounce = debounce;
    window.throttle = throttle;
    window.trapFocus = trapFocus;

    // Start initialization
    init();

})();
