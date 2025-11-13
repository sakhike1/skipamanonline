#!/usr/bin/env node

/**
 * Strapi Setup Script for SkipaMan Store
 * This script helps set up Strapi with the necessary content types and configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Strapi for SkipaMan Store...\n');

// Content type configurations
const contentTypes = {
  order: {
    "kind": "collectionType",
    "collectionName": "orders",
    "info": {
      "singularName": "order",
      "pluralName": "orders",
      "displayName": "Order",
      "description": "Customer orders"
    },
    "options": {
      "draftAndPublish": false
    },
    "pluginOptions": {},
    "attributes": {
      "orderNumber": {
        "type": "string",
        "required": true,
        "unique": true
      },
      "customer": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "plugin::users-permissions.user"
      },
      "items": {
        "type": "json",
        "required": true
      },
      "total": {
        "type": "decimal",
        "required": true
      },
      "status": {
        "type": "enumeration",
        "enum": ["pending", "processing", "shipped", "delivered", "cancelled"],
        "default": "pending"
      },
      "paymentStatus": {
        "type": "enumeration",
        "enum": ["pending", "paid", "failed", "refunded"],
        "default": "pending"
      },
      "shippingAddress": {
        "type": "json",
        "required": true
      },
      "billingAddress": {
        "type": "json"
      },
      "trackingNumber": {
        "type": "string"
      },
      "estimatedDelivery": {
        "type": "date"
      },
      "orderDate": {
        "type": "datetime",
        "required": true
      },
      "notes": {
        "type": "text"
      }
    }
  },
  
  product: {
    "kind": "collectionType",
    "collectionName": "products",
    "info": {
      "singularName": "product",
      "pluralName": "products",
      "displayName": "Product",
      "description": "Store products"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {},
    "attributes": {
      "name": {
        "type": "string",
        "required": true
      },
      "description": {
        "type": "text"
      },
      "price": {
        "type": "decimal",
        "required": true
      },
      "images": {
        "type": "media",
        "multiple": true,
        "required": false,
        "allowedTypes": ["images"]
      },
      "category": {
        "type": "string",
        "required": true
      },
      "sizes": {
        "type": "json"
      },
      "colors": {
        "type": "json"
      },
      "inStock": {
        "type": "boolean",
        "default": true
      },
      "stockQuantity": {
        "type": "integer",
        "default": 0
      },
      "isNew": {
        "type": "boolean",
        "default": false
      },
      "isFeatured": {
        "type": "boolean",
        "default": false
      }
    }
  },

  supportRequest: {
    "kind": "collectionType",
    "collectionName": "support_requests",
    "info": {
      "singularName": "support-request",
      "pluralName": "support-requests",
      "displayName": "Support Request",
      "description": "Customer support requests"
    },
    "options": {
      "draftAndPublish": false
    },
    "pluginOptions": {},
    "attributes": {
      "customer": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "plugin::users-permissions.user"
      },
      "order": {
        "type": "relation",
        "relation": "manyToOne",
        "target": "api::order.order"
      },
      "type": {
        "type": "enumeration",
        "enum": ["return", "refund", "general", "complaint"],
        "required": true
      },
      "subject": {
        "type": "string",
        "required": true
      },
      "description": {
        "type": "text",
        "required": true
      },
      "status": {
        "type": "enumeration",
        "enum": ["open", "in_progress", "resolved", "closed"],
        "default": "open"
      },
      "priority": {
        "type": "enumeration",
        "enum": ["low", "medium", "high"],
        "default": "medium"
      },
      "response": {
        "type": "text"
      },
      "attachments": {
        "type": "media",
        "multiple": true,
        "allowedTypes": ["images", "files"]
      }
    }
  }
};

// Create content type files
const createContentType = (name, config) => {
  const contentPath = path.join(process.cwd(), 'src', 'api', name, 'content-types', name, 'schema.json');
  const dir = path.dirname(contentPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(contentPath, JSON.stringify(config, null, 2));
  console.log(`✅ Created content type: ${name}`);
};

// Create all content types
Object.entries(contentTypes).forEach(([name, config]) => {
  createContentType(name, config);
});

console.log('\n🎉 Strapi setup complete!');
console.log('\nNext steps:');
console.log('1. Run: npm run develop');
console.log('2. Go to http://localhost:1337/admin');
console.log('3. Create your admin account');
console.log('4. Configure API permissions in Settings > Roles & Permissions');
console.log('5. Add your API token to the React app environment variables');
console.log('\nFor detailed setup instructions, see STRAPI_INTEGRATION_GUIDE.md');
