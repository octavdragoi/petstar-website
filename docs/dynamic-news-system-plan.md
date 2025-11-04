# DYNAMIC NEWS SYSTEM - IMPLEMENTATION PLAN

## OVERVIEW

This document outlines how to add a dynamic admin system for managing news articles to the currently static PetStar website. The solution maintains your existing frontend while adding a backend for content management.

---

## PROBLEM STATEMENT

**Current State:**
- Static HTML website with jQuery-based section loading
- News section (Section 10) needs to display dynamic articles
- No way for admins to add/edit/delete news posts without editing HTML

**Desired State:**
- Admin panel to create/edit/delete news articles
- News articles stored in a database
- Frontend fetches and displays articles dynamically
- Maintain existing template design and animations

---

## RECOMMENDED ARCHITECTURE OPTIONS

### OPTION 1: Headless CMS (Recommended for Non-Developers) ⭐

**Stack:**
- Frontend: Keep current HTML/CSS/JS (static)
- Backend: Headless CMS (Strapi, Directus, or Sanity)
- Database: Built-in (PostgreSQL/SQLite)
- Hosting: Frontend on static host, CMS on VPS/cloud

**How It Works:**
```
Admin → Headless CMS Admin Panel → Database
Frontend → API Request → CMS API → JSON Response → Display
```

**Pros:**
- ✅ No backend coding required
- ✅ Built-in admin panel (rich text editor, media management)
- ✅ RESTful API auto-generated
- ✅ User authentication built-in
- ✅ File upload management included
- ✅ Can keep 95% of your existing code

**Cons:**
- ❌ Requires separate hosting for CMS
- ❌ Monthly costs (~$5-20/month)
- ❌ Learning curve for CMS configuration

**Best For:** Teams without backend developers, quick deployment

---

## DETAILED IMPLEMENTATION: OPTION 1 (Headless CMS)

### Recommended CMS: Strapi (Open Source)

**Why Strapi:**
- Free and open source
- Easy to set up
- Great admin UI
- Customizable
- Active community
- RESTful + GraphQL API

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (Static - Current Setup)             │
│  ┌──────────────────────────────────────┐      │
│  │  index.html (existing)               │      │
│  │  sections/section-10-news.html       │      │
│  │  assets/js/news-loader.js (NEW)      │      │
│  └──────────────────────────────────────┘      │
│              │                                   │
│              │ HTTP GET /api/articles           │
│              ↓                                   │
└─────────────────────────────────────────────────┘
               │
               │ JSON Response
               ↓
