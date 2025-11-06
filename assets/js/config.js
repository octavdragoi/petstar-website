/**
 * PetStar Website Configuration
 * Update these values for your environment
 */

const PetStarConfig = {
    // Strapi CMS API URL
    // Development: 'http://localhost:1337/api'
    // Production: 'https://api.petstar.com/api'
    apiUrl: 'https://api.petstar-dash.ro/api',
    
    // Strapi API Token (required for authenticated requests)
    // Get this from: Strapi Admin → Settings → API Tokens → Create new API Token
    // Token type: Read-only (recommended) or Full access
    // Leave empty if API is public (not recommended for production)
    apiToken: 'cc6fa8b6888081c1bbf0813ee324d880ed08c256609703df8fe5eb670854bd4ad53d718874a26ec50cea7c68c8c6aaa55011cd8949f724975d074195682eaf0040db2d12deb48b9312f936f1d9638c233d99bbade480f2c7d1453fd7a5885a3db47b85fc9ff31b822e8298d57eca1927eb23a29af2b57e0dffa707bb0124e7b9', // Add your token here: 'your-strapi-api-token-here'
    
    // Default language
    defaultLanguage: 'ro',
    
    // Available languages
    availableLanguages: ['en', 'ro'],
    
    // News settings
    news: {
        homepageLimit: 3,        // Number of articles on homepage
        listingPageLimit: 20,    // Number of articles on news listing page
        excerptLength: 120,      // Max length for article excerpts
        defaultImage: 'assets/images/news/default.jpg',  // Default image when article has no featured image
        defaultLanguage: 'ro'    // Default language for articles
    }
};

// Make config globally available first
window.PetStarConfig = PetStarConfig;

// Initialize NewsLoader when it becomes available
// This will be called after news-loader.js is loaded
function initializeNewsLoader() {
    if (typeof NewsLoader !== 'undefined') {
        console.log('🔧 Initializing NewsLoader with config:', PetStarConfig.apiUrl);
        NewsLoader.setApiUrl(PetStarConfig.apiUrl);
        if (PetStarConfig.apiToken) {
            NewsLoader.setApiToken(PetStarConfig.apiToken);
        }
        console.log('✅ NewsLoader initialized. API URL:', NewsLoader.apiUrl);
        console.log('✅ API Token set:', NewsLoader.apiToken ? 'Yes' : 'No');
    } else {
        console.warn('⚠️ NewsLoader not yet available');
    }
}

// Try to initialize immediately (in case news-loader.js is already loaded)
console.log('📝 Config loaded. API URL:', PetStarConfig.apiUrl);
initializeNewsLoader();

// Also try after a short delay to ensure news-loader.js has loaded
setTimeout(initializeNewsLoader, 100);
