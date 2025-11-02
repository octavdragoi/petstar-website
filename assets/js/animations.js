/**
 * Animations JavaScript
 * Handles: WOW.js initialization, GSAP animations, SVG animations, counters
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Initialize WOW.js for scroll-triggered animations
     */
    function initWOW() {
        if (prefersReducedMotion || typeof WOW === 'undefined') {
            console.log('WOW.js skipped due to reduced motion preference or missing library');
            return;
        }

        new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            resetAnimation: false,
            callback: function(box) {
                // Optional: Add callback when animation completes
            }
        }).init();

        console.log('WOW.js initialized');
    }

    /**
     * Initialize GSAP Text Animations
     */
    function initGSAPAnimations() {
        if (prefersReducedMotion || typeof gsap === 'undefined') {
            console.log('GSAP animations skipped');
            return;
        }

        // Register ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Text animation for .text-anim elements
        const textAnimElements = document.querySelectorAll('.text-anim');

        textAnimElements.forEach(element => {
            // Simple fade and slide up animation
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            // If SplitText is available (requires GSAP membership), use it for advanced effects
            if (typeof SplitText !== 'undefined') {
                try {
                    const split = new SplitText(element, {
                        type: "chars,words",
                        charsClass: "char",
                        wordsClass: "word"
                    });

                    gsap.from(split.chars, {
                        duration: 0.8,
                        opacity: 0,
                        y: 50,
                        rotationX: -90,
                        stagger: 0.02,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    });
                } catch(e) {
                    console.log('SplitText not available, using simple animation');
                }
            }
        });

        console.log('GSAP text animations initialized');
    }

    /**
     * Initialize SVG Drawing Animations
     */
    function initSVGAnimations() {
        if (prefersReducedMotion) {
            // If reduced motion, make SVGs immediately visible
            document.querySelectorAll('.svg-animate').forEach(el => {
                el.classList.add('in-view');
            });
            return;
        }

        const svgAnimElements = document.querySelectorAll('.svg-animate');

        if (svgAnimElements.length === 0) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const svgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Unobserve after animation triggers
                    svgObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        svgAnimElements.forEach(el => {
            svgObserver.observe(el);
        });

        console.log('SVG animations initialized');
    }

    /**
     * Initialize Counter Animations (Odometer-like)
     */
    function initCounters() {
        const counters = document.querySelectorAll('.odometer, .stat-number[data-count]');

        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const finalValue = parseInt(counter.getAttribute('data-count') || counter.textContent);

                    animateCounter(counter, 0, finalValue, 2000);

                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            // Set initial value to 0
            if (counter.hasAttribute('data-count')) {
                counter.textContent = '0';
            }
            counterObserver.observe(counter);
        });

        console.log('Counter animations initialized');
    }

    /**
     * Animate Counter from start to end
     */
    function animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    /**
     * Initialize Swiper Carousels
     */
    function initSwipers() {
        if (typeof Swiper === 'undefined') {
            console.log('Swiper not loaded');
            return;
        }

        // Services carousel (if exists)
        const servicesSwiper = document.querySelector('.services-swiper');
        if (servicesSwiper) {
            new Swiper(servicesSwiper, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    }
                }
            });
        }

        // Testimonials carousel (if exists)
        const testimonialsSwiper = document.querySelector('.testimonials-swiper');
        if (testimonialsSwiper) {
            new Swiper(testimonialsSwiper, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    }
                }
            });
        }

        console.log('Swiper carousels initialized');
    }

    /**
     * Parallax Effect for Hero Elements
     */
    function initParallax() {
        if (prefersReducedMotion) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });

        console.log('Parallax effects initialized');
    }

    /**
     * Initialize all animations when DOM is ready
     */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing animations...');

        // Initialize WOW.js (scroll-triggered animations)
        initWOW();

        // Initialize GSAP animations
        initGSAPAnimations();

        // Initialize SVG drawing animations
        initSVGAnimations();

        // Initialize counter animations
        initCounters();

        // Initialize Swiper carousels
        initSwipers();

        // Initialize parallax effects
        initParallax();

        // Add page-loaded class for fade-in effect
        document.body.classList.add('page-loaded');

        console.log('All animations initialized');
    }

    // Start initialization
    init();

})();
