#!/usr/bin/env node

/**
 * Migration Script: Products to Strapi
 * 
 * This script helps migrate products from src/data/products.ts to Strapi CMS
 * 
 * Usage:
 *   1. Make sure Strapi is running
 *   2. Set STRAPI_URL and STRAPI_TOKEN in .env
 *   3. Run: node scripts/migrate-products-to-strapi.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.REACT_APP_STRAPI_TOKEN || process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ Error: STRAPI_TOKEN not found in environment variables');
  console.log('Please set REACT_APP_STRAPI_TOKEN or STRAPI_TOKEN in your .env file');
  process.exit(1);
}

// Read products from the data file
const productsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');
let products = [];

try {
  // This is a simple parser - for production, you might want a more robust solution
  const fileContent = fs.readFileSync(productsPath, 'utf-8');
  
  // Extract the products array (this is a simplified approach)
  // In production, you'd want to use a proper TypeScript parser
  console.log('📖 Reading products from:', productsPath);
  console.log('⚠️  Note: This script requires manual extraction of products data');
  console.log('   For automated migration, consider using the Strapi import feature');
  
} catch (error) {
  console.error('❌ Error reading products file:', error.message);
  process.exit(1);
}

/**
 * Transform product data to Strapi format
 */
function transformProductToStrapi(product) {
  return {
    data: {
      name: product.name,
      description: product.description,
      price: product.price / 100, // Convert from cents to currency units if needed
      sku: product.sku,
      stock: product.stock,
      weight: product.weight,
      dimensions: {
        length: product.dimensions.length,
        width: product.dimensions.width,
        height: product.dimensions.height
      },
      sizes: product.sizes,
      colors: product.colors,
      category: product.category, // This should be a relation ID in Strapi
      featured: product.featured,
      isNew: false, // Set based on your logic
      isActive: product.isActive,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags,
      // Note: Images need to be uploaded separately and referenced by ID
      // images: product.images.map(img => ({ id: uploadedImageId }))
    }
  };
}

/**
 * Upload product to Strapi
 */
async function uploadProductToStrapi(productData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload product: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading product:', error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrateProducts() {
  console.log('🚀 Starting product migration to Strapi...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 Using API Token: ${STRAPI_TOKEN ? 'Yes' : 'No'}\n`);

  // Check if Strapi is accessible
  try {
    const healthCheck = await fetch(`${STRAPI_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    
    if (healthCheck.status === 401) {
      console.error('❌ Authentication failed. Please check your API token.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Cannot connect to Strapi. Is it running?');
    console.error('   Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Connected to Strapi\n');

  // Instructions for manual migration
  console.log('📋 Migration Instructions:');
  console.log('');
  console.log('Since products.ts is a TypeScript file, you have two options:');
  console.log('');
  console.log('Option 1: Manual Migration (Recommended for first time)');
  console.log('  1. Open Strapi Admin Panel');
  console.log('  2. Go to Content-Type Builder → Products');
  console.log('  3. Use the "Import" feature or manually add products');
  console.log('  4. Upload product images to Media Library first');
  console.log('  5. Link images to products');
  console.log('');
  console.log('Option 2: Use Strapi Import Plugin');
  console.log('  1. Install Strapi Import plugin');
  console.log('  2. Export products from src/data/products.ts as JSON');
  console.log('  3. Use the import plugin to bulk import');
  console.log('');
  console.log('Option 3: Use this script with extracted JSON');
  console.log('  1. Convert products.ts to JSON format');
  console.log('  2. Update this script to read from JSON file');
  console.log('  3. Run the migration');
  console.log('');

  // If you have a JSON file, uncomment and use this:
  /*
  const jsonPath = path.join(process.cwd(), 'scripts', 'products-export.json');
  if (fs.existsSync(jsonPath)) {
    const productsJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📦 Found ${productsJson.length} products to migrate\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of productsJson) {
      try {
        const strapiProduct = transformProductToStrapi(product);
        const result = await uploadProductToStrapi(strapiProduct);
        console.log(`✅ Migrated: ${product.name}`);
        successCount++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to migrate ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📦 Total: ${productsJson.length}`);
  }
  */
}

// Run migration
migrateProducts().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});



