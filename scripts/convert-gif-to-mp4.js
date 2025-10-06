import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertGifToMp4 = () => {
  const assetsDir = path.join(__dirname, '../src/assets');
  const gifFile = 'Lets_a_create_202505260200.gif';
  const gifPath = path.join(assetsDir, gifFile);
  
  console.log('🎬 GIF to MP4 Conversion Guide');
  console.log('================================');
  
  if (!fs.existsSync(gifPath)) {
    console.log(`❌ GIF file not found: ${gifFile}`);
    return;
  }
  
  const stats = fs.statSync(gifPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`📁 Found GIF: ${gifFile} (${sizeMB}MB)`);
  console.log('\n💡 Conversion Options:');
  console.log('\n1. Using FFmpeg (Recommended):');
  console.log('   Install FFmpeg: https://ffmpeg.org/download.html');
  console.log('   Then run:');
  console.log(`   ffmpeg -i "${gifPath}" -vf "scale=800:-1" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${gifPath.replace('.gif', '.mp4')}"`);
  
  console.log('\n2. Using Online Tools:');
  console.log('   - CloudConvert: https://cloudconvert.com/gif-to-mp4');
  console.log('   - Convertio: https://convertio.co/gif-mp4/');
  console.log('   - Online-Convert: https://www.online-convert.com/');
  
  console.log('\n3. Using Node.js Libraries:');
  console.log('   npm install fluent-ffmpeg');
  console.log('   Then use the fluent-ffmpeg library in your code');
  
  console.log('\n🎯 Recommended Settings:');
  console.log('   - Resolution: 800px width (maintain aspect ratio)');
  console.log('   - Codec: H.264 (libx264)');
  console.log('   - Pixel format: yuv420p (for compatibility)');
  console.log('   - Fast start: Enable for web streaming');
  console.log('   - Quality: CRF 23 (good balance of size/quality)');
  
  console.log('\n📊 Expected Results:');
  console.log(`   Current GIF: ${sizeMB}MB`);
  console.log('   Expected MP4: ~1-3MB (70-90% size reduction)');
  
  console.log('\n🔄 After Conversion:');
  console.log('   1. Replace the GIF reference in your code');
  console.log('   2. Update the Hero component to use the MP4');
  console.log('   3. Add a poster image for the video');
  console.log('   4. Test the loading performance');
  
  console.log('\n🚀 Quick FFmpeg Command:');
  console.log(`ffmpeg -i "${gifPath}" -vf "scale=800:-1" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -crf 23 "${gifPath.replace('.gif', '.mp4')}"`);
};

convertGifToMp4();
