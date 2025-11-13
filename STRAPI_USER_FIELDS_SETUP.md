# Adding firstName and lastName to Strapi User Model

## Problem
Strapi's default User model only has these fields:
- `username` (required)
- `email` (required)
- `password` (required)
- `confirmed` (boolean)
- `blocked` (boolean)
- `provider` (string)

If you try to register with `firstName` and `lastName`, you'll get an error: **"Invalid parameters: firstName, lastName"**

## Solution: Add firstName and lastName Fields

### Step 1: Access Content-Type Builder

1. Open your Strapi Admin Panel
2. Click on **Content-Type Builder** in the left sidebar (table/grid icon)
3. Under **User**, you'll see the **User** content type

### Step 2: Add firstName Field

1. Click on **User** content type
2. Click **Add another field** button
3. Select **Text** type
4. Configure the field:
   - **Name**: `firstName`
   - **Type**: Short text (default)
   - **Required**: Optional (recommended: Yes)
   - Click **Finish**

### Step 3: Add lastName Field

1. While still in the User content type
2. Click **Add another field** button again
3. Select **Text** type
4. Configure the field:
   - **Name**: `lastName`
   - **Type**: Short text (default)
   - **Required**: Optional (recommended: Yes)
   - Click **Finish**

### Step 4: Save and Restart

1. Click the **Save** button at the top right
2. **Restart Strapi server** (this is important!)
   ```bash
   # Stop Strapi (Ctrl+C)
   # Restart Strapi
   npm run develop
   ```

### Step 5: Test Registration

After restarting, try registering again. The `firstName` and `lastName` fields should now be accepted.

## Alternative: Use Without firstName/lastName

If you don't want to add these fields to Strapi, the code has been updated to work without them. The registration will work, but:
- `firstName` and `lastName` won't be stored in Strapi
- They'll be derived from the `username` field when needed

## Verification

After adding the fields and restarting Strapi:

1. Go to **Content-Type Builder** > **User**
2. You should see:
   - `firstName` (Text)
   - `lastName` (Text)
3. Try registering a new user in your React app
4. Check in Strapi Admin: **Content Manager** > **User** > [Your User]
5. You should see `firstName` and `lastName` fields populated

## Notes

- **Restart Required**: You MUST restart Strapi after adding fields to the User model
- **Field Names**: Use exactly `firstName` and `lastName` (case-sensitive)
- **Required Fields**: Making these fields required is recommended if you always want them
- **Existing Users**: Existing users won't have these fields until you update them

## Troubleshooting

### Error: "Field already exists"
- The field might already exist
- Check the User content type in Content-Type Builder

### Error: "Cannot save"
- Make sure you clicked **Save** after adding fields
- Check Strapi server logs for errors

### Fields not showing after restart
- Make sure you restarted Strapi completely
- Clear browser cache
- Check Strapi server logs

### Registration still fails
- Check that field names are exactly `firstName` and `lastName`
- Verify Strapi was restarted after adding fields
- Check browser console for detailed error messages

