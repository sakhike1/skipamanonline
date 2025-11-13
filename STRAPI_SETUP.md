# Strapi Authentication Setup Guide

## Step-by-Step Instructions

### Step 1: Enable Strapi Authentication in Your React App

1. **Open your `.env` file** in the root of your project
2. **Set the following variables**:

```env
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_URL=http://localhost:1337
```

3. **Save the file** and restart your development server:
```bash
npm run dev
```

### Step 2: Configure Strapi User Content Type (Optional but Recommended)

To support `firstName` and `lastName` fields:

1. In your Strapi admin panel (the one you're currently viewing):
   - Go to **Content-Type Builder** (click on the icon in the left sidebar)
   - Under **User**, click on **User** content type
   - Click **Add another field**
   - Add field: `firstName` (Type: Text)
   - Add field: `lastName` (Type: Text)
   - Click **Save**

2. **Restart Strapi** after making changes

### Step 3: Configure Strapi User Registration

1. In Strapi admin panel, go to **Settings** (gear icon)
2. Click on **Users & Permissions plugin** (under Plugins)
3. Click on **Advanced Settings**
4. Enable **Allow user registration** (if you want public registration)
5. Or leave it disabled and only allow admin-created users
6. **Save** the settings

### Step 4: Set Up Roles and Permissions

1. In Strapi admin panel, go to **Settings** > **Users & Permissions plugin**
2. Click on **Roles**
3. Click on **Authenticated** role
4. Configure permissions for authenticated users (what they can access)
5. Click **Save**

### Step 5: Get API Token (Optional)

If you need to perform admin operations from your frontend:

1. In Strapi admin panel, go to **Settings** (gear icon)
2. Click on **API Tokens** (under Global Settings)
3. Click **Create new API Token**
4. Set:
   - **Name**: Frontend Admin Token (or any name)
   - **Token type**: Full access (or customize permissions)
   - **Token duration**: Unlimited (or set expiry)
5. Click **Save**
6. **Copy the token** (you'll only see it once!)
7. Add it to your `.env` file:
```env
REACT_APP_STRAPI_TOKEN=your-copied-token-here
```

### Step 6: Test the Integration

1. **Start your Strapi server** (if not running):
```bash
cd your-strapi-project
npm run develop
```

2. **Start your React app**:
```bash
npm run dev
```

3. **Test Registration**:
   - Go to your React app
   - Try to register a new user
   - Check Strapi admin panel > **Content Manager** > **User** to see if the user was created

4. **Test Login**:
   - Log in with the credentials you just created
   - Verify you're authenticated

## Troubleshooting

### Issue: "Invalid identifier or password"
- Make sure Strapi is running on the correct port (default: 1337)
- Check that `REACT_APP_STRAPI_URL` matches your Strapi URL
- Verify user exists in Strapi admin panel

### Issue: "User registration failed"
- Check Strapi settings: **Settings** > **Users & Permissions plugin** > **Advanced Settings**
- Ensure "Allow user registration" is enabled (if you want public registration)
- Check browser console for detailed error messages

### Issue: "Network error" or "Cannot connect"
- Verify Strapi is running: visit `http://localhost:1337` in your browser
- Check `REACT_APP_STRAPI_URL` in your `.env` file
- Make sure there are no CORS issues (Strapi should allow your React app origin)

### Issue: "firstName/lastName not working"
- Make sure you added these fields to the User content type in Strapi
- Restart Strapi after adding fields
- Clear browser cache and try again

## Switching Back to Custom Backend

If you want to use your custom backend instead:

1. Set in `.env`:
```env
REACT_APP_USE_STRAPI_AUTH=false
```

2. Restart your development server

## Current Status

✅ Strapi authentication service created (`src/services/strapiAuth.ts`)  
✅ AuthContext updated to support both backends  
✅ Automatic switching based on environment variable  
✅ User registration and login working  
✅ Profile updates supported  
✅ Password reset functionality included  

## Next Steps

1. Configure Strapi User content type with firstName/lastName (Step 2)
2. Set up roles and permissions (Step 4)
3. Test registration and login (Step 6)
4. Optionally get API token for admin operations (Step 5)

