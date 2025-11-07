/**
 * PetStar Blog Loader
 * Extends NewsLoader for blog-style rendering (blog template structure)
 *
 * This loader reuses NewsLoader's data fetching and utility methods
 * but overrides the presentation layer to render articles with blog template styling.
 */

const BlogLoader = {
    // Inherit all NewsLoader properties and methods
    ...NewsLoader,

    /**
     * Render images for blog template (overrides NewsLoader.renderImages)
     * Blog template uses: blog-images wrapper, link wrapper, no date badge
     *
     * @param {Array} images - Strapi images array
     * @param {String} title - Image alt text
     * @param {String} slug - Article slug for link
     * @returns {String} HTML for blog-style image
     */
    renderImages(images, title, slug) {
        const imageUrl = this.getImageUrl(images);
        const detailsUrl = slug ? `news-details.html?slug=${slug}` : 'news.html';

        return `
            <div class="blog-images hover:shine">
                <a href="${detailsUrl}">
                    <img src="${imageUrl}" alt="${title || 'Blog image'}">
                </a>
            </div>
        `;
    },

    /**
     * Render a single article card for blog template (overrides NewsLoader.renderArticleCard)
     * Blog template structure: blog-item, blog-content, blog-title, desc, blog-button text-btn
     *
     * @param {Object} article - Article data from Strapi
     * @param {Number} index - Article index for animation delay
     * @param {Object} options - Rendering options
     * @returns {String} HTML for blog-style article card
     */
    renderBlogCard(article, index = 0, options = {}) {
        const {
            excerptLength = 120,
            showComments = true,
            showFullDate = true
        } = options;

        const { title, excerpt, slug, publishedAt, images, category } = article;
        const formattedDate = publishedAt ? this.formatDate(publishedAt) : '';
        const truncatedExcerpt = excerpt ? this.truncate(excerpt, excerptLength) : '';

        // Extract category label
        const categoryLabel = typeof category === 'string'
            ? category
            : (category && typeof category === 'object' && category.name) ? category.name : 'News';

        const detailsUrl = slug ? `news-details.html?slug=${slug}` : 'news.html';

        // Calculate delay for staggered animation (0.1s, 0.3s, 0.5s, 0.7s)
        const delayIndex = (index % 4) + 1;
        const delay = `0.${delayIndex}s`;

        // Render images (blog style - with link wrapper, no date badge)
        const imagesHTML = this.renderImages(images, title, slug);

        return `
            <div class="blog-item wow fadeInUp" data-wow-delay="${delay}">
                ${imagesHTML}
                <div class="blog-content">
                    <div class="blog-meta">
                        <ul>
                            <li class="category"><a href="news.html">${categoryLabel}</a></li>
                            ${showFullDate && formattedDate ? `<li>${formattedDate}</li>` : ''}
                            ${showComments ? `<li>02 Comments</li>` : ''}
                        </ul>
                    </div>
                    <h4 class="blog-title">
                        <a href="${detailsUrl}">${title || 'Untitled Article'}</a>
                    </h4>
                    ${truncatedExcerpt ? `<div class="desc">${truncatedExcerpt}</div>` : ''}
                    <a class="blog-button text-btn" href="${detailsUrl}">
                        Read more <i class="tji-arrow-right"></i>
                    </a>
                    <div class="blog-meta meta-2 mb-0">
                        <ul>
                            ${showFullDate && formattedDate ? `<li>${formattedDate}</li>` : ''}
                            ${showComments ? `<li>02 Comments</li>` : ''}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render blog section for homepage
     * Wraps blog cards in blog-wrapper as per template structure
     *
     * @param {String} containerId - ID of container element
     * @param {Number} limit - Number of articles to display (default: 4 for blog section)
     * @returns {Promise<void>}
     */
    async renderBlogSection(containerId = 'blog-container', limit = null) {
        // Use config default if not specified
        if (limit === null && typeof PetStarConfig !== 'undefined') {
            limit = PetStarConfig.news.homepageLimit || 4;
        } else if (limit === null) {
            limit = 4; // Blog sections typically show 4 articles
        }

        const articles = await this.getArticles(limit);
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`BlogLoader: Container #${containerId} not found`);
            return;
        }

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="blog-wrapper">
                    <div class="blog-item">
                        <div class="blog-content">
                            <p>No articles available at the moment.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Render all article cards using blog template
        const articlesHTML = articles.map((article, index) => {
            return this.renderBlogCard(article, index, {
                showComments: true,
                showFullDate: true,
                excerptLength: 120
            });
        }).join('');

        // Wrap in blog-wrapper as per template structure
        container.innerHTML = `<div class="blog-wrapper">${articlesHTML}</div>`;

        // Reinitialize WOW.js animations for new elements
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }

        console.log(`BlogLoader: Rendered ${articles.length} articles in blog style`);
    }
};

// Make BlogLoader globally available
window.BlogLoader = BlogLoader;

// Initialize with config if it's already loaded
if (typeof PetStarConfig !== 'undefined') {
    BlogLoader.setApiUrl(PetStarConfig.apiUrl);
    if (PetStarConfig.apiToken) {
        BlogLoader.setApiToken(PetStarConfig.apiToken);
    }
    console.log('BlogLoader initialized with PetStarConfig');
}
