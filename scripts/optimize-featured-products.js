import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance optimization for Featured Products section
const optimizeFeaturedProducts = () => {
  console.log('🚀 Optimizing Featured Products Performance...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const imagesDir = path.join(publicDir, 'images');
  
  // Check if images directory exists
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Images directory not found. Creating...');
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Get all image files
  const imageFiles = fs.readdirSync(imagesDir).filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`📊 Found ${imageFiles.length} images to analyze:`);
  
  let totalSize = 0;
  let largeImages = [];
  let recommendations = [];

  imageFiles.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    const sizeInKB = Math.round(stats.size / 1024);
    totalSize += sizeInKB;

    console.log(`  📷 ${file}: ${sizeInKB} KB`);

    // Identify large images (> 200KB)
    if (sizeInKB > 200) {
      largeImages.push({ file, size: sizeInKB });
    }

    // Check file format
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      recommendations.push({
        file,
        action: 'Convert to WebP',
        currentSize: sizeInKB,
        estimatedSavings: Math.round(sizeInKB * 0.3) // ~30% savings with WebP
      });
    }
  });

  console.log(`\n📈 Performance Analysis:`);
  console.log(`  Total images: ${imageFiles.length}`);
  console.log(`  Total size: ${Math.round(totalSize / 1024)} MB`);
  console.log(`  Average size: ${Math.round(totalSize / imageFiles.length)} KB`);

  if (largeImages.length > 0) {
    console.log(`\n⚠️  Large Images (>200KB):`);
    largeImages.forEach(({ file, size }) => {
      console.log(`  🔴 ${file}: ${size} KB`);
    });
  }

  if (recommendations.length > 0) {
    console.log(`\n💡 Optimization Recommendations:`);
    recommendations.forEach(({ file, action, currentSize, estimatedSavings }) => {
      console.log(`  ✅ ${file}: ${action} (Save ~${estimatedSavings} KB)`);
    });
  }

  // Generate optimization report
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: imageFiles.length,
    totalSizeKB: totalSize,
    largeImages,
    recommendations,
    performanceScore: calculatePerformanceScore(imageFiles.length, totalSize, largeImages.length)
  };

  // Save report
  const reportPath = path.join(__dirname, '..', 'featured-products-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📋 Optimization Report saved to: featured-products-optimization-report.json`);
  console.log(`🎯 Performance Score: ${report.performanceScore}/100`);

  // Generate optimization suggestions
  generateOptimizationSuggestions(report);
};

const calculatePerformanceScore = (totalImages, totalSizeKB, largeImagesCount) => {
  let score = 100;
  
  // Penalize for too many images
  if (totalImages > 20) score -= 20;
  else if (totalImages > 10) score -= 10;
  
  // Penalize for large total size
  const totalSizeMB = totalSizeKB / 1024;
  if (totalSizeMB > 10) score -= 30;
  else if (totalSizeMB > 5) score -= 20;
  else if (totalSizeMB > 2) score -= 10;
  
  // Penalize for large individual images
  if (largeImagesCount > 5) score -= 25;
  else if (largeImagesCount > 2) score -= 15;
  else if (largeImagesCount > 0) score -= 10;
  
  return Math.max(0, score);
};

const generateOptimizationSuggestions = (report) => {
  console.log(`\n🎯 Optimization Suggestions:`);
  
  if (report.largeImages.length > 0) {
    console.log(`\n1. 🖼️  Image Compression:`);
    console.log(`   - Compress ${report.largeImages.length} large images`);
    console.log(`   - Use tools like TinyPNG, ImageOptim, or Sharp`);
    console.log(`   - Target: < 200KB per image`);
  }
  
  if (report.recommendations.length > 0) {
    console.log(`\n2. 📱 Format Optimization:`);
    console.log(`   - Convert ${report.recommendations.length} images to WebP`);
    console.log(`   - Estimated savings: ${report.recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0)} KB`);
    console.log(`   - Use: npm run optimize:images:sharp`);
  }
  
  console.log(`\n3. 🚀 Loading Optimization:`);
  console.log(`   - Implement lazy loading (✅ Already done in OptimizedFeaturedProducts)`);
  console.log(`   - Use intersection observer for viewport-based loading`);
  console.log(`   - Preload critical images only`);
  
  console.log(`\n4. 🎨 Component Optimization:`);
  console.log(`   - Use React.memo for product cards`);
  console.log(`   - Implement virtual scrolling for large lists`);
  console.log(`   - Reduce animation frequency (✅ Already optimized)`);
  
  console.log(`\n5. 📊 Performance Monitoring:`);
  console.log(`   - Use Lighthouse for performance testing`);
  console.log(`   - Monitor Core Web Vitals`);
  console.log(`   - Test on slow 3G connections`);
  
  if (report.performanceScore < 70) {
    console.log(`\n⚠️  Performance Alert: Score is ${report.performanceScore}/100`);
    console.log(`   Consider implementing all optimization suggestions above.`);
  } else if (report.performanceScore < 85) {
    console.log(`\n✅ Good Performance: Score is ${report.performanceScore}/100`);
    console.log(`   Minor optimizations recommended.`);
  } else {
    console.log(`\n🎉 Excellent Performance: Score is ${report.performanceScore}/100`);
    console.log(`   Your featured products are well optimized!`);
  }
};

// Run optimization
optimizeFeaturedProducts();
