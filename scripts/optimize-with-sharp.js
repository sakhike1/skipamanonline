import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Advanced image optimization script using sharp
// Run: npm install sharp (if not already installed)

const optimizeImages = async () => {
  let sharp;
  try {
    sharp = await import('sharp');
  } catch (error) {
    console.log('❌ Sharp not installed. Run: npm install sharp');
    console.log('📝 This script requires sharp for image optimization');
    process.exit(1);
  }
  const assetsDir = path.join(__dirname, '../src/assets');
  const publicImagesDir = path.join(__dirname, '../public/images');
  const outputDir = path.join(__dirname, '../public/optimized');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('🚀 Starting image optimization...');
  
  const processDirectory = async (dir, outputSubDir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    for (const file of imageFiles) {
      const inputPath = path.join(dir, file);
      const outputSubPath = path.join(outputDir, outputSubDir);
      
      if (!fs.existsSync(outputSubPath)) {
        fs.mkdirSync(outputSubPath, { recursive: true });
      }
      
      const stats = fs.statSync(inputPath);
      const originalSize = (stats.size / (1024 * 1024)).toFixed(2);
      
      try {
        // Get file extension
        const ext = path.extname(file).toLowerCase();
        const nameWithoutExt = path.basename(file, ext);
        
        // Process different formats
        if (ext === '.png') {
          // Convert PNG to WebP and optimized PNG
          await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(path.join(outputSubPath, `${nameWithoutExt}.webp`));
            
          await sharp(inputPath)
            .png({ compressionLevel: 9 })
            .toFile(path.join(outputSubPath, `${nameWithoutExt}_optimized.png`));
            
        } else if (ext === '.jpg' || ext === '.jpeg') {
          // Optimize JPEG and convert to WebP
          await sharp(inputPath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(path.join(outputSubPath, `${nameWithoutExt}_optimized.jpg`));
            
          await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(path.join(outputSubPath, `${nameWithoutExt}.webp`));
            
        } else if (ext === '.gif') {
          // For GIFs, we'll just copy them as they need special handling
          console.log(`⚠️  GIF file detected: ${file} (${originalSize}MB)`);
          console.log(`   Consider converting to MP4 video for better performance`);
          fs.copyFileSync(inputPath, path.join(outputSubPath, file));
        }
        
        // Get optimized file size
        const optimizedFiles = fs.readdirSync(outputSubPath).filter(f => 
          f.startsWith(nameWithoutExt)
        );
        
        console.log(`✅ ${file} (${originalSize}MB) -> optimized`);
        optimizedFiles.forEach(optFile => {
          const optStats = fs.statSync(path.join(outputSubPath, optFile));
          const optSize = (optStats.size / (1024 * 1024)).toFixed(2);
          console.log(`   ${optFile}: ${optSize}MB`);
        });
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  };
  
  // Process both directories
  await processDirectory(assetsDir, 'assets');
  await processDirectory(publicImagesDir, 'images');
  
  console.log('\n🎉 Image optimization complete!');
  console.log('📁 Optimized images saved to: public/optimized/');
  console.log('\n💡 Next steps:');
  console.log('1. Update your components to use the optimized images');
  console.log('2. Implement WebP support with fallbacks');
  console.log('3. Use the OptimizedImage component for lazy loading');
};

optimizeImages().catch(console.error);
