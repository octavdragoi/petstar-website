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
    apiToken: '0885cb94aea2b7c4f3404f4fe31a25082aaa02d408a65cd8c338b41a731ba2568c5e39587d24b1b7cf948c9e247c007189cbcdb14e962d096b9703ce85322da5cf0a68bbc111c565a3d3f0768bcc10417115d68ad0dd63c0fbcbd8e443c6ef41761bef6ed379ba8c416936b312089066ccfc742d7e0acd5c991a6b2bd69dbb2b', // Add your token here: 'your-strapi-api-token-here'
    
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
