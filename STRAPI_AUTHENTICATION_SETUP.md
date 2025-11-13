# 🔐 Strapi Authentication Complete Setup Guide

This guide covers everything you need to set up authentication in Strapi for your React app.

## ✅ Step 1: Enable User Registration

1. Go to **Strapi Admin Panel** → **Settings** (gear icon)
2. Click **Users & Permissions Plugin**
3. Click **Advanced Settings** tab
4. Enable **Allow user registration** (toggle ON)
5. Click **Save**

**Note:** If you want admin-only user creation, leave this disabled.

---

## ✅ Step 2: Add Custom Fields to User

1. Go to **Content-Type Builder**
2. Find **User** (under **User** plugin section)
3. Click on it
4. Click **Add another field**

### Add `firstName` field:
- **Type**: Text
- **Name**: `firstName`
- **Required**: ✅ (recommended)
- Click **Finish**

### Add `lastName` field:
- **Type**: Text
- **Name**: `lastName`
- **Required**: ✅ (recommended)
- Click **Finish**

5. Click **Save** at the top
6. **⚠️ IMPORTANT: Restart Strapi** (required after modifying User content type)

---

## ✅ Step 3: Configure Roles and Permissions

### 3.1 Public Role (Unauthenticated Users)

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Scroll to **Permissions**

**Enable these permissions:**

**Authentication:**
- ✅ `auth` → `register` (if allowing public registration)
- ✅ `auth` → `emailConfirmation`
- ✅ `auth` → `forgotPassword`
- ✅ `auth` → `resetPassword`
- ✅ `auth` → `callback` (for OAuth providers if using)

**Content Access:**
- ✅ `product` → `find`
- ✅ `product` → `findOne`
- ✅ `category` → `find`
- ✅ `category` → `findOne`
- ✅ `review` → `find` (with filter: `status = approved`)
- ✅ `review` → `findOne` (with filter: `status = approved`)
- ✅ `testimonial` → `find` (with filter: `status = published`)
- ✅ `testimonial` → `findOne` (with filter: `status = published`)
- ✅ `hero-slide` → `find` (with filter: `isActive = true`)
- ✅ `hero-slide` → `findOne` (with filter: `isActive = true`)
- ✅ `lookbook` → `find`
- ✅ `lookbook` → `findOne`
- ✅ `site-setting` → `find`
- ✅ `promotion` → `find` (with filter: `isActive = true`)
- ✅ `promotion` → `findOne` (with filter: `isActive = true`)

4. Click **Save**

### 3.2 Authenticated Role (Logged-in Users)

1. Click on **Authenticated** role
2. Scroll to **Permissions**

**Enable these permissions:**

**Content Access:**
- ✅ `product` → `find`
- ✅ `product` → `findOne`
- ✅ `category` → `find`
- ✅ `category` → `findOne`
- ✅ `review` → `find`
- ✅ `review` → `findOne`
- ✅ `review` → `create` (users can create reviews)
- ✅ `order` → `create`
- ✅ `order` → `find` (will need custom controller for own orders only)
- ✅ `order` → `findOne` (will need custom controller for own orders only)
- ✅ `design-request` → `create`
- ✅ `design-request` → `find` (will need custom controller for own requests only)
- ✅ `design-request` → `findOne` (will need custom controller for own requests only)
- ✅ `user` → `findMe` (if available - get own user data)
- ✅ `user` → `updateMe` (if available - update own profile)

3. Click **Save**

### 3.3 Admin Role

- Should have full access by default
- Verify all permissions are enabled

---

## ✅ Step 4: Create API Token (For Frontend)

1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**

**Configure:**
- **Name**: `Frontend API Token`
- **Token type**: 
  - `Full access` (easiest, but less secure)
  - OR `Read-only` (safer, but may need write access for some operations)
- **Token duration**: 
  - `Unlimited` (for development)
  - OR set expiry date (for production)

3. Click **Save**
4. **⚠️ COPY THE TOKEN IMMEDIATELY** - You'll only see it once!
5. Add to your `.env` file:

```env
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_TOKEN=your-copied-token-here
```

