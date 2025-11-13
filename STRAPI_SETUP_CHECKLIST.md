# ✅ Strapi Setup Checklist - Quick Reference

Use this checklist to ensure everything is set up correctly.

## 🔐 Authentication Setup

- [ ] **Step 1:** Enable user registration
  - Settings → Users & Permissions Plugin → Advanced Settings
  - Toggle "Allow user registration" ON
  - Save

- [ ] **Step 2:** Add custom fields to User
  - Content-Type Builder → User
  - Add `firstName` (Text)
  - Add `lastName` (Text)
  - Save
  - **RESTART STRAPI** ⚠️

- [ ] **Step 3:** Configure Public role permissions
  - Settings → Users & Permissions Plugin → Roles → Public
  - Enable: `auth` → `register`, `emailConfirmation`, `forgotPassword`, `resetPassword`
  - Enable: `product` → `find`, `findOne`
  - Enable: `category` → `find`, `findOne`
  - Enable: `review` → `find`, `findOne` (filter: status = approved)
  - Enable: `testimonial` → `find`, `findOne` (filter: status = published)
  - Enable: `hero-slide` → `find`, `findOne` (filter: isActive = true)
  - Enable: `lookbook` → `find`, `findOne`
  - Enable: `site-setting` → `find`
  - Save

- [ ] **Step 4:** Configure Authenticated role permissions
  - Settings → Users & Permissions Plugin → Roles → Authenticated
  - Enable: `product` → `find`, `findOne`
  - Enable: `category` → `find`, `findOne`
  - Enable: `review` → `find`, `findOne`, `create`
  - Enable: `order` → `create`
  - Enable: `design-request` → `create`
  - Enable: `user` → `findMe`, `updateMe`
  - Save

