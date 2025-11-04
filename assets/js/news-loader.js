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
     * @returns {Promise<Array>} Array of articles
     */
    async getArticles(limit = null, featured = false) {
        // Use config defaults if not specified
        if (limit === null && typeof PetStarConfig !== 'undefined') {
            limit = PetStarConfig.news.homepageLimit;
        } else if (limit === null) {
            limit = 3; // Fallback if config not loaded
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
                const url = firstImage.url;
                
                // If URL is absolute, return as-is
                if (url.startsWith('http')) {
                    return url;
                }
                
                // If relative, prepend Strapi URL
                return `${this.apiUrl.replace('/api', '')}${url}`;
            }
        }
        
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
        
        const articlesHTML = articles.map((article, index) => {
            const { title, excerpt, slug, publishedAt, images, category } = article;
            const imageUrl = this.getImageUrl(images);
            const date = this.formatDate(publishedAt);
            const truncatedExcerpt = this.truncate(excerpt);
            
            return `
                <div class="blog-item wow fadeInUp" data-wow-delay="0.${index + 1}s">
                    <div class="blog-images hover:shine">
                        <a href="news-details.html?slug=${slug}">
                            <img src="${imageUrl}" alt="${title}" />
                        </a>
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <ul>
                                ${category ? `<li class="category"><a href="news.html">${category}</a></li>` : ''}
                                <li>${date}</li>
                            </ul>
                        </div>
                        <h4 class="blog-title">
                            <a href="news-details.html?slug=${slug}">${title}</a>
                        </h4>
                        ${truncatedExcerpt ? `<div class="desc">${truncatedExcerpt}</div>` : ''}
                        <a class="blog-button text-btn" href="news-details.html?slug=${slug}">
                            Read more <i class="tji-arrow-right"></i>
                        </a>
                        <div class="blog-meta meta-2 mb-0">
                            <ul>
                                <li>${date}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = articlesHTML;
        
        // Reinitialize WOW.js for new elements if available
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
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
        
        await this.renderNewsSection(containerId, limit);
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
                        Back to News <i class="fa-regular fa-arrow-left"></i>
                    </a>
                </div>
            `;
            return;
        }
        
        const { title, content, publishedAt, author, images, category } = article;
        const imageUrl = this.getImageUrl(images);
        const date = this.formatDate(publishedAt);
        const htmlContent = this.convertContentToHtml(content);
        
        // Update page title
        document.title = `${title} - PetStar News`;
        
        container.innerHTML = `
            <article class="blog-details-content">
                <div class="blog-details-image">
                    <img src="${imageUrl}" alt="${title}" />
                </div>
                <div class="blog-details-meta">
                    <ul>
                        <li><i class="fa-light fa-calendar-days"></i> ${date}</li>
                        ${author ? `<li><i class="fa-light fa-user"></i> ${author}</li>` : ''}
                        ${category ? `<li><i class="fa-light fa-tag"></i> ${category}</li>` : ''}
                    </ul>
                </div>
                <h2 class="title">${title}</h2>
                <div class="blog-details-text">
                    ${htmlContent}
                </div>
                <div class="blog-details-footer">
                    <a href="news.html" class="tj-primary-btn">
                        <i class="fa-regular fa-arrow-left"></i> Back to News
                    </a>
                </div>
            </article>
        `;
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
