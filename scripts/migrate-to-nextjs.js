#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Next.js Migration...\n');

// Step 1: Backup current package.json
console.log('📦 Step 1: Backing up current package.json...');
if (fs.existsSync('package.json')) {
  fs.copyFileSync('package.json', 'package-vite-backup.json');
  console.log('✅ package.json backed up as package-vite-backup.json');
}

// Step 2: Install Next.js dependencies
console.log('\n📦 Step 2: Installing Next.js dependencies...');
if (fs.existsSync('package-nextjs.json')) {
  fs.copyFileSync('package-nextjs.json', 'package.json');
  console.log('✅ Next.js package.json installed');
} else {
  console.log('❌ package-nextjs.json not found');
  process.exit(1);
}

// Step 3: Update import paths in components
console.log('\n🔧 Step 3: Updating import paths...');

const updateImports = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update React Router imports
  content = content.replace(
    /import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/g,
    "import { useRouter } from 'next/navigation';"
  );
  
  content = content.replace(
    /const\s+navigate\s*=\s*useNavigate\(\);?/g,
    'const router = useRouter();'
  );
  
  content = content.replace(
    /navigate\((['"`][^'"`]+['"`])\)/g,
    'router.push($1)'
  );
  
  // Update Link imports
  content = content.replace(
    /import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/g,
    "import Link from 'next/link';"
  );
  
  // Update Link usage
  content = content.replace(
    /<Link\s+to=(['"`][^'"`]+['"`])/g,
    '<Link href=$1'
  );
  
  fs.writeFileSync(filePath, content);
};

// Update all TypeScript files
const updateAllFiles = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updateAllFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateImports(filePath);
    }
  });
};

updateAllFiles('src');
console.log('✅ Import paths updated');

// Step 4: Create Next.js specific files
console.log('\n📁 Step 4: Creating Next.js specific files...');

// Create tsconfig.json for Next.js
const nextjsTsConfig = {
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
};

fs.writeFileSync('tsconfig.json', JSON.stringify(nextjsTsConfig, null, 2));
console.log('✅ tsconfig.json updated for Next.js');

// Step 5: Update tailwind.config.js
console.log('\n🎨 Step 5: Updating Tailwind configuration...');

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}`;

fs.writeFileSync('tailwind.config.js', tailwindConfig);
console.log('✅ Tailwind configuration updated');

// Step 6: Create .env.local template
console.log('\n🔐 Step 6: Creating environment template...');

const envTemplate = `# Next.js Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Server-side environment variables
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_service_api_key
`;

fs.writeFileSync('.env.local.example', envTemplate);
console.log('✅ Environment template created');

console.log('\n🎉 Migration completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Copy .env.local.example to .env.local and fill in your values');
console.log('3. Run: npm run dev');
console.log('4. Test all functionality');
console.log('\n📖 See NEXTJS_MIGRATION_GUIDE.md for detailed instructions');
