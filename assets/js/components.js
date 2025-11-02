/**
 * Components JavaScript
 * Handles: Navigation, Mobile Menu, Forms, Smooth Scroll
 */

(function() {
    'use strict';

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!menuToggle || !navMenu) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        console.log('Mobile menu initialized');
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if href is just "#"
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    // Get header height for offset
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;

                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    updateActiveNavLink(href);
                }
            });
        });

        console.log('Smooth scroll initialized');
    }

    /**
     * Update Active Navigation Link
     */
    function updateActiveNavLink(href) {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Sticky Header on Scroll
     */
    function initStickyHeader() {
        const header = document.querySelector('.header');

        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Optional: Hide header on scroll down, show on scroll up
            // Uncomment the following if you want this behavior
            /*
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            */

            lastScroll = currentScroll;
        });

        console.log('Sticky header initialized');
    }

    /**
     * Scroll Spy - Highlight Active Section in Navigation
     */
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        console.log('Scroll spy initialized');
    }

    /**
     * Form Validation
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        if (forms.length === 0) return;

        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get all required fields
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;

                // Clear previous error states
                requiredFields.forEach(field => {
                    field.classList.remove('error');
                });

                // Validate each field
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                    }

                    // Email validation
                    if (field.type === 'email' && field.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value.trim())) {
                            field.classList.add('error');
                            isValid = false;
                        }
                    }
                });

                if (isValid) {
                    // Form is valid - submit
                    console.log('Form is valid, submitting...');

                    // Show success message
                    showMessage('Thank you! Your message has been sent.', 'success');

                    // Reset form
                    form.reset();

                    // Here you would typically send the form data to a server
                    // Example: sendFormData(new FormData(form));
                } else {
                    showMessage('Please fill in all required fields correctly.', 'error');
                }
            });

            // Remove error class on input
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            });
        });

        console.log('Form validation initialized');
    }

    /**
     * Show Message (Success/Error)
     */
    function showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;

        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out'
        });

        document.body.appendChild(messageEl);

        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }

    /**
     * Lazy Load Images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (lazyImages.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });

        console.log('Lazy loading initialized');
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // Create back to top button if it doesn't exist
        let backToTopBtn = document.querySelector('.back-to-top');

        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Back to top');

            // Style the button
            Object.assign(backToTopBtn.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '50px',
                height: '50px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                opacity: '0',
                visibility: 'hidden',
                transition: 'all 0.3s ease',
                zIndex: '1000',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            });

            document.body.appendChild(backToTopBtn);
        }

        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('Back to top button initialized');
    }

    /**
     * Initialize all components when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing components...');

        // Initialize mobile menu
        initMobileMenu();

        // Initialize smooth scroll
        initSmoothScroll();

        // Initialize sticky header
        initStickyHeader();

        // Initialize scroll spy
        initScrollSpy();

        // Initialize form validation
        initFormValidation();

        // Initialize lazy loading
        initLazyLoading();

        // Initialize back to top button
        initBackToTop();

        console.log('All components initialized');
    }

    // Start initialization
    init();

})();
