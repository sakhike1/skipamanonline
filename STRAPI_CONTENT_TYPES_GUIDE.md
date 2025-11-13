# 📋 Strapi Content Types Setup Guide

This guide provides step-by-step instructions for creating all content types in Strapi Admin Panel.

## 🎯 Content Types to Create

### 1. Product (Collection Type) ⭐ **START HERE**

**Path:** Content-Type Builder → Create new collection type → "Product"

**Fields:**
```
Basic Information:
├── name (Text, required)
├── slug (UID, from: name, unique)
├── description (Rich Text)
├── shortDescription (Text)
├── sku (Text, unique, required)
│
Pricing & Inventory:
├── price (Decimal, required)
├── compareAtPrice (Decimal, optional)
├── stock (Integer, default: 0)
├── weight (Decimal)
│
Media:
├── images (Media, multiple, required)
│
Relations:
├── category (Relation → Category, manyToOne)
│
Product Details:
├── sizes (JSON) - Array: ["S", "M", "L", "XL", "XXL"]
├── colors (Component: product.color, repeatable)
│   ├── name (Text)
│   └── value (Text)
├── dimensions (Component: product.dimensions, single)
│   ├── length (Decimal)
│   ├── width (Decimal)
│   └── height (Decimal)
│
Flags:
├── featured (Boolean, default: false)
├── isNew (Boolean, default: false)
├── isActive (Boolean, default: true)
│
Ratings:
├── rating (Decimal, 0-5, default: 0)
├── reviewCount (Integer, default: 0)
│
SEO:
├── seoTitle (Text)
├── seoDescription (Text)
│
Metadata:
├── tags (JSON) - Array of strings
```

**Components to Create First:**
- `product.color` (Component, repeatable)
- `product.dimensions` (Component, single)

---

### 2. Category (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Category"

**Fields:**
```
├── name (Text, required)
├── slug (UID, from: name, unique)
├── description (Rich Text)
├── image (Media, single)
├── parentCategory (Relation → Category, self-referencing, optional)
├── isActive (Boolean, default: true)
├── order (Integer, default: 0)
├── seoTitle (Text)
└── seoDescription (Text)
```

---

### 3. Review (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Review"

**Fields:**
```
├── product (Relation → Product, manyToOne, required)
├── user (Relation → User, manyToOne, optional)
├── userName (Text, required)
├── userEmail (Email, optional)
├── rating (Integer, 1-5, required)
├── title (Text, required)
├── comment (Text, required)
├── verified (Boolean, default: false)
├── helpful (Integer, default: 0)
├── images (Media, multiple, optional)
├── status (Enumeration: pending, approved, rejected, default: pending)
└── adminNotes (Text, optional)
```

**Permissions:**
- Public: Read (approved reviews only)
- Authenticated: Create
- Admin: Full access

---

### 4. Testimonial (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Testimonial"

**Fields:**
```
├── name (Text, required)
├── location (Text)
├── rating (Integer, 1-5)
├── text (Text, required)
├── avatar (Media, single)
├── verified (Boolean, default: false)
├── purchase (Text)
├── date (Date)
├── helpful (Integer, default: 0)
├── images (Media, multiple)
├── tags (JSON) - Array of strings
├── featured (Boolean, default: false)
└── status (Enumeration: draft, published, archived, default: draft)
```

---

### 5. Hero Slide (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Hero Slide"

**Fields:**
```
├── title (Text, required)
├── subtitle (Text)
├── cta (Text - button text)
├── ctaLink (Text - button URL)
├── promo (Text - promotional message)
├── media (Media, single)
├── mediaType (Enumeration: image, video, default: image)
├── features (Component: slide.feature, repeatable)
│   └── text (Text)
├── colorScheme (Component: slide.colors, single)
│   ├── background (Text)
│   └── text (Text)
├── order (Integer, default: 0)
├── isActive (Boolean, default: true)
├── startDate (DateTime)
└── endDate (DateTime)
```

**Components to Create:**
- `slide.feature` (Component, repeatable)
- `slide.colors` (Component, single)

---

### 6. Lookbook (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Lookbook"

**Fields:**
```
├── title (Text, required)
├── description (Rich Text)
├── category (Text)
├── season (Text)
├── featured (Boolean, default: false)
├── images (Media, multiple, required)
├── products (Relation → Product, manyToMany)
├── tags (JSON) - Array of strings
└── publishedAt (DateTime)
```

---

### 7. Site Settings (Singleton) ⭐ **IMPORTANT**

**Path:** Content-Type Builder → Create new single type → "Site Settings"

**Fields:**
```
Basic Info:
├── siteName (Text)
├── siteDescription (Text)
├── logo (Media, single)
├── favicon (Media, single)
│
Contact:
├── contactEmail (Email)
├── contactPhone (Text)
├── address (Component: address.full, single)
│   ├── line1 (Text)
│   ├── line2 (Text)
│   ├── city (Text)
│   ├── postalCode (Text)
│   └── country (Text)
│
Social Media:
├── socialMedia (Component: social.links, repeatable)
│   ├── platform (Text)
│   └── url (Text)
│
Shipping:
├── shipping (Component: shipping.config, single)
│   ├── freeShippingThreshold (Decimal)
│   ├── standardShippingRate (Decimal)
│   ├── expressShippingRate (Decimal)
│   └── deliveryDays (Text)
│
Returns:
├── returns (Component: returns.policy, single)
│   ├── returnDays (Integer)
│   ├── refundDays (Text)
│   └── returnPolicy (Rich Text)
│
Payment:
├── paymentMethods (Component: payment.method, repeatable)
│   ├── name (Text)
│   ├── enabled (Boolean)
│   └── icon (Media, optional)
│
Business:
├── currency (Text, default: ZAR)
├── taxRate (Decimal)
│
Trust Indicators:
└── trustIndicators (Component: trust.stats, single)
    ├── happyCustomers (Text)
    ├── ordersDelivered (Text)
    └── averageRating (Decimal)
```

