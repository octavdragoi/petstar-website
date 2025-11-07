/**
 * PetStar News Loader
 * Fetches articles from Strapi CMS and displays them
 */

const NewsLoader = {
    apiUrl: null, // Will be set from config.js
    apiToken: null, // Will be set from config.js if provided
    
    /**
     * Get fetch headers with authorization if token is set
     * @returns {Object} Headers object
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.apiToken) {
            headers['Authorization'] = `Bearer ${this.apiToken}`;
        }
        
        return headers;
    },
    
    /**
     * Fetch all articles
     * @param {number} limit - Number of articles to fetch
     * @param {boolean} featured - Fetch only featured articles
     * @param {string} language - Filter by language ('ro', 'en', or null for all)
     * @returns {Promise<Array>} Array of articles
     */
    async getArticles(limit = null, featured = false, language = null) {
        // Use config defaults if not specified
        if (limit === null && typeof PetStarConfig !== 'undefined') {
            limit = PetStarConfig.news.homepageLimit;
        } else if (limit === null) {
            limit = 3; // Fallback if config not loaded
        }

        // Use default language from config if not specified
        if (language === null && typeof PetStarConfig !== 'undefined') {
            language = PetStarConfig.news.defaultLanguage || 'ro';
        } else if (language === null) {
            language = 'ro'; // Fallback
        }

        try {
            const params = new URLSearchParams({
                'pagination[limit]': limit,
                'sort[0]': 'publishedAt:desc',
                'populate': '*'
            });

            if (featured) {
                params.append('filters[featured][$eq]', 'true');
            }

            if (language) {
                params.append('filters[language][$eq]', language);
            }
            
            const response = await fetch(`${this.apiUrl}/articles?${params}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    },
    
    /**
     * Fetch single article by slug
     * @param {string} slug - Article slug
     * @returns {Promise<Object|null>} Article object or null
     */
    async getArticle(slug) {
        try {
            const params = new URLSearchParams({
                'filters[slug][$eq]': slug,
                'populate': '*'
            });
            
            const response = await fetch(`${this.apiUrl}/articles?${params}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data[0] || null;
        } catch (error) {
            console.error('Error fetching article:', error);
            return null;
        }
    },
    
    /**
     * Get image URL from Strapi media object
     * @param {Object} images - Strapi media object (images array in v5)
     * @returns {string} Image URL
     */
    getImageUrl(images) {
        // Get default image path from config or use fallback
        const defaultImage = typeof PetStarConfig !== 'undefined' && PetStarConfig.news.defaultImage
            ? PetStarConfig.news.defaultImage
            : 'assets/images/news/default.jpg';

        // Handle flat array (Strapi v5 format) - get first image
        if (Array.isArray(images) && images.length > 0) {
            const firstImage = images[0];
            if (firstImage?.url) {
                let url = firstImage.url;
                console.log('📸 Original image URL from API:', url);

                // Fix malformed absolute URLs (e.g., https://.domain.com)
                if (url.startsWith('http') && url.includes('://.')) {
                    console.warn('⚠️ Malformed image URL detected:', url);
                    // Extract the path portion and treat as relative
                    url = url.replace(/^https?:\/\/[^/]*/, '');
                    console.log('🔧 Fixed to relative URL:', url);
                }

                // If URL is absolute and well-formed, return as-is
                if (url.startsWith('http')) {
                    console.log('✅ Using absolute URL as-is:', url);
                    return url;
                }

                // If relative, prepend Strapi URL
                const baseUrl = this.apiUrl.replace(/\/api$/, '');
                const finalUrl = `${baseUrl}${url}`;
                console.log('🔗 Constructed URL:', {
                    apiUrl: this.apiUrl,
                    baseUrl: baseUrl,
                    relativeUrl: url,
                    finalUrl: finalUrl
                });
                return finalUrl;
            }
        }

        console.log('⚠️ No valid image found, using default:', defaultImage);
        return defaultImage;
    },
    
    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @param {string} locale - Locale for formatting
     * @returns {string} Formatted date
     */
    formatDate(dateString, locale = 'en-US') {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, length = null) {
        // Use config default if not specified
        if (length === null && typeof PetStarConfig !== 'undefined') {
            length = PetStarConfig.news.excerptLength;
        } else if (length === null) {
            length = 150; // Fallback if config not loaded
        }
        
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    },
    
    /**
     * Render images for an article (single image or slider for multiple images)
     * @param {Array} images - Array of image objects from Strapi
     * @param {string} title - Article title for alt text
     * @param {Object} dateObj - Date object for badge overlay
     * @returns {string} HTML string for image(s)
     */
    renderImages(images, title, dateObj) {
        const dateDay = dateObj ? dateObj.toLocaleString('en-US', { day: '2-digit' }) : '';
        const dateMonth = dateObj ? dateObj.toLocaleString('en-US', { month: 'short' }) : '';

        // Handle array of images (Strapi v5 format)
        const imageArray = Array.isArray(images) ? images : [];

        // If no images or single image, render simple image
        if (!imageArray || imageArray.length === 0 || imageArray.length === 1) {
            const imageUrl = this.getImageUrl(images);
            return `
                <div class="tj-post-thumb">
                    <img src="${imageUrl}" alt="${title || 'News image'}" style="width: 100%; height: auto; object-fit: cover;">
                    ${(dateDay && dateMonth) ? `
                    <div class="tj-post-date">
                        <span class="date">${dateDay}</span>
                        <span class="month">${dateMonth}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        }

        // Multiple images - render as slider
        const slidesHTML = imageArray.map(image => {
            const imageUrl = image?.url ?
                (image.url.startsWith('http') ? image.url : `${this.apiUrl.replace(/\/api$/, '')}${image.url}`)
                : 'assets/images/news/default.jpg';

            return `
                <div class="swiper-slide">
                    <div class="tj-post-thumb">
                        <img src="${imageUrl}" alt="${title || 'News image'}" style="width: 100%; height: auto; object-fit: cover;">
                        ${(dateDay && dateMonth) ? `
                        <div class="tj-post-date">
                            <span class="date">${dateDay}</span>
                            <span class="month">${dateMonth}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="swiper blog-standard-slider">
                <div class="swiper-wrapper">
                    ${slidesHTML}
                </div>
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
            </div>
        `;
    },

    /**
     * Render a single article card
     * @param {Object} article - Article object from Strapi
     * @param {number} index - Index for animation delay
     * @param {Object} options - Rendering options
     * @returns {string} HTML string for article card
     */
    renderArticleCard(article, index = 0, options = {}) {
        const {
            excerptLength = null,
            showComments = true,
            showFullDate = false
        } = options;

        const { title, excerpt, slug, publishedAt, images, category } = article;
        const dateObj = publishedAt ? new Date(publishedAt) : null;
        const formattedDate = publishedAt ? this.formatDate(publishedAt) : '';
        const truncatedExcerpt = this.truncate(excerpt, excerptLength);
        const categoryLabel = typeof category === 'string'
            ? category
            : (category && typeof category === 'object' && category.name) ? category.name : 'News';
        const detailsUrl = slug ? `news-details.html?slug=${slug}` : 'news.html';

        // Calculate delay for staggered animation
        const delay = `0.${(index % 3) + 1}s`;

        // Render images (single or slider)
        const imagesHTML = this.renderImages(images, title, dateObj);

        return `
            <article class="tj-post-item wow fadeInUp" data-wow-delay="${delay}">
                ${imagesHTML}
                <div class="tj-post-content">
                    <div class="tj-post-meta">
                        <ul>
                            <li>
                                <a href="news.html">${categoryLabel}</a>
                            </li>
                            ${showComments ? `
                            <li>
                                <span>No Comments</span>
                            </li>
                            ` : ''}
                            ${showFullDate && formattedDate ? `
                            <li>
                                <span>${formattedDate}</span>
                            </li>
                            ` : ''}
                        </ul>
                    </div>
                    <h3 class="tj-post-title">
                        <a href="${detailsUrl}">
                            ${title || 'Untitled Article'}
                        </a>
                    </h3>
                    ${truncatedExcerpt ? `<div class="tj-post-excerpt">${truncatedExcerpt}</div>` : ''}
                    <div class="tj-post-btn">
                        <a href="${detailsUrl}" class="tj-primary-btn">
                            <div class="btn_inner">
                                <div class="btn_icon">
                                    <span>
                                        <i class="tji-arrow-right"></i>
                                        <i class="tji-arrow-right"></i>
                                    </span>
                                </div>
                                <div class="btn_text"><span>Read more</span></div>
                            </div>
                        </a>
                    </div>
                </div>
            </article>
        `;
    },

    /**
     * Convert Strapi rich text content to HTML
     * @param {Array|string} content - Strapi rich text content array or plain text
     * @returns {string} HTML string
     */
    convertContentToHtml(content) {
        // If content is already a string, return it
        if (typeof content === 'string') {
            return content;
        }
        
        // If content is not an array, return empty string
        if (!Array.isArray(content)) {
            return '';
        }
        
        // Convert rich text blocks to HTML
        return content.map(block => {
            if (block.type === 'paragraph') {
                const text = block.children?.map(child => child.text || '').join('') || '';
                return `<p>${text}</p>`;
            }
            if (block.type === 'heading') {
                const level = block.level || 2;
                const text = block.children?.map(child => child.text || '').join('') || '';
                return `<h${level}>${text}</h${level}>`;
            }
            if (block.type === 'list') {
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const items = block.children?.map(item => {
                    const text = item.children?.map(child => child.text || '').join('') || '';
                    return `<li>${text}</li>`;
                }).join('') || '';
                return `<${tag}>${items}</${tag}>`;
            }
            // Fallback for unknown types
            return '';
        }).join('');
    },
    
    /*
     * Render articles in homepage news section
     * @param {string} containerId - ID of container element
     * @param {number} limit - Number of articles to display
     */
    async renderNewsSection(containerId = 'news-container', limit = null) {
        // Use config default if not specified
        if (limit === null && typeof PetStarConfig !== 'undefined') {
            limit = PetStarConfig.news.homepageLimit;
        } else if (limit === null) {
            limit = 3; // Fallback
        }

        const articles = await this.getArticles(limit);
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>No articles available at the moment.</p>
                </div>
            `;
            return;
        }

        // Use the shared renderArticleCard method
        const articlesHTML = articles.map((article, index) => {
            return this.renderArticleCard(article, index, {
                showComments: false,
                showFullDate: true
            });
        }).join('');

        container.innerHTML = articlesHTML;

        // Reinitialize WOW.js for new elements if available
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        // Initialize Swiper sliders for articles with multiple images
        this.initializeSliders();
    },
    
    /**
     * Render all articles on news listing page
     * @param {string} containerId - ID of container element
     * @param {number} limit - Number of articles to display
     */
    async renderNewsListing(containerId = 'news-container', limit = null) {
        // Use config default if not specified
        if (limit === null && typeof PetStarConfig !== 'undefined') {
            limit = PetStarConfig.news.listingPageLimit;
        } else if (limit === null) {
            limit = 20; // Fallback
        }

        const articles = await this.getArticles(limit);
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>No articles available at the moment.</p>
                </div>
            `;
            return;
        }

        // Use the shared renderArticleCard method with longer excerpt
        const articlesHTML = articles.map((article, index) => {
            return this.renderArticleCard(article, index, {
                excerptLength: 200,
                showComments: true,
                showFullDate: false
            });
        }).join('');

        // Add pagination if there are many articles
        const paginationHTML = articles.length > 5 ? `
            <div class="tj-pagination">
                <ul>
                    <li>
                        <span aria-current="page" class="page-numbers current">01</span>
                    </li>
                    <li>
                        <a class="page-numbers" href="#">02</a>
                    </li>
                    <li>
                        <a class="next page-numbers" href="#"><i class="tji-arrow-right"></i></a>
                    </li>
                </ul>
            </div>
        ` : '';

        container.innerHTML = articlesHTML + paginationHTML;

        // Reinitialize WOW.js for new elements if available
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        // Initialize Swiper sliders for articles with multiple images
        this.initializeSliders();

        // Load recent posts in sidebar
        this.renderRecentPosts();
    },
    
    /**
     * Initialize Swiper sliders for articles with multiple images
     */
    initializeSliders() {
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper library not loaded, sliders will not be initialized');
            return;
        }

        // Wait for DOM to be fully updated
        setTimeout(() => {
            // Initialize all blog standard sliders
            const sliders = document.querySelectorAll('.blog-standard-slider');

            if (sliders.length === 0) {
                console.log('No sliders found to initialize');
                return;
            }

            console.log(`Initializing ${sliders.length} slider(s)`);

            sliders.forEach((slider) => {
                const slides = slider.querySelectorAll('.swiper-slide');
                const slideCount = slides.length;

                console.log(`Slider has ${slideCount} slides`);

                // Only enable loop if there are more than 2 slides
                const enableLoop = slideCount > 2;

                new Swiper(slider, {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: enableLoop,
                    navigation: {
                        nextEl: slider.querySelector('.slider-next'),
                        prevEl: slider.querySelector('.slider-prev'),
                    },
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                });

                console.log('Slider initialized with loop:', enableLoop);
            });
        }, 100); // Small delay to ensure DOM is ready
    },

    /**
     * Render recent posts in sidebar
     * @param {string} containerId - ID of container element
     * @param {number} limit - Number of recent posts to display
     */
    async renderRecentPosts(containerId = 'recent-posts', limit = 3) {
        const articles = await this.getArticles(limit);
        const container = document.getElementById(containerId);

        if (!container) {
            console.log(`Recent posts container #${containerId} not found, skipping...`);
            return;
        }

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="single-post d-flex align-items-center">
                    <div class="content">
                        <h6><a href="news.html">No recent posts available</a></h6>
                    </div>
                </div>
            `;
            return;
        }

        const recentPostsHTML = articles.map(article => {
            const { title, slug, publishedAt, images } = article;
            const imageUrl = this.getImageUrl(images);
            const date = publishedAt ? this.formatDate(publishedAt) : '';
            const detailsUrl = slug ? `news-details.html?slug=${slug}` : 'news.html';
            const truncatedTitle = this.truncate(title, 60);

            return `
                <div class="single-post d-flex align-items-center">
                    <div class="post-image">
                        <a href="${detailsUrl}"><img src="${imageUrl}" alt="${title || 'News image'}"></a>
                    </div>
                    <div class="post-header">
                        <h6 class="title-link">
                            <a href="${detailsUrl}">${truncatedTitle}...</a>
                        </h6>
                        <span class="date">${date}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = recentPostsHTML;
    },

    /**
     * Render article post HTML following template structure
     * @param {Object} article - Article object from Strapi
     * @returns {string} HTML string for article post
     */
    renderArticlePost(article) {
        const { title, content, publishedAt, author, images, category, tags } = article;
        const imageUrl = this.getImageUrl(images);
        const formattedDate = this.formatDate(publishedAt);
        const htmlContent = this.convertContentToHtml(content);

        // Format category
        const categoryLabel = typeof category === 'string'
            ? category
            : (category && typeof category === 'object' && category.name) ? category.name : 'News';

        // Format tags
        const tagsArray = Array.isArray(tags) ? tags :
                         (tags && typeof tags === 'string') ? tags.split(',').map(t => t.trim()) :
                         [];

        const tagsHTML = tagsArray.length > 0 ? tagsArray.map(tag =>
            `<a href="news.html">${tag}</a>`
        ).join('') : '<a href="news.html">PET Recycling</a><a href="news.html">Sustainability</a>';

        return `
            <article class="tj-post-single-post">
                <div class="tj-post-thumb hover:shine wow fadeInUp" data-wow-delay="0.1s">
                    <img src="${imageUrl}" alt="${title || 'News image'}">
                </div>
                <h3 class="tj-post-title text-anim">
                    ${title || 'Untitled Article'}
                </h3>
                <div class="blog-category-two wow fadeInUp" data-wow-delay="0.3s">
                    <div class="category-item">
                        <div class="cate-icons">
                            <i class="tji-tag"></i>
                        </div>
                        <div class="cate-text">
                            <span class="degination">Category</span>
                            <h6 class="title"><a href="news.html">${categoryLabel}</a></h6>
                        </div>
                    </div>
                    <div class="category-item">
                        <div class="cate-icons">
                            <i class="tji-calender"></i>
                        </div>
                        <div class="cate-text">
                            <span class="degination">Date Released</span>
                            <h6 class="text">${formattedDate}</h6>
                        </div>
                    </div>
                    ${author ? `
                    <div class="category-item">
                        <div class="cate-icons">
                            <i class="tji-user"></i>
                        </div>
                        <div class="cate-text">
                            <span class="degination">Authored by</span>
                            <h6 class="title">${author}</h6>
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="tj-entry-content">
                    ${htmlContent}
                </div>
            </article>

            <!-- Post tag and share -->
            <div class="tj-post-details_tags_share wow fadeInUp" data-wow-delay="0.1s">
                <div class="tj-tags tagcloud">
                    <span class="tag__title">Tags:</span>
                    ${tagsHTML}
                </div>
                <div class="tj-socials_share">
                    <span class="tag__title">Share:</span>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" title="Facebook" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}" title="Twitter" target="_blank"><i class="fab fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" title="LinkedIn" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
            </div>

            <!-- Post navigation -->
            <div class="tj-post__navigation wow fadeInUp" data-wow-delay="0.3s">
                <div class="tj-nav__post previous">
                    <div class="tj-nav-post__nav prev_post">
                        <a href="news.html"><span><i class="tji-arrow-left"></i></span>Previous</a>
                    </div>
                </div>
                <div class="tj-nav-post__grid">
                    <i class="tji-square-cube"></i>
                </div>
                <div class="tj-nav__post next">
                    <div class="tj-nav-post__nav next_post">
                        <a href="news.html">Next<span><i class="tji-arrow-right"></i></span></a>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render single article on details page
     * @param {string} containerId - ID of container element
     */
    async renderArticleDetails(containerId = 'article-container') {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        if (!slug) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <p>No article specified. <a href="news.html">Return to news listing</a></p>
                </div>
            `;
            return;
        }

        // Show loading state
        container.innerHTML = '<div class="text-center"><p>Loading article...</p></div>';

        const article = await this.getArticle(slug);

        if (!article) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Article Not Found</h4>
                    <p>The article you're looking for doesn't exist or has been removed.</p>
                    <a href="news.html" class="tj-primary-btn">
                        <div class="btn_inner">
                            <div class="btn_icon">
                                <span>
                                    <i class="tji-arrow-left"></i>
                                    <i class="tji-arrow-left"></i>
                                </span>
                            </div>
                            <div class="btn_text"><span>Back to News</span></div>
                        </div>
                    </a>
                </div>
            `;
            return;
        }

        const { title } = article;

        // Update page title
        document.title = `${title} - PetStar News`;

        // Update breadcrumb page title if element exists
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = title;
        }

        // Render article using the new function
        container.innerHTML = this.renderArticlePost(article);

        // Reinitialize WOW.js for new elements if available
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        // Load recent posts in sidebar
        this.renderRecentPosts();

        // Reinitialize animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    },
    
    /**
     * Set API URL (useful for development/production environments)
     * @param {string} url - Strapi API URL
     */
    setApiUrl(url) {
        this.apiUrl = url.endsWith('/api') ? url : `${url}/api`;
    },
    
    /**
     * Set API Token for authenticated requests
     * @param {string} token - Strapi API Token
     */
    setApiToken(token) {
        this.apiToken = token;
    }
};

// Make NewsLoader globally available
window.NewsLoader = NewsLoader;

// Initialize with config if it's already loaded
if (typeof initializeNewsLoader === 'function') {
    initializeNewsLoader();
}
