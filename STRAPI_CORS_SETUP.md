# Strapi CORS Configuration Guide

## Problem: Network Error When Registering/Logging In

If you're getting a "Network Error" when trying to register or log in, it's likely a **CORS (Cross-Origin Resource Sharing)** issue. Strapi needs to be configured to allow requests from your React app.

## Solution: Configure CORS in Strapi

### Step 1: Find Your Strapi Configuration File

In your Strapi project, you need to edit the `middlewares.ts` or `middlewares.js` file. It's usually located at:
```
config/middlewares.ts
```
or
```
config/middlewares.js
```

### Step 2: Update CORS Configuration

Open the file and look for the CORS middleware configuration. Update it to allow your React app:

**For Strapi v4:**
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

// Or if you need custom CORS configuration:
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:5173',  // Vite default port
        'http://localhost:3000',  // Alternative port
        'http://localhost:5174',  // If port 5173 is in use
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        // Add your production domain here
        // 'https://yourdomain.com',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

**For Strapi v3:**
```javascript
module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        // Add your production domain
      ],
      credentials: true,
    },
  },
};
```

### Step 3: Alternative - Create Custom Middleware

If the above doesn't work, create a custom middleware file:

**Create:** `config/middlewares.js` or `config/middlewares.ts`

```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Step 4: Restart Strapi

After making changes:
```bash
# Stop Strapi (Ctrl+C)
# Restart Strapi
npm run develop
# or
npm run start
```

### Step 5: Verify CORS is Working

1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Try to register a user
4. Look at the failed request
5. Check the **Response Headers** - you should see:
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Credentials: true`

## Quick Test: Is Strapi Running?

1. Open your browser and visit: `http://localhost:1337`
2. You should see the Strapi admin panel or API response
3. If you get "Cannot connect", Strapi is not running

## Quick Test: Check Your React App Port

1. When you run `npm run dev`, check the terminal output
2. It should show something like: `Local: http://localhost:5173`
3. Make sure this port is in your Strapi CORS configuration

## Environment Variables Check

Make sure your `.env` file in your React app has:
```env
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_URL=http://localhost:1337
```

## Common Issues

### Issue 1: "Network Error" - Strapi not running
**Solution:** Start your Strapi server
```bash
cd your-strapi-project
npm run develop
```

### Issue 2: "Network Error" - Wrong port in CORS
**Solution:** Check what port your React app is using and add it to Strapi CORS config

### Issue 3: "CORS policy blocked"
**Solution:** Make sure your React app's origin (e.g., `http://localhost:5173`) is in the Strapi CORS `origin` array

### Issue 4: "Registration is disabled"
**Solution:** 
1. Go to Strapi Admin Panel
2. Settings > Users & Permissions Plugin > Advanced Settings
3. Enable "Allow user registration"

## Production Setup

For production, update the CORS origin to your production domain:
```javascript
origin: [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
],
```

## Still Having Issues?

1. Check browser console for detailed error messages
2. Check Strapi server logs for errors
3. Verify Strapi is accessible: visit `http://localhost:1337/api/users-permissions/providers` in browser
4. Test with curl:
```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test1234"}'
```