- [ ] **Step 5:** Create API Token
  - Settings → API Tokens → Create new API Token
  - Name: "Frontend API Token"
  - Type: Full access (or Read-only)
  - Duration: Unlimited
  - **COPY TOKEN** (you'll only see it once!)
  - Add to `.env`: `REACT_APP_STRAPI_TOKEN=your-token`

---

## 🧩 Components (Create These First!)

- [ ] `product.color` (repeatable)
  - name (Text)
  - value (Text)

- [ ] `product.dimensions` (single)
  - length (Decimal)
  - width (Decimal)
  - height (Decimal)

- [ ] `slide.feature` (repeatable)
  - text (Text)

- [ ] `slide.colors` (single)
  - background (Text)
  - text (Text)

- [ ] `address.full` (single)
  - line1 (Text)
  - line2 (Text)
  - city (Text)
  - postalCode (Text)
  - country (Text)

- [ ] `social.links` (repeatable)
  - platform (Text)
  - url (Text)

- [ ] `shipping.config` (single)
  - freeShippingThreshold (Decimal)
  - standardShippingRate (Decimal)
  - expressShippingRate (Decimal)
  - deliveryDays (Text)

- [ ] `returns.policy` (single)
  - returnDays (Integer)
  - refundDays (Text)
  - returnPolicy (Rich Text)

- [ ] `payment.method` (repeatable)
  - name (Text)
  - enabled (Boolean)
  - icon (Media, optional)

- [ ] `trust.stats` (single)
  - happyCustomers (Text)
  - ordersDelivered (Text)
  - averageRating (Decimal)

---

## 📦 Content Types

- [ ] **Product** (Collection Type) ⭐ START HERE
  - name, slug, description, price, sku, stock, images
  - sizes (JSON), colors (component), dimensions (component)
  - featured, isNew, isActive, rating, reviewCount
  - category (relation), tags (JSON)
  - seoTitle, seoDescription

- [ ] **Category** (Collection Type)
  - name, slug, description, image
  - parentCategory (self-relation), isActive, order
  - seoTitle, seoDescription

- [ ] **Review** (Collection Type)
  - product (relation), user (relation), userName, userEmail
  - rating, title, comment, verified, helpful
  - images, status (enum), adminNotes

- [ ] **Testimonial** (Collection Type)
  - name, location, rating, text, avatar
  - verified, purchase, date, helpful, images
  - tags (JSON), featured, status (enum)

- [ ] **Hero Slide** (Collection Type)
  - title, subtitle, cta, ctaLink, promo
  - media, mediaType (enum), features (component)
  - colorScheme (component), order, isActive
  - startDate, endDate

- [ ] **Lookbook** (Collection Type)
  - title, description, category, season
  - featured, images, products (relation)
  - tags (JSON), publishedAt

- [ ] **Site Settings** (Singleton) ⭐ IMPORTANT
  - siteName, siteDescription, logo, favicon
  - contactEmail, contactPhone, address (component)
  - socialMedia (component), shipping (component)
  - returns (component), paymentMethods (component)
  - currency, taxRate, trustIndicators (component)

- [ ] **Promotion** (Collection Type)
  - name, code (unique), type (enum), value
  - minPurchase, maxDiscount, startDate, endDate
  - usageLimit, usageCount, isActive
  - applicableCategories (relation), applicableProducts (relation)

- [ ] **Order** (Collection Type) - Verify/Enhance
  - orderNumber (unique), customer (relation), items (JSON)
  - total, status (enum), paymentStatus (enum)
  - shippingAddress (JSON), billingAddress (JSON)
  - orderDate, trackingNumber, estimatedDelivery

- [ ] **Design Request** (Collection Type) - Verify/Enhance
  - title, description, category, budget, timeline
  - materials (JSON), colors (JSON), size
  - referenceImages, additionalNotes
  - customer (relation), customerEmail, customerName
  - status (enum), adminNotes, estimatedPrice, estimatedDelivery

---

## 🔗 Relations Setup

- [ ] Product → Category (manyToOne or manyToMany)
- [ ] Review → Product (manyToOne)
- [ ] Review → User (manyToOne)
- [ ] Order → User (manyToOne)
- [ ] Design Request → User (manyToOne)
- [ ] Lookbook → Product (manyToMany)
- [ ] Promotion → Category (manyToMany)
- [ ] Promotion → Product (manyToMany)

---

## 🔐 Final Permissions Check

- [ ] Public role has read access to public content
- [ ] Authenticated role can create reviews, orders, design requests
- [ ] Authenticated role can read own orders/design requests
- [ ] Admin role has full access

---

## 🧪 Testing

- [ ] Test user registration
  ```bash
  POST /api/auth/local/register
  ```

- [ ] Test user login
  ```bash
  POST /api/auth/local
  ```

- [ ] Test get current user
  ```bash
  GET /api/users/me
  Headers: Authorization: Bearer JWT_TOKEN
  ```

- [ ] Test get products (public)
  ```bash
  GET /api/products
  ```

- [ ] Test get categories (public)
  ```bash
  GET /api/categories
  ```

- [ ] Test get site settings (public)
  ```bash
  GET /api/site-setting
  ```

- [ ] Test create review (authenticated)
  ```bash
  POST /api/reviews
  Headers: Authorization: Bearer JWT_TOKEN
  ```

---

## 📝 Environment Variables

Check your `.env` file has:

- [ ] `REACT_APP_STRAPI_URL=http://localhost:1337`
- [ ] `REACT_APP_USE_STRAPI_AUTH=true`
- [ ] `REACT_APP_STRAPI_TOKEN=your-api-token-here`

---

## 📊 Initial Data

- [ ] Create Site Settings entry
- [ ] Create at least 3 Categories
- [ ] Create at least 5 Products
- [ ] Upload product images
- [ ] Link products to categories
- [ ] Create 1-2 Hero Slides
- [ ] Create 2-3 Testimonials

---

## ✅ Final Verification

- [ ] Strapi is running without errors
- [ ] Can access admin panel
- [ ] Can register new user from frontend
- [ ] Can login from frontend
- [ ] Can fetch products from frontend
- [ ] Can create review (if logged in)
- [ ] Can create order (if logged in)
- [ ] All content types are accessible via API

---

## 🚨 Common Issues to Check

- [ ] Strapi restarted after User modifications
- [ ] CORS configured correctly
- [ ] API token is valid
- [ ] Permissions are saved
- [ ] Content is published (if using draft/publish)
- [ ] Relations are set up correctly
- [ ] Media files are uploaded

---

## 📚 Documentation Reference

- **Complete Setup:** `STRAPI_COMPLETE_SETUP.md`
- **Authentication:** `STRAPI_AUTHENTICATION_SETUP.md`
- **Content Types:** `STRAPI_CONTENT_TYPES_GUIDE.md`
- **Migration Plan:** `STRAPI_MIGRATION_PLAN.md`

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

Mark each item as you complete it!