**Components to Create:**
- `address.full` (Component, single)
- `social.links` (Component, repeatable)
- `shipping.config` (Component, single)
- `returns.policy` (Component, single)
- `payment.method` (Component, repeatable)
- `trust.stats` (Component, single)

---

### 8. Promotion (Collection Type)

**Path:** Content-Type Builder → Create new collection type → "Promotion"

**Fields:**
```
├── name (Text, required)
├── code (Text, unique, required)
├── type (Enumeration: percentage, fixed_amount, free_shipping, required)
├── value (Decimal, required)
├── minPurchase (Decimal, optional)
├── maxDiscount (Decimal, optional)
├── startDate (DateTime, required)
├── endDate (DateTime, required)
├── usageLimit (Integer, optional)
├── usageCount (Integer, default: 0)
├── isActive (Boolean, default: true)
├── applicableCategories (Relation → Category, manyToMany)
└── applicableProducts (Relation → Product, manyToMany)
```

---

### 9. Article (Collection Type) - Optional

**Path:** Content-Type Builder → Create new collection type → "Article"

**Fields:**
```
├── title (Text, required)
├── slug (UID, from: title)
├── excerpt (Text)
├── content (Rich Text, required)
├── featuredImage (Media, single)
├── author (Relation → User, manyToOne)
├── category (Text)
├── tags (JSON) - Array of strings
├── publishedAt (DateTime)
├── seoTitle (Text)
└── seoDescription (Text)
```

---

### 10. FAQ (Collection Type) - Optional

**Path:** Content-Type Builder → Create new collection type → "FAQ"

**Fields:**
```
├── question (Text, required)
├── answer (Rich Text, required)
├── category (Text)
├── order (Integer, default: 0)
└── isActive (Boolean, default: true)
```

---

## 🔧 Components to Create

Create these reusable components first, then use them in content types:

### product.color (Repeatable)
```
├── name (Text, required)
└── value (Text, required)
```

### product.dimensions (Single)
```
├── length (Decimal, required)
├── width (Decimal, required)
└── height (Decimal, required)
```

### slide.feature (Repeatable)
```
└── text (Text, required)
```

### slide.colors (Single)
```
├── background (Text)
└── text (Text)
```

### address.full (Single)
```
├── line1 (Text, required)
├── line2 (Text)
├── city (Text, required)
├── postalCode (Text, required)
└── country (Text, required)
```

### social.links (Repeatable)
```
├── platform (Text, required)
└── url (Text, required)
```

### shipping.config (Single)
```
├── freeShippingThreshold (Decimal)
├── standardShippingRate (Decimal)
├── expressShippingRate (Decimal)
└── deliveryDays (Text)
```

### returns.policy (Single)
```
├── returnDays (Integer)
├── refundDays (Text)
└── returnPolicy (Rich Text)
```

### payment.method (Repeatable)
```
├── name (Text, required)
├── enabled (Boolean, default: true)
└── icon (Media, optional)
```

### trust.stats (Single)
```
├── happyCustomers (Text)
├── ordersDelivered (Text)
└── averageRating (Decimal)
```

---

## 🔐 Permissions Setup

After creating content types, configure permissions:

**Path:** Settings → Users & Permissions Plugin → Roles

### Public Role
- **Product**: find, findOne
- **Category**: find, findOne
- **Review**: find, findOne (with filter: status = approved)
- **Testimonial**: find, findOne (with filter: status = published)
- **Hero Slide**: find, findOne (with filter: isActive = true)
- **Lookbook**: find, findOne
- **Site Settings**: find
- **Article**: find, findOne
- **FAQ**: find, findOne

### Authenticated Role
- **Product**: find, findOne
- **Category**: find, findOne
- **Review**: find, findOne, create (own reviews)
- **Order**: create, find (own orders), findOne (own orders)
- **Design Request**: create, find (own requests), findOne (own requests)

### Admin Role
- Full access to all content types

---

## 📝 Next Steps

1. ✅ Create components first (reusable structures)
2. ✅ Create Product content type
3. ✅ Create Category content type
4. ✅ Link Products to Categories
5. ✅ Migrate existing products
6. ✅ Create other content types as needed
7. ✅ Set up permissions
8. ✅ Test API endpoints
9. ✅ Update frontend to use Strapi

---

## 🚨 Important Notes

1. **Create Components First**: Components must be created before you can use them in content types
2. **Relations**: Set up relations after both content types exist
3. **Media**: Upload images to Media Library first, then link them
4. **Permissions**: Always set up permissions after creating content types
5. **Draft/Publish**: Enable for content that needs approval workflow
6. **Unique Fields**: SKU, slug, code fields should be unique
7. **Default Values**: Set sensible defaults for better UX

---

## ✅ Checklist

- [ ] Create all components
- [ ] Create Product content type
- [ ] Create Category content type
- [ ] Create Review content type
- [ ] Create Testimonial content type
- [ ] Create Hero Slide content type
- [ ] Create Lookbook content type
- [ ] Create Site Settings singleton
- [ ] Create Promotion content type
- [ ] Set up all relations
- [ ] Configure permissions
- [ ] Test API endpoints
- [ ] Migrate existing data
- [ ] Update frontend services

---

For detailed migration steps, see `STRAPI_MIGRATION_PLAN.md`