---

## ✅ Step 5: Configure CORS (If Needed)

If your frontend is on a different domain/port:

1. Go to **Settings** → **Users & Permissions Plugin** → **Advanced Settings**
2. Under **CORS**, add your frontend URL:
   - Example: `http://localhost:5173` (Vite default)
   - Example: `http://localhost:3000` (Create React App default)
   - Example: `https://yourdomain.com` (production)

3. Or configure in `config/middlewares.js`:

```javascript
module.exports = [
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
      origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
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

---

## ✅ Step 6: Test Authentication

### 6.1 Test Registration

**Using curl:**
```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6.2 Test Login

**Using curl:**
```bash
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    ...
  }
}
```

### 6.3 Test Authenticated Request

**Using curl:**
```bash
curl -X GET http://localhost:1337/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## ✅ Step 7: Update Frontend Code

### 7.1 Check Your Auth Service

Verify `src/services/strapiAuth.ts` exists and has these methods:

```typescript
// Register
async register(data: { firstName: string; lastName: string; email: string; password: string })

// Login
async login(identifier: string, password: string)

// Get current user
async getMe(token: string)

// Update user
async updateMe(token: string, data: any)
```

### 7.2 Check Environment Variables

Your `.env` file should have:

```env
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_TOKEN=your-api-token-here
```

### 7.3 Test in Frontend

1. Try to register a new user
2. Try to login
3. Check if JWT token is stored
4. Try to fetch user data
5. Try to update user profile

---

## 🔧 Troubleshooting

### Issue: Registration Returns 403

**Solution:**
- Check if "Allow user registration" is enabled
- Verify `auth` → `register` permission is enabled for Public role
- Check CORS settings

### Issue: Login Returns 401

**Solution:**
- Verify email/password is correct
- Check if user account is blocked
- Verify `auth` → `local` permission is enabled

### Issue: JWT Token Invalid

**Solution:**
- Check JWT_SECRET in Strapi config
- Verify token hasn't expired
- Check token format (should start with `eyJ`)

### Issue: Cannot Access User Data

**Solution:**
- Verify `user` → `findMe` permission is enabled for Authenticated role
- Check if Authorization header is sent correctly
- Verify token is valid

### Issue: CORS Errors

**Solution:**
- Add frontend URL to CORS settings
- Check `config/middlewares.js` configuration
- Verify credentials are enabled if needed

---

## 📝 Authentication Endpoints Reference

### Register
```
POST /api/auth/local/register
Body: {
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",  // if added to User model
  "lastName": "string"     // if added to User model
}
```

### Login
```
POST /api/auth/local
Body: {
  "identifier": "email or username",
  "password": "string"
}
```

### Get Current User
```
GET /api/users/me
Headers: {
  "Authorization": "Bearer JWT_TOKEN"
}
```

### Update Current User
```
PUT /api/users/me
Headers: {
  "Authorization": "Bearer JWT_TOKEN"
}
Body: {
  "firstName": "string",
  "lastName": "string",
  ...
}
```

### Forgot Password
```
POST /api/auth/forgot-password
Body: {
  "email": "string"
}
```

### Reset Password
```
POST /api/auth/reset-password
Body: {
  "code": "string",
  "password": "string",
  "passwordConfirmation": "string"
}
```

---

## ✅ Checklist

- [ ] User registration enabled
- [ ] firstName and lastName fields added to User
- [ ] Strapi restarted after User modifications
- [ ] Public role permissions configured
- [ ] Authenticated role permissions configured
- [ ] API token created and added to .env
- [ ] CORS configured
- [ ] Registration tested
- [ ] Login tested
- [ ] Frontend environment variables set
- [ ] Frontend authentication working

---

## 🎯 Next Steps

After authentication is set up:

1. ✅ Create all content types (see `STRAPI_COMPLETE_SETUP.md`)
2. ✅ Configure content type permissions
3. ✅ Add initial data
4. ✅ Test API endpoints
5. ✅ Update frontend to use Strapi

For complete setup, see `STRAPI_COMPLETE_SETUP.md`

