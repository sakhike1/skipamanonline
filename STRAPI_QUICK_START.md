# 🚀 Strapi Quick Start - Rebuild Everything

Since all data was lost, follow these steps to rebuild Strapi from scratch.

## ⚡ Quick Start (30 minutes)

### Step 1: Authentication (10 min) ⭐ START HERE

1. **Enable Registration**
   - Settings → Users & Permissions Plugin → Advanced Settings
   - Toggle "Allow user registration" ON
   - Save

2. **Add User Fields**
   - Content-Type Builder → User
   - Add `firstName` (Text)
   - Add `lastName` (Text)
   - Save
   - **RESTART STRAPI** ⚠️

3. **Set Permissions**
   - Settings → Users & Permissions Plugin → Roles
   - **Public**: Enable `auth` → `register`, `emailConfirmation`, `forgotPassword`
   - **Public**: Enable `product` → `find`, `findOne`
   - **Public**: Enable `category` → `find`, `findOne`
   - **Authenticated**: Enable `review` → `create`
   - **Authenticated**: Enable `order` → `create`

4. **Create API Token**
   - Settings → API Tokens → Create
   - Name: "Frontend Token"
   - Type: Full access
   - **COPY TOKEN**
   - Add to `.env`: `REACT_APP_STRAPI_TOKEN=your-token`

**See:** `STRAPI_AUTHENTICATION_SETUP.md` for details

---

### Step 2: Create Components (5 min)

Create these components first (Content-Type Builder → Create new component):

1. **product.color** (repeatable)
   - name (Text)
   - value (Text)

2. **product.dimensions** (single)
   - length, width, height (Decimal)

3. **slide.feature** (repeatable)
   - text (Text)

4. **slide.colors** (single)
   - background, text (Text)

5. **address.full** (single)
   - line1, line2, city, postalCode, country (Text)

6. **shipping.config** (single)
   - freeShippingThreshold, standardShippingRate, expressShippingRate (Decimal)
   - deliveryDays (Text)

7. **returns.policy** (single)
   - returnDays (Integer), refundDays (Text), returnPolicy (Rich Text)

8. **payment.method** (repeatable)
   - name (Text), enabled (Boolean), icon (Media)

9. **trust.stats** (single)
   - happyCustomers, ordersDelivered (Text), averageRating (Decimal)

10. **social.links** (repeatable)
    - platform, url (Text)

---

### Step 3: Create Content Types (15 min)

#### 3.1 Product ⭐ MOST IMPORTANT

Content-Type Builder → Create new collection type → "Product"

**Fields:**
- name (Text, required)
- slug (UID, from: name)
- description (Rich Text)
- price (Decimal, required)
- sku (Text, unique, required)
- stock (Integer, default: 0)
- images (Media, multiple)
- sizes (JSON)
- colors (Component: product.color, repeatable)
- dimensions (Component: product.dimensions, single)
- category (Relation → Category, manyToOne)
- featured (Boolean)
- isNew (Boolean)
- isActive (Boolean, default: true)
- rating (Decimal, default: 0)
- reviewCount (Integer, default: 0)
- tags (JSON)
- seoTitle, seoDescription (Text)

**Save** → **Restart Strapi**

#### 3.2 Category

- name (Text, required)
- slug (UID, from: name)
- description (Rich Text)
- image (Media)
- isActive (Boolean, default: true)
- order (Integer)

#### 3.3 Site Settings (Singleton) ⭐ IMPORTANT

- siteName, siteDescription (Text)
- logo, favicon (Media)
- contactEmail, contactPhone (Text)
- address (Component: address.full)
- shipping (Component: shipping.config)
- returns (Component: returns.policy)
- paymentMethods (Component: payment.method, repeatable)
- currency (Text, default: ZAR)
- taxRate (Decimal)
- trustIndicators (Component: trust.stats)

#### 3.4 Review

- product (Relation → Product, manyToOne)
- user (Relation → User, manyToOne, optional)
- userName (Text, required)
- rating (Integer, 1-5, required)
- title, comment (Text, required)
- status (Enumeration: pending, approved, rejected)
- verified (Boolean)

