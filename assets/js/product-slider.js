/**
 * PetStar Product Image Slider
 * Reusable image slider component for product pages
 * Based on the same Swiper implementation used in news-loader.js
 */

const ProductSlider = {
    /**
     * Render image slider for a product
     * @param {Array} images - Array of image paths
     * @param {string} productTitle - Product title for alt text
     * @param {Object} options - Optional configuration
     * @returns {string} HTML string for slider or single image
     */
    renderSlider(images, productTitle = 'Product', options = {}) {
        const {
            showNavigation = true,
            autoplay = true,
            autoplayDelay = 5000
        } = options;

        // Validate images array
        const imageArray = Array.isArray(images) ? images : [];

        // If no images or single image, render simple image
        if (imageArray.length === 0 || imageArray.length === 1) {
            const imageUrl = imageArray.length === 1 ? imageArray[0] : 'assets/images/placeholder.jpg';
            return `
                <div class="tj-post-thumb">
                    <img src="${imageUrl}" alt="${productTitle}" style="width: 100%; height: 498px; object-fit: cover;">
                </div>
            `;
        }

        // Multiple images - render as slider
        const slidesHTML = imageArray.map(imagePath => {
            return `
                <div class="swiper-slide">
                    <div class="tj-post-thumb">
                        <img src="${imagePath}" alt="${productTitle}" style="width: 100%; height: 498px; object-fit: cover;">
                    </div>
                </div>
            `;
        }).join('');

        const navigationHTML = showNavigation ? `
            <div class="blog-navigation">
                <div class="slider-prev">
                    <span class="anim-icon">
                        <i class="tji-arrow-left"></i>
                        <i class="tji-arrow-left"></i>
                    </span>
                </div>
                <div class="slider-next">
                    <span class="anim-icon">
                        <i class="tji-arrow-right"></i>
                        <i class="tji-arrow-right"></i>
                    </span>
                </div>
            </div>
        ` : '';

        return `
            <div class="wow fadeInUp" data-wow-delay="0.1s">
                <div class="swiper blog-standard-slider" data-autoplay="${autoplay}" data-autoplay-delay="${autoplayDelay}">
                    <div class="swiper-wrapper">
                        ${slidesHTML}
                    </div>
                    ${navigationHTML}
                </div>
            </div>
        `;
    },

    /**
     * Initialize all product sliders on the page
     * Call this after rendering slider HTML
     */
    initializeSliders() {
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper library not loaded, product sliders will not be initialized');
            return;
        }

        // Wait for DOM to be fully updated
        setTimeout(() => {
            // Initialize all product sliders (using blog-standard-slider class for CSS compatibility)
            const sliders = document.querySelectorAll('.blog-standard-slider');

            if (sliders.length === 0) {
                console.log('No product sliders found to initialize');
                return;
            }

            console.log(`Initializing ${sliders.length} product slider(s)`);

            sliders.forEach((slider) => {
                // Skip if already initialized (has swiper instance)
                if (slider.swiper) {
                    console.log('Slider already initialized, skipping');
                    return;
                }

                const slides = slider.querySelectorAll('.swiper-slide');
                const slideCount = slides.length;

                console.log(`Product slider has ${slideCount} slides`);

                // Only enable loop if there are more than 2 slides
                const enableLoop = slideCount > 2;

                // Get autoplay settings from data attributes
                const autoplayEnabled = slider.dataset.autoplay === 'true';
                const autoplayDelay = parseInt(slider.dataset.autoplayDelay) || 5000;

                const swiperConfig = {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: enableLoop,
                    navigation: {
                        nextEl: slider.querySelector('.slider-next'),
                        prevEl: slider.querySelector('.slider-prev'),
                    }
                };

                // Add autoplay if enabled
                if (autoplayEnabled) {
                    swiperConfig.autoplay = {
                        delay: autoplayDelay,
                        disableOnInteraction: false,
                    };
                }

                new Swiper(slider, swiperConfig);

                console.log('Product slider initialized with loop:', enableLoop, 'autoplay:', autoplayEnabled);
            });
        }, 100); // Small delay to ensure DOM is ready
    },

    /**
     * Render slider in a specific container
     * @param {string} containerId - ID of the container element
     * @param {Array} images - Array of image paths
     * @param {string} productTitle - Product title for alt text
     * @param {Object} options - Optional configuration
     */
    renderInContainer(containerId, images, productTitle, options = {}) {
        console.log('ProductSlider.renderInContainer called with:', {
            containerId,
            images,
            productTitle,
            options
        });

        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        console.log('Container found:', container);

        // Generate and insert slider HTML
        const sliderHTML = this.renderSlider(images, productTitle, options);
        console.log('Generated slider HTML:', sliderHTML.substring(0, 200) + '...');
        container.innerHTML = sliderHTML;

        console.log('Slider HTML inserted into container');

        // Initialize the slider
        this.initializeSliders();

        // Reinitialize WOW.js if available
        if (typeof WOW !== 'undefined') {
            console.log('Reinitializing WOW.js');
            new WOW().init();
        }
    }
};

// Make ProductSlider globally available
window.ProductSlider = ProductSlider;
