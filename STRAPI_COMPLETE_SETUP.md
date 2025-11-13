# 🚀 Complete Strapi Setup Guide - From Scratch

This guide will help you set up Strapi from scratch with all content types and authentication enabled.

## 📋 Prerequisites

1. Strapi installed and running
2. Access to Strapi Admin Panel (http://localhost:1337/admin)
3. Admin account created (first time setup)

---

## 🔐 Step 1: Enable Authentication

### 1.1 Configure User Registration

1. Go to **Settings** (gear icon) → **Users & Permissions Plugin**
2. Click **Advanced Settings**
3. Enable **Allow user registration** (if you want public signups)
   - Or leave disabled for admin-only user creation
4. Click **Save**

### 1.2 Configure User Content Type

1. Go to **Content-Type Builder**
2. Click on **User** (under **User** plugin)
3. Click **Add another field**
4. Add these fields:

**Add `firstName` field:**
- Type: **Text**
- Name: `firstName`
- Required: ✅ (optional, but recommended)
- Click **Finish**

**Add `lastName` field:**
- Type: **Text**
- Name: `lastName`
- Required: ✅ (optional, but recommended)
- Click **Finish**

5. Click **Save** at the top
6. **Restart Strapi** (required after modifying User content type)

### 1.3 Set Up Roles and Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Configure permissions:

**Enable for Public:**
- ✅ `auth` → `register` (if allowing public registration)
- ✅ `auth` → `emailConfirmation`
- ✅ `auth` → `forgotPassword`
- ✅ `auth` → `resetPassword`
- ✅ `auth` → `callback` (for OAuth if using)
- ✅ `product` → `find`
- ✅ `product` → `findOne`
- ✅ `category` → `find`
- ✅ `category` → `findOne`
- ✅ `review` → `find` (with filter: status = approved)
- ✅ `review` → `findOne` (with filter: status = approved)
- ✅ `testimonial` → `find` (with filter: status = published)
- ✅ `testimonial` → `findOne` (with filter: status = published)
- ✅ `hero-slide` → `find` (with filter: isActive = true)
- ✅ `hero-slide` → `findOne` (with filter: isActive = true)
- ✅ `lookbook` → `find`
- ✅ `lookbook` → `findOne`
- ✅ `site-setting` → `find`
- ✅ `article` → `find`
- ✅ `article` → `findOne`
- ✅ `faq` → `find`
- ✅ `faq` → `findOne`

4. Click **Save**

5. Click on **Authenticated** role
6. Configure permissions:

**Enable for Authenticated:**
- ✅ `product` → `find`
- ✅ `product` → `findOne`
- ✅ `category` → `find`
- ✅ `category` → `findOne`
- ✅ `review` → `find`
- ✅ `review` → `findOne`
- ✅ `review` → `create` (users can create their own reviews)
- ✅ `order` → `create`
- ✅ `order` → `find` (own orders only - will need custom controller)
- ✅ `order` → `findOne` (own orders only)
- ✅ `design-request` → `create`
- ✅ `design-request` → `find` (own requests only)
- ✅ `design-request` → `findOne` (own requests only)
- ✅ `user` → `findMe` (if available)
- ✅ `user` → `updateMe` (if available)

7. Click **Save**

### 1.4 Create API Token (Optional but Recommended)

1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Configure:
   - **Name**: `Frontend API Token`
   - **Token type**: `Full access` (or customize permissions)
   - **Token duration**: `Unlimited` (or set expiry)
4. Click **Save**
5. **Copy the token immediately** (you'll only see it once!)
6. Add to your `.env` file:
   ```
   REACT_APP_STRAPI_TOKEN=your-token-here
   ```

---

## 🧩 Step 2: Create Components (Do This First!)

Components must be created before content types that use them.

### 2.1 Product Color Component

1. Go to **Content-Type Builder**
2. Click **Create new component**
3. Configure:
   - **Category**: `product`
   - **Name**: `color`
   - **Type**: `repeatable component`
4. Add fields:
   - **name** (Text, required)
   - **value** (Text, required)
5. Click **Save**

### 2.2 Product Dimensions Component

1. Click **Create new component**
2. Configure:
   - **Category**: `product`
   - **Name**: `dimensions`
   - **Type**: `single component`
3. Add fields:
   - **length** (Decimal, required)
   - **width** (Decimal, required)
   - **height** (Decimal, required)
4. Click **Save**

### 2.3 Slide Feature Component

1. Click **Create new component**
2. Configure:
   - **Category**: `slide`
   - **Name**: `feature`
   - **Type**: `repeatable component`
3. Add fields:
   - **text** (Text, required)
4. Click **Save**

### 2.4 Slide Colors Component

1. Click **Create new component**
2. Configure:
   - **Category**: `slide`
   - **Name**: `colors`
   - **Type**: `single component`
3. Add fields:
   - **background** (Text)
   - **text** (Text)
4. Click **Save**

### 2.5 Address Component

1. Click **Create new component**
2. Configure:
   - **Category**: `address`
   - **Name**: `full`
   - **Type**: `single component`
3. Add fields:
   - **line1** (Text, required)
   - **line2** (Text)
   - **city** (Text, required)
   - **postalCode** (Text, required)
   - **country** (Text, required)
4. Click **Save**

### 2.6 Social Links Component

1. Click **Create new component**
2. Configure:
   - **Category**: `social`
   - **Name**: `links`
   - **Type**: `repeatable component`
3. Add fields:
   - **platform** (Text, required)
   - **url** (Text, required)
4. Click **Save**

### 2.7 Shipping Config Component

1. Click **Create new component**
2. Configure:
   - **Category**: `shipping`
   - **Name**: `config`
   - **Type**: `single component`
3. Add fields:
   - **freeShippingThreshold** (Decimal)
   - **standardShippingRate** (Decimal)
   - **expressShippingRate** (Decimal)
   - **deliveryDays** (Text)
4. Click **Save**

### 2.8 Returns Policy Component

1. Click **Create new component**
2. Configure:
   - **Category**: `returns`
   - **Name**: `policy`
   - **Type**: `single component`
3. Add fields:
   - **returnDays** (Integer)
   - **refundDays** (Text)
   - **returnPolicy** (Rich Text)
4. Click **Save**

### 2.9 Payment Method Component

1. Click **Create new component**
2. Configure:
   - **Category**: `payment`
   - **Name**: `method`
   - **Type**: `repeatable component`
3. Add fields:
   - **name** (Text, required)
   - **enabled** (Boolean, default: true)
   - **icon** (Media, single, optional)
4. Click **Save**

### 2.10 Trust Stats Component

1. Click **Create new component**
2. Configure:
   - **Category**: `trust`
   - **Name**: `stats`
   - **Type**: `single component`
3. Add fields:
   - **happyCustomers** (Text)
   - **ordersDelivered** (Text)
   - **averageRating** (Decimal)
4. Click **Save**

---

## 📦 Step 3: Create Content Types

### 3.1 Product (Collection Type) ⭐ **START HERE**

1. Go to **Content-Type Builder**
2. Click **Create new collection type**
3. Name: `Product`
4. Click **Continue**

**Add Fields:**

**Basic Information:**
- **name** (Text, required)
- **slug** (UID, from: name, unique)
- **description** (Rich Text)
- **shortDescription** (Text)

**Pricing & Inventory:**
- **price** (Decimal, required)
- **compareAtPrice** (Decimal, optional)
- **sku** (Text, unique, required)
- **stock** (Integer, default: 0)
- **weight** (Decimal)

**Media:**
- **images** (Media, multiple, required)

**Product Details:**
- **sizes** (JSON) - You'll enter: `["S", "M", "L", "XL", "XXL"]`
- **colors** (Component: `product.color`, repeatable)
- **dimensions** (Component: `product.dimensions`, single)

**Flags:**
- **featured** (Boolean, default: false)
- **isNew** (Boolean, default: false)
- **isActive** (Boolean, default: true)

**Ratings:**
- **rating** (Decimal, default: 0)
- **reviewCount** (Integer, default: 0)

**SEO:**
- **seoTitle** (Text)
- **seoDescription** (Text)

**Metadata:**
- **tags** (JSON) - Array of strings

5. Click **Save**
6. **Restart Strapi**

### 3.2 Category (Collection Type)

1. Click **Create new collection type**
2. Name: `Category`
3. Click **Continue**

**Add Fields:**
- **name** (Text, required)
- **slug** (UID, from: name, unique)
- **description** (Rich Text)
- **image** (Media, single)
- **parentCategory** (Relation → Category, self-referencing, optional)
- **isActive** (Boolean, default: true)
- **order** (Integer, default: 0)
- **seoTitle** (Text)
- **seoDescription** (Text)

4. Click **Save**

**Now Link Products to Categories:**
1. Go back to **Product** content type
2. Click **Add another field**
3. Select **Relation**
4. Configure:
   - **Product** → **has and belongs to many** → **Category**
   - OR
   - **Product** → **has one** → **Category** (if one category per product)
5. Click **Finish**
6. Click **Save**

### 3.3 Review (Collection Type)

1. Click **Create new collection type**
2. Name: `Review`
3. Click **Continue**

**Add Fields:**
- **product** (Relation → Product, manyToOne, required)
- **user** (Relation → User, manyToOne, optional)
- **userName** (Text, required)
- **userEmail** (Email, optional)
- **rating** (Integer, required, min: 1, max: 5)
- **title** (Text, required)
- **comment** (Text, required)
- **verified** (Boolean, default: false)
- **helpful** (Integer, default: 0)
- **images** (Media, multiple, optional)
- **status** (Enumeration: `pending`, `approved`, `rejected`, default: `pending`)
- **adminNotes** (Text, optional)

4. Click **Save**

### 3.4 Testimonial (Collection Type)

1. Click **Create new collection type**
2. Name: `Testimonial`
3. Click **Continue**

**Add Fields:**
- **name** (Text, required)
- **location** (Text)
- **rating** (Integer, min: 1, max: 5)
- **text** (Text, required)
- **avatar** (Media, single)
- **verified** (Boolean, default: false)
- **purchase** (Text)
- **date** (Date)
- **helpful** (Integer, default: 0)
- **images** (Media, multiple)
- **tags** (JSON) - Array of strings
- **featured** (Boolean, default: false)
- **status** (Enumeration: `draft`, `published`, `archived`, default: `draft`)

4. Click **Save**

### 3.5 Hero Slide (Collection Type)

1. Click **Create new collection type**
2. Name: `Hero Slide`
3. Click **Continue**

**Add Fields:**
- **title** (Text, required)
- **subtitle** (Text)
- **cta** (Text - button text)
- **ctaLink** (Text - button URL)
- **promo** (Text - promotional message)
- **media** (Media, single)
- **mediaType** (Enumeration: `image`, `video`, default: `image`)
- **features** (Component: `slide.feature`, repeatable)
- **colorScheme** (Component: `slide.colors`, single)
- **order** (Integer, default: 0)
- **isActive** (Boolean, default: true)
- **startDate** (DateTime)
- **endDate** (DateTime)

4. Click **Save**

### 3.6 Lookbook (Collection Type)

1. Click **Create new collection type**
2. Name: `Lookbook`
3. Click **Continue**

**Add Fields:**
- **title** (Text, required)
- **description** (Rich Text)
- **category** (Text)
- **season** (Text)
- **featured** (Boolean, default: false)
- **images** (Media, multiple, required)
- **products** (Relation → Product, manyToMany)
- **tags** (JSON) - Array of strings
- **publishedAt** (DateTime)

4. Click **Save**

### 3.7 Site Settings (Singleton) ⭐ **IMPORTANT**

1. Click **Create new single type**
2. Name: `Site Settings`
3. Click **Continue**

**Add Fields:**
- **siteName** (Text)
- **siteDescription** (Text)
- **logo** (Media, single)
- **favicon** (Media, single)
- **contactEmail** (Email)
- **contactPhone** (Text)
- **address** (Component: `address.full`, single)
- **socialMedia** (Component: `social.links`, repeatable)
- **shipping** (Component: `shipping.config`, single)
- **returns** (Component: `returns.policy`, single)
- **paymentMethods** (Component: `payment.method`, repeatable)
- **currency** (Text, default: `ZAR`)
- **taxRate** (Decimal)
- **trustIndicators** (Component: `trust.stats`, single)

4. Click **Save**

### 3.8 Promotion (Collection Type)

1. Click **Create new collection type**
2. Name: `Promotion`
3. Click **Continue**

**Add Fields:**
- **name** (Text, required)
- **code** (Text, unique, required)
- **type** (Enumeration: `percentage`, `fixed_amount`, `free_shipping`, required)
- **value** (Decimal, required)
- **minPurchase** (Decimal, optional)
- **maxDiscount** (Decimal, optional)
- **startDate** (DateTime, required)
- **endDate** (DateTime, required)
- **usageLimit** (Integer, optional)
- **usageCount** (Integer, default: 0)
- **isActive** (Boolean, default: true)
- **applicableCategories** (Relation → Category, manyToMany)
- **applicableProducts** (Relation → Product, manyToMany)

4. Click **Save**

### 3.9 Order (Collection Type) - Enhance Existing

If Order already exists, check these fields exist:

**Required Fields:**
- **orderNumber** (Text, unique, required)
- **customer** (Relation → User, manyToOne)
- **items** (JSON, required)
- **total** (Decimal, required)
- **status** (Enumeration: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`, `refunded`, default: `pending`)
- **paymentStatus** (Enumeration: `pending`, `paid`, `failed`, `refunded`, `partially_refunded`, default: `pending`)
- **shippingAddress** (JSON, required)
- **billingAddress** (JSON)
- **orderDate** (DateTime, required)
- **trackingNumber** (Text, optional)
- **estimatedDelivery** (Date, optional)

### 3.10 Design Request (Collection Type) - Enhance Existing

If Design Request already exists, check these fields:

**Required Fields:**
- **title** (Text, required)
- **description** (Text, required)
- **category** (Text, required)
- **budget** (Text, required)
- **timeline** (Text, required)
- **materials** (JSON - array of strings)
- **colors** (JSON - array of strings)
- **size** (Text, required)
- **referenceImages** (Media, multiple)
- **additionalNotes** (Text)
- **customer** (Relation → User, manyToOne, optional)
- **customerEmail** (Email, required)
- **customerName** (Text, required)
- **status** (Enumeration: `pending`, `reviewed`, `approved`, `in_progress`, `completed`, `rejected`, default: `pending`)
- **adminNotes** (Text, optional)
- **estimatedPrice** (Decimal, optional)
- **estimatedDelivery** (Date, optional)

---

## 🔐 Step 4: Configure Permissions (Again)

After creating all content types, update permissions:

### Public Role
Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**

Enable:
- ✅ `product` → `find`, `findOne`
- ✅ `category` → `find`, `findOne`
- ✅ `review` → `find`, `findOne` (add filter: `status = approved`)
- ✅ `testimonial` → `find`, `findOne` (add filter: `status = published`)
- ✅ `hero-slide` → `find`, `findOne` (add filter: `isActive = true`)
- ✅ `lookbook` → `find`, `findOne`
- ✅ `site-setting` → `find`
- ✅ `promotion` → `find`, `findOne` (add filter: `isActive = true`)
- ✅ `article` → `find`, `findOne` (if created)
- ✅ `faq` → `find`, `findOne` (if created)

### Authenticated Role
Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Authenticated**

Enable:
- ✅ `product` → `find`, `findOne`
- ✅ `category` → `find`, `findOne`
- ✅ `review` → `find`, `findOne`, `create`
- ✅ `order` → `create`
- ✅ `design-request` → `create`
- ✅ `user` → `findMe`, `updateMe` (if available)

### Admin Role
- Full access to everything (default)

---

## ✅ Step 5: Verify Setup

### 5.1 Test Authentication

1. Go to your frontend
2. Try to register a new user
3. Try to login
4. Check if JWT token is received

### 5.2 Test API Endpoints

Test these endpoints (replace `localhost:1337` with your Strapi URL):

```bash
# Get products (public)
GET http://localhost:1337/api/products

# Get single product
GET http://localhost:1337/api/products/1

# Get categories
GET http://localhost:1337/api/categories

# Get site settings
GET http://localhost:1337/api/site-setting

# Register user
POST http://localhost:1337/api/auth/local/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:1337/api/auth/local
Body: {
  "identifier": "test@example.com",
  "password": "password123"
}
```

### 5.3 Check Environment Variables

Make sure your `.env` file has:

```env
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_TOKEN=your-api-token-here
```

---

## 📝 Step 6: Add Initial Data

### 6.1 Create Site Settings

1. Go to **Content Manager** → **Site Settings**
2. Click **Create new entry**
3. Fill in:
   - Site name
   - Contact email
   - Shipping rates
   - Return policy
   - etc.
4. Click **Save** → **Publish**

### 6.2 Create Categories

1. Go to **Content Manager** → **Category**
2. Create categories like:
   - Basics
   - Graphic Tees
   - Hoodies
   - etc.

### 6.3 Create Products

1. Go to **Content Manager** → **Product**
2. Click **Create new entry**
3. Fill in product details
4. Upload images
5. Link to category
6. Click **Save** → **Publish**

---

## 🚨 Important Notes

1. **Restart Strapi** after:
   - Modifying User content type
   - Creating new content types
   - Changing component structures

2. **Permissions** must be set for each content type after creation

3. **Relations** can only be set after both content types exist

4. **Media** should be uploaded to Media Library first, then linked

5. **Draft/Publish** - Enable for content that needs approval workflow

---

## 🔧 Troubleshooting

### Authentication Not Working
- Check if user registration is enabled
- Verify permissions for `auth` endpoints
- Check CORS settings
- Verify JWT secret is set

### API Returns 403
- Check permissions for the role
- Verify API token is correct
- Check if content is published (if using draft/publish)

### Relations Not Working
- Make sure both content types exist
- Verify relation is set up correctly
- Check permissions for both content types

---

## 📞 Next Steps

1. ✅ All content types created
2. ✅ Permissions configured
3. ✅ Authentication enabled
4. ✅ Add initial data
5. ✅ Test API endpoints
6. ✅ Update frontend to use Strapi

For detailed field configurations, see `STRAPI_CONTENT_TYPES_GUIDE.md`

