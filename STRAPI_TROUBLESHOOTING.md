# Strapi Authentication Troubleshooting

## Quick Diagnosis Steps

### 1. Check if Strapi is Running
Open your browser and visit: `http://localhost:1337`
- ✅ **Working**: You see the Strapi admin panel or API response
- ❌ **Not Working**: "Cannot connect" - Start Strapi server

### 2. Check Your React App Port
When you run `npm run dev`, check the terminal:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```
- Note the port number (usually `5173` for Vite)

### 3. Test Strapi API Directly
Open your browser and visit:
```
http://localhost:1337/api/users-permissions/providers
```
- ✅ **Working**: You see JSON response
- ❌ **Not Working**: Check Strapi server

### 4. Check Environment Variables
In your React app's `.env` file, verify:
```env
VITE_USE_STRAPI_AUTH=true
VITE_STRAPI_URL=http://localhost:1337
```

## Common Errors and Solutions

### ❌ "Network Error: Cannot connect to Strapi"

**Causes:**
1. Strapi server is not running
2. Wrong Strapi URL in `.env`
3. CORS not configured in Strapi

**Solutions:**

1. **Start Strapi:**
   ```bash
   cd your-strapi-project
   npm run develop
   ```

2. **Check Strapi URL:**
   - Verify Strapi is running on port 1337 (default)
   - Update `.env` if using different port:
     ```env
    VITE_STRAPI_URL=http://localhost:YOUR_PORT
     ```

3. **Configure CORS in Strapi:**
   - See `STRAPI_CORS_SETUP.md` for detailed instructions
   - Quick fix: Update `config/middlewares.ts` in Strapi:
     ```typescript
     {
       name: 'strapi::cors',
       config: {
         enabled: true,
         origin: ['http://localhost:5173'], // Your React app port
         credentials: true,
       },
     },
     ```
   - Restart Strapi after changes

### ❌ "User registration is disabled"

**Solution:**
1. Go to Strapi Admin Panel
2. **Settings** > **Users & Permissions Plugin** > **Advanced Settings**
3. Enable **"Allow user registration"**
4. Save and try again

### ❌ "Invalid email or password" (Login)

**Causes:**
1. User doesn't exist
2. Wrong password
3. Account is blocked

**Solutions:**
1. Check if user exists in Strapi Admin Panel
2. Verify password is correct
3. Check if account is blocked in Strapi

### ❌ "Email is already taken" (Registration)

**Solution:**
- User already exists with that email
- Try logging in instead, or use a different email

### ❌ CORS Policy Error in Browser Console

**Cause:** Your React app's origin is not in Strapi's CORS allowed origins

**Solutions:**

1. **Add your React app URL to Strapi CORS config (see `STRAPI_CORS_SETUP.md`)**
   - Add your React app URL to `origin` array in `config/middlewares.ts`
   - Restart Strapi

### ❌ "Error sending confirmation email" (Registration)

**Cause:** Email confirmation is enabled in Strapi, but no email provider is configured. Strapi tries to send a confirmation email and fails.

**Solutions:**

1. **Quick Fix – Disable Email Confirmation (Recommended for development)**
   - Go to Strapi Admin Panel
   - **Settings** > **Users & Permissions Plugin** > **Advanced Settings**
   - Toggle **"Enable email confirmation"** OFF
   - Click **Save**
   - Try registering again

2. **Configure Email Provider (Recommended for production)**
   - In Strapi Admin Panel, go to **Settings** > **Email**
   - Configure an email provider (e.g., SendGrid, SMTP, Mailgun)
   - Provide the required credentials
   - Save settings
   - Keep **"Enable email confirmation"** ON if you want users to confirm their email
   - Test registration again

### ❌ "Forbidden" / "Order not created" during checkout

**Causes:**
- The **Order** content type (and its components) are not created in Strapi yet.
- The authenticated role (or API token) does not have permission to create Orders.
- `VITE_STRAPI_TOKEN` is missing when you rely on an API token.

**Fix Checklist:**
1. Follow the **📦 Strapi Orders** setup section in `README.md` to create the Order collection type and components.
2. In Strapi Admin Panel: **Settings → Users & Permissions Plugin → Roles → Authenticated**
   Enable `create` (and optionally `read/update`) for the Order collection.
3. If you use guest checkout (no authenticated user), create an **API Token** in **Settings → API Tokens** with create permissions on Orders, then set `VITE_STRAPI_TOKEN` in your `.env`.
4. Restart Strapi after schema or permission changes.

## Testing Strapi Connection

### Test 1: Browser Test
1. Open browser
2. Visit: `http://localhost:1337/api/users-permissions/providers`
3. Should see JSON response

### Test 2: curl Test (Optional)
```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### Test 3: Check Browser Console
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to register
4. Look for the failed request
5. Check:
   - **Status Code** (404, 403, 500, etc.)
   - **Response Headers** (CORS headers)
   - **Response Body** (error details)

## Step-by-Step Fix for Network Error

1. **Verify Strapi is Running**
   ```bash
   # In Strapi project directory
   npm run develop
   ```
   - Check terminal for: "Server started on port 1337"

2. **Check Strapi URL in Browser**
   - Visit: `http://localhost:1337`
   - Should see Strapi admin login or API

3. **Verify React App Port**
   - Check terminal when running `npm run dev`
   - Note the port (e.g., `5173`)

4. **Configure CORS in Strapi**
   - Edit: `your-strapi-project/config/middlewares.ts`
   - Add your React app port to `origin` array
   - Restart Strapi

5. **Restart React App**
   ```bash
   # Stop React app (Ctrl+C)
   npm run dev
   ```

6. **Test Again**
   - Try registering a new user
   - Check browser console for errors
   - Check Strapi server logs

## Still Not Working?

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Check Network tab for failed requests

2. **Check Strapi Server Logs**
   - Look at Strapi terminal output
   - Check for error messages

3. **Verify Environment Variables**
   - Make sure `.env` file is in the root directory
   - Restart React app after changing `.env`
   - Verify variables start with `VITE_`

4. **Try Direct API Test**
   - Use browser or curl to test Strapi API directly
   - This helps isolate if it's a CORS or server issue

5. **Check Strapi Version**
   - Make sure you're using Strapi v4+
   - Older versions have different CORS configuration

## Getting Help

If you're still having issues, check:
1. Browser console for detailed errors
2. Strapi server logs
3. Network tab in DevTools
4. `STRAPI_CORS_SETUP.md` for CORS configuration
5. Strapi documentation: https://docs.strapi.io

