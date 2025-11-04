/**
 * PetStar Website Configuration
 * Update these values for your environment
 */

const PetStarConfig = {
    // Strapi CMS API URL
    // Development: 'http://localhost:1337/api'
    // Production: 'https://api.petstar.com/api'
    // apiUrl: 'https://api.petstar.com/api',
    apiUrl: 'http://localhost:1337/api',
    
    // Strapi API Token (required for authenticated requests)
    // Get this from: Strapi Admin → Settings → API Tokens → Create new API Token
    // Token type: Read-only (recommended) or Full access
    // Leave empty if API is public (not recommended for production)
    apiToken: 'e55fb3cd7fbcf3c5d65c6be838cfc6b0fcb934fb2cb3d5c8fb16b5f3d6d1a62f3bd1c7254843d2cddf00ec42d994f51411420b901bdb52d1024ababbe4ff41f5c0454d6a4a1e83ba732239c29b16cb3fe0262deb705083ec122ae8506e5c36a679fc82e95778ad42afba6593afb7c93eef5c32beb5bc159b89d6b47527ea9eee', // Add your token here: 'your-strapi-api-token-here'
    
    // Default language
    defaultLanguage: 'ro',
    
    // Available languages
    availableLanguages: ['en', 'ro'],
    
    // News settings
    news: {
        homepageLimit: 3,        // Number of articles on homepage
        listingPageLimit: 20,    // Number of articles on news listing page
        excerptLength: 120,      // Max length for article excerpts
        defaultImage: 'assets/images/news/default.jpg'  // Default image when article has no featured image
    }
};

// Make config globally available first
window.PetStarConfig = PetStarConfig;

// Initialize NewsLoader when it becomes available
// This will be called after news-loader.js is loaded
function initializeNewsLoader() {
    if (typeof NewsLoader !== 'undefined') {
        NewsLoader.setApiUrl(PetStarConfig.apiUrl);
        if (PetStarConfig.apiToken) {
            NewsLoader.setApiToken(PetStarConfig.apiToken);
        }
        console.log('NewsLoader initialized with API:', NewsLoader.apiUrl);
    }
}

// Try to initialize immediately (in case news-loader.js is already loaded)
initializeNewsLoader();