#### 3.5 Other Content Types

- **Testimonial**: name, location, rating, text, avatar, status
- **Hero Slide**: title, subtitle, cta, media, isActive, order
- **Lookbook**: title, description, images, products (relation)
- **Promotion**: name, code (unique), type, value, startDate, endDate
- **Order**: orderNumber (unique), customer (relation), items (JSON), total, status
- **Design Request**: title, description, customer (relation), status

**See:** `STRAPI_COMPLETE_SETUP.md` for full field lists

---

### Step 4: Set Permissions (5 min)

After creating content types:

**Public Role:**
- product → find, findOne
- category → find, findOne
- review → find, findOne (filter: status = approved)
- testimonial → find, findOne (filter: status = published)
- hero-slide → find, findOne (filter: isActive = true)
- lookbook → find, findOne
- site-setting → find

**Authenticated Role:**
- review → create
- order → create
- design-request → create
- user → findMe, updateMe

---

### Step 5: Add Initial Data (10 min)

1. **Site Settings**
   - Content Manager → Site Settings → Create
   - Fill in: site name, contact info, shipping rates, return policy
   - Save → Publish

2. **Categories**
   - Create: Basics, Graphic Tees, Hoodies, etc.

3. **Products**
   - Create at least 3-5 products
   - Upload images
   - Link to categories
   - Save → Publish

---

## ✅ Verification Checklist

- [ ] Can access Strapi admin panel
- [ ] User registration enabled
- [ ] firstName/lastName fields added to User
- [ ] Strapi restarted after User changes
- [ ] API token created and in .env
- [ ] All components created
- [ ] Product content type created
- [ ] Category content type created
- [ ] Site Settings created
- [ ] Permissions configured
- [ ] At least 1 category created
- [ ] At least 3 products created
- [ ] Site settings entry created

---

## 🧪 Test It

### Test Registration:
```bash
POST http://localhost:1337/api/auth/local/register
{
  "username": "test@example.com",
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Login:
```bash
POST http://localhost:1337/api/auth/local
{
  "identifier": "test@example.com",
  "password": "password123"
}
```

### Test Get Products:
```bash
GET http://localhost:1337/api/products
```

### Test Get Site Settings:
```bash
GET http://localhost:1337/api/site-setting
```

---

## 📝 Environment Variables

Make sure your `.env` has:

```env
# For Vite (your current setup)
VITE_STRAPI_URL=http://localhost:1337
VITE_USE_STRAPI_AUTH=true
VITE_STRAPI_TOKEN=your-api-token-here

# OR if using Create React App
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_TOKEN=your-api-token-here
```

**Note:** Your `strapiAuth.ts` uses `import.meta.env.VITE_STRAPI_URL`, so use `VITE_` prefix!

---

## 🚨 Common Issues

### "Cannot connect to Strapi"
- Check Strapi is running: `http://localhost:1337`
- Check CORS settings
- Verify URL in .env matches Strapi URL

### "403 Forbidden"
- Check permissions are set
- Verify API token is correct
- Check if content is published

### "User registration disabled"
- Enable in Settings → Users & Permissions → Advanced Settings
- Enable `auth` → `register` permission for Public role

### "firstName/lastName not found"
- Add fields to User content type
- Restart Strapi
- Re-register user

---

## 📚 Full Documentation

- **Complete Setup:** `STRAPI_COMPLETE_SETUP.md`
- **Authentication:** `STRAPI_AUTHENTICATION_SETUP.md`
- **Content Types:** `STRAPI_CONTENT_TYPES_GUIDE.md`
- **Checklist:** `STRAPI_SETUP_CHECKLIST.md`

---

## 🎯 Priority Order

1. ✅ **Authentication** (Step 1) - Do this first!
2. ✅ **Product + Category** (Step 3.1, 3.2) - Core functionality
3. ✅ **Site Settings** (Step 3.3) - Configuration
4. ✅ **Review** (Step 3.4) - User engagement
5. ✅ **Everything else** - Nice to have

---

**Start with Step 1 (Authentication) and work through the list!**

If you get stuck, refer to the detailed guides or ask for help with a specific step.