┌─────────────────────────────────────────────────┐
│  BACKEND (Strapi CMS on VPS)                    │
│  ┌──────────────────────────────────────┐      │
│  │  Strapi Admin Panel                  │      │
│  │  (http://admin.petstar.com)          │      │
│  │  - Create articles                    │      │
│  │  - Upload images                      │      │
│  │  - Manage users                       │      │
│  └──────────────────────────────────────┘      │
│              │                                   │
│              ↓                                   │
│  ┌──────────────────────────────────────┐      │
│  │  PostgreSQL Database                 │      │
│  │  - articles table                     │      │
│  │  - media table                        │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

### Step-by-Step Implementation

#### PHASE 1: Set Up Strapi Backend

**1. Install Strapi on Server**
```bash
# On your VPS (e.g., DigitalOcean, Linode, Hetzner)
npx create-strapi-app@latest petstar-cms --quickstart

# Or with custom database
npx create-strapi-app@latest petstar-cms \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=petstar \
  --dbusername=postgres \
  --dbpassword=yourpassword
```

**2. Create Content Type: Article**

In Strapi Admin Panel (http://localhost:1337/admin):
- Go to Content-Type Builder
- Create Collection Type: `article`
- Add fields:
  - `title` (Text, required)
  - `slug` (UID, required, from title)
  - `excerpt` (Text, max 200 chars)
  - `content` (Rich Text, required)
  - `featuredImage` (Media, single image)
  - `publishedAt` (DateTime, required)
  - `author` (Text)
  - `category` (Enumeration: Press Release, Innovation, Sustainability, Company News)
  - `featured` (Boolean, default false)
  - `language` (Enumeration: en, ro)

**3. Configure API Permissions**
- Go to Settings → Users & Permissions → Roles → Public
- Enable permissions for `article`:
  - ✅ find (get all articles)
  - ✅ findOne (get single article)
  - ❌ create (only authenticated)
  - ❌ update (only authenticated)
  - ❌ delete (only authenticated)

**4. Deploy Strapi**
```bash
# Build for production
npm run build

# Start with PM2 (process manager)
pm2 start npm --name "petstar-cms" -- start

# Configure Nginx reverse proxy
# /etc/nginx/sites-available/petstar-cms
server {
    listen 80;
    server_name api.petstar.com;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable SSL with Let's Encrypt
sudo certbot --nginx -d api.petstar.com
```

#### PHASE 2: Modify Frontend to Fetch News

**1. Create News Loader Script**

File: `/home/octavdragoi/code/petstar-website/assets/js/news-loader.js`

```javascript
/**
 * PetStar News Loader
 * Fetches articles from Strapi CMS and displays them
 */

const NewsLoader = {
    apiUrl: 'https://api.petstar.com/api',
    currentLanguage: 'en', // or 'ro'
    
    /**
     * Fetch all articles
     */
    async getArticles(limit = 3, featured = false) {
        try {
            const params = new URLSearchParams({
                'pagination[limit]': limit,
                'sort[0]': 'publishedAt:desc',
                'filters[language][$eq]': this.currentLanguage,
                'populate': '*'
            });
            
            if (featured) {
                params.append('filters[featured][$eq]', 'true');
            }
            
            const response = await fetch(`${this.apiUrl}/articles?${params}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    },
    
    /**
     * Fetch single article by slug
     */
    async getArticle(slug) {
        try {
            const params = new URLSearchParams({
                'filters[slug][$eq]': slug,
                'populate': '*'
            });
            
            const response = await fetch(`${this.apiUrl}/articles?${params}`);
            const data = await response.json();
            return data.data[0] || null;
        } catch (error) {
            console.error('Error fetching article:', error);
            return null;
        }
    },
    
    /**
     * Render articles in homepage news section
     */
    async renderNewsSection(containerId = 'news-container', limit = 3) {
        const articles = await this.getArticles(limit);
        const container = document.getElementById(containerId);
        
        if (!container || articles.length === 0) return;
        
        const articlesHTML = articles.map(article => {
            const { title, excerpt, slug, publishedAt, featuredImage } = article.attributes;
            const imageUrl = featuredImage?.data?.attributes?.url 
                ? `${this.apiUrl.replace('/api', '')}${featuredImage.data.attributes.url}`
                : 'assets/images/news/default.jpg';
            
            const date = new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="0.${articles.indexOf(article) + 1}s">
                    <div class="tj-blog-item">
                        <div class="blog-image">
                            <a href="news-details.html?slug=${slug}">
                                <img src="${imageUrl}" alt="${title}" />
                            </a>
                        </div>
                        <div class="blog-content">
                            <div class="blog-meta">
                                <ul>
                                    <li><i class="fa-light fa-calendar-days"></i> ${date}</li>
                                </ul>
                            </div>
                            <h4 class="title">
                                <a href="news-details.html?slug=${slug}">${title}</a>
                            </h4>
                            <p class="desc">${excerpt}</p>
                            <a href="news-details.html?slug=${slug}" class="read-more">
                                Read More <i class="fa-regular fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = articlesHTML;
        
        // Reinitialize WOW.js for new elements
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    },
    
    /**
     * Render single article on details page
     */
    async renderArticleDetails(containerId = 'article-container') {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            window.location.href = 'news.html';
            return;
        }
        
        const article = await this.getArticle(slug);
        const container = document.getElementById(containerId);
        
        if (!container || !article) {
            container.innerHTML = '<p>Article not found.</p>';
            return;
        }
        
        const { title, content, publishedAt, author, featuredImage } = article.attributes;
        const imageUrl = featuredImage?.data?.attributes?.url 
            ? `${this.apiUrl.replace('/api', '')}${featuredImage.data.attributes.url}`
            : 'assets/images/news/default.jpg';
        
        const date = new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        container.innerHTML = `
            <article class="blog-details-content">
                <div class="blog-details-image">
                    <img src="${imageUrl}" alt="${title}" />
                </div>
                <div class="blog-details-meta">
                    <ul>
                        <li><i class="fa-light fa-calendar-days"></i> ${date}</li>
                        ${author ? `<li><i class="fa-light fa-user"></i> ${author}</li>` : ''}
                    </ul>
                </div>
                <h2 class="title">${title}</h2>
                <div class="blog-details-text">
                    ${content}
                </div>
            </article>
        `;
    }
};

// Auto-initialize on page load
window.NewsLoader = NewsLoader;
```

**2. Update News Section HTML**

File: `/home/octavdragoi/code/petstar-website/sections/section-10-news.html`

```html
<!-- News Section -->
<section class="tj-blog-section">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="sec-heading text-center">
                    <span class="sub-title">Latest News</span>
                    <h2 class="sec-title">Stay Updated with PetStar</h2>
                </div>
            </div>
        </div>
        <div class="row" id="news-container">
            <!-- Articles will be loaded here by news-loader.js -->
            <div class="col-12 text-center">
                <p>Loading articles...</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 text-center">
                <a href="news.html" class="tj-primary-btn">
                    View All News <i class="fa-regular fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </div>
</section>
```

**3. Update index.html to Load News**

```javascript
// In index.html, after loading section-10-news.html
$('#news-placeholder').load('sections/section-10-news.html', function() {
    // Load news articles after section is loaded
    if (typeof NewsLoader !== 'undefined') {
        NewsLoader.renderNewsSection('news-container', 3);
    }
    ScrollTrigger.refresh();
});
```

**4. Create News Listing Page**

File: `/home/octavdragoi/code/petstar-website/news.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News - PetStar</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/font-awesome-pro.min.css">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/petstar.css">
</head>
<body>
    <!-- Header -->
    <div id="header-placeholder"></div>
    
    <!-- Page Header -->
    <section class="breadcrumb-wrapper">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb-content-area">
                        <h1 class="page-title">Latest News</h1>
                        <ul class="breadcrumb-list">
                            <li><a href="index.html">Home</a></li>
                            <li>News</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- News Grid -->
    <section class="tj-blog-section">
        <div class="container">
            <div class="row" id="news-container">
                <div class="col-12 text-center">
                    <p>Loading articles...</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <div id="footer-placeholder"></div>
    
    <!-- JS -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/news-loader.js"></script>
    
    <script>
        $(document).ready(function() {
            // Load header and footer
            $('#header-placeholder').load('sections/section-01-header.html');
            $('#footer-placeholder').load('sections/section-12-footer.html');
            
            // Load all news articles
            NewsLoader.renderNewsSection('news-container', 20);
        });
    </script>
</body>
</html>
```

**5. Create Article Details Page**

File: `/home/octavdragoi/code/petstar-website/news-details.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article - PetStar</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/font-awesome-pro.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/petstar.css">
</head>
<body>
    <!-- Header -->
    <div id="header-placeholder"></div>
    
    <!-- Article Content -->
    <section class="tj-blog-details">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 offset-lg-1">
                    <div id="article-container">
                        <p>Loading article...</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <div id="footer-placeholder"></div>
    
    <!-- JS -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/news-loader.js"></script>
    
    <script>
        $(document).ready(function() {
            $('#header-placeholder').load('sections/section-01-header.html');
            $('#footer-placeholder').load('sections/section-12-footer.html');
            
            // Load article details
            NewsLoader.renderArticleDetails('article-container');
        });
    </script>
</body>
</html>
```

#### PHASE 3: Admin Workflow

**1. Access Admin Panel**
- URL: `https://admin.petstar.com` (or your CMS domain)
- Login with credentials created during setup

**2. Create New Article**
- Go to Content Manager → Articles
- Click "Create new entry"
- Fill in fields:
  - Title: "PetStar Invests €2M in New Recycling Technology"
  - Slug: Auto-generated from title
  - Excerpt: Short summary (200 chars)
  - Content: Full article (rich text editor)
  - Featured Image: Upload image
  - Published At: Set date/time
  - Author: "PetStar Team"
  - Category: Select category
  - Featured: Check if homepage featured
  - Language: Select en or ro
- Click "Save" then "Publish"

**3. Article Appears on Website**
- Homepage news section updates automatically
- Article accessible at: `news-details.html?slug=petstar-invests-2m-in-new-recycling-technology`

---

## INFRASTRUCTURE REQUIREMENTS

### Hosting Options

**Frontend (Static Files):**
- Netlify (Free tier available)
- Vercel (Free tier available)
- GitHub Pages (Free)
- Traditional hosting (Hostinger, SiteGround)

**Backend (Strapi CMS):**
- VPS: DigitalOcean ($6/month), Linode ($5/month), Hetzner (€4/month)
- Railway (Free tier, then $5/month)
- Render (Free tier, then $7/month)
- Heroku ($7/month)

**Database:**
- PostgreSQL (included in VPS or use managed: DigitalOcean $15/month)
- SQLite (included in Strapi, good for small sites)

**Recommended Setup:**
```
Frontend: Netlify (Free)
Backend: Hetzner VPS €4/month (2GB RAM, 40GB SSD)
Database: PostgreSQL on same VPS
SSL: Let's Encrypt (Free)

Total Cost: €4-5/month (~$5-6/month)
```

## RECOMMENDATION

**For PetStar, I recommend OPTION 1: Strapi CMS**

**Reasons:**
1. ✅ **No coding required** - Team can manage content without developers
2. ✅ **Rich admin interface** - Easy to use, professional UI
3. ✅ **Media management** - Built-in image upload and organization
4. ✅ **Fast deployment** - Can be live in 1-2 days
5. ✅ **Scalable** - Can add more content types later (products, team members)
6. ✅ **Low cost** - ~€8/month total
7. ✅ **Active community** - Good documentation and support

**Next Steps:**
1. Set up Strapi on a Hetzner VPS (€8/month, 4GB RAM)
2. Create Article content type with fields above
3. Add `news-loader.js` to frontend
4. Update news section to fetch from API
5. Train team on CMS usage

Would you like me to help you set up the Strapi backend, or would you prefer to explore one of the other options?
