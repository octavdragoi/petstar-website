# HOW TO GET STRAPI API TOKEN

## Why You Need an API Token

Strapi requires authentication for API requests. Without a token, your fetch requests will fail with a 401 or 403 error.

## Step-by-Step Guide

### 1. Log into Strapi Admin Panel

Navigate to your Strapi admin panel:
- Development: `http://localhost:1337/admin`
- Production: `https://api.petstar.com/admin` (or your domain)

### 2. Navigate to API Tokens

1. Click **Settings** in the left sidebar (gear icon at bottom)
2. Under "GLOBAL SETTINGS" section, click **API Tokens**
3. Click the **+ Create new API Token** button

### 3. Create the Token

Fill in the token details:

**Token name:** `Frontend Public Read`

**Token duration:** `Unlimited` (recommended for production)

**Token type:** Select **Read-only**
- This is most secure - only allows reading data
- Your frontend only needs to read articles, not create/edit them

### 4. Set Permissions

Under "Permissions", find **Article** and enable:
- ✅ `find` - Get all articles
- ✅ `findOne` - Get single article

**Do NOT enable:**
- ❌ `create`
- ❌ `update`
- ❌ `delete`

### 5. Save and Copy Token

1. Click **Save** button
2. Strapi will show you the token **ONLY ONCE**
3. **IMPORTANT:** Copy the token immediately - you won't see it again!
4. The token will look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### 6. Add Token to Config

Open `/home/octavdragoi/code/petstar-website/assets/js/config.js` and add your token:

```javascript
const PetStarConfig = {
    apiUrl: 'http://localhost:1337/api',
    apiToken: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', // ← Paste your token here
    defaultLanguage: 'en',
    // ... rest of config
};
```

### 7. Test the Integration

1. Save the config file
2. Refresh your website
3. Check browser console (F12) for any errors
4. Articles should now load successfully

## Alternative: Make API Public (NOT RECOMMENDED)

If you want to test without a token (not recommended for production):

### Option A: Change Article Permissions

1. Go to **Settings** → **Users & Permissions** → **Roles**
2. Click on **Public** role
3. Under **Permissions**, find **Article**
4. Enable:
   - ✅ `find`
   - ✅ `findOne`
5. Click **Save**

Now you can leave `apiToken: ''` empty in config.js.

**⚠️ Warning:** This makes your articles publicly accessible without authentication. Anyone can read your API data.

## Troubleshooting

### Error: "Unauthorized" or 401

**Cause:** Token is missing or invalid

**Fix:**
1. Check token is correctly pasted in `config.js`
2. Make sure there are no extra spaces
3. Verify token hasn't expired (if you set a duration)
4. Token should be wrapped in quotes: `apiToken: 'your-token-here'`

### Error: "Forbidden" or 403

**Cause:** Token doesn't have the right permissions

**Fix:**
1. Go back to Strapi → Settings → API Tokens
2. Edit your token
3. Make sure `find` and `findOne` are enabled for Article
4. Save changes

### Error: "Failed to fetch"

**Cause:** CORS or network issue

**Fix:**
1. Check Strapi is running
2. Verify `apiUrl` in config.js is correct
3. Check CORS configuration in Strapi (see Phase 2 setup guide)

### Articles Still Not Loading

**Debug checklist:**
1. ✅ Strapi is running and accessible
2. ✅ API token is created and copied correctly
3. ✅ Token has `find` and `findOne` permissions
4. ✅ Token is pasted in `config.js` (no extra spaces)
5. ✅ At least one article is published in Strapi
6. ✅ Article language matches `defaultLanguage` in config
7. ✅ Browser console shows no CORS errors

## Security Best Practices

### For Production:

1. **Use Read-only tokens** - Never use Full Access for frontend
2. **Different tokens for dev/prod** - Create separate tokens
3. **Rotate tokens periodically** - Change tokens every 3-6 months
4. **Keep tokens secret** - Don't commit to Git (use .env for backend)
5. **Monitor usage** - Check Strapi logs for suspicious activity

### Token Management:

```javascript
// Development
const PetStarConfig = {
    apiUrl: 'http://localhost:1337/api',
    apiToken: 'dev-token-here',
    // ...
};

// Production (use environment-specific config)
const PetStarConfig = {
    apiUrl: 'https://api.petstar.com/api',
    apiToken: 'prod-token-here', // Different token
    // ...
};
```

## What Changed in the Code

The following files were updated to support API tokens:

1. **`assets/js/config.js`** - Added `apiToken` field
2. **`assets/js/news-loader.js`** - Added:
   - `apiToken` property
   - `getHeaders()` method to include Authorization header
   - `setApiToken()` method
   - Updated all `fetch()` calls to include headers

No other changes needed - everything else works automatically!

---

**Quick Test:**

After adding your token, open browser console and type:

```javascript
NewsLoader.getArticles(1).then(articles => console.log(articles));
```

You should see an array with your article data. If you see an empty array or error, check the troubleshooting section above.
