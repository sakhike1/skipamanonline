import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Skipaman Gray',
    description: 'Our signature classic tee in sleek gray. Made from 100% organic cotton for ultimate comfort and durability. Features a relaxed fit and soft-touch finish.',
    price: 50000,
    images: [
      '/images/grey1.png',
      '/images/grey2.png',
      '/images/grey3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gray', value: '#808080' },
    ],
    category: 'basics',
    featured: true,
    rating: 4.8,
    reviewCount: 127,
    stock: 50,
    sku: 'CBT-001',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['basic', 'cotton', 'comfortable'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Skipaman Blues',
    description: 'Express your love for technology with our AI Future graphic tee. Features a unique AI-inspired design on premium cotton fabric.',
    price: 50000,
    images: [
      '/images/blue1.png',
      '/images/blue2.png',
      '/images/blue3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', value: '#000080' },
      { name: 'Maroon', value: '#800000' },
    ],
    category: 'graphic',
    featured: true,
    rating: 4.9,
    reviewCount: 89,
    stock: 35,
    sku: 'AFGT-002',
    weight: 210,
    dimensions: { length: 72, width: 52, height: 1 },
    tags: ['graphic', 'ai', 'tech'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Skipaman White Box',
    description: 'Clean, simple, elegant. Our minimalist logo tee speaks volumes with its understated design and premium quality construction.',
    price: 50000,
    images: [
      '/images/white1.png',
      '/images/white2.png',
      '/images/white3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Light Gray', value: '#D3D3D3' },
      { name: 'Cream', value: '#F5F5DC' },
    ],
    category: 'minimalist',
    featured: true,
    rating: 4.7,
    reviewCount: 156,
    stock: 75,
    sku: 'MLT-003',
    weight: 195,
    dimensions: { length: 69, width: 49, height: 1 },
    tags: ['minimalist', 'logo', 'clean'],
    isActive: true,
  },
  {
    id: '4',
    name: 'Skipaman Vintage Charcoal',
    description: 'Rock your style with our vintage band tee collection. Featuring distressed prints and that perfect broken-in feel.',
    price: 50000,
    images: [
      '/images/orange1.png',
      '/images/orange2.png',
      '/images/orange3.png',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Slate Gray', value: '#708090' },
    ],
    category: 'vintage',
    featured: true,
    rating: 4.6,
    reviewCount: 73,
    stock: 25,
    sku: 'VBT-004',
    weight: 220,
    dimensions: { length: 71, width: 51, height: 1 },
    tags: ['vintage', 'band', 'retro'],
    isActive: true,
  },
  {
    id: '5',
    name: 'Skipaman Earth Green',
    description: 'Sustainable fashion meets style. Made from 100% organic cotton with eco-friendly dyes. Perfect for the environmentally conscious.',
    price: 50000,
    images: [
      '/images/new1.png',
      '/images/new2.png',
      '/images/new3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Earth Green', value: '#228B22' },
      { name: 'Natural Beige', value: '#F5F5DC' },
      { name: 'Ocean Blue', value: '#4682B4' },
    ],
    category: 'eco',
    featured: true,
    rating: 4.8,
    reviewCount: 94,
    stock: 60,
    sku: 'EFOT-005',
    weight: 185,
    dimensions: { length: 68, width: 48, height: 1 },
    tags: ['eco', 'organic', 'sustainable'],
    isActive: true,
  },
  {
    id: '6',
    name: 'Skipaman Premium Heather',
    description: 'Elevated basics with a modern twist. Features a subtle chest pocket and superior fabric blend for lasting comfort and style.',
    price: 50000,
    images: [
      '/images/white1.png',
      '/images/white2.png',
      '/images/white3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Heather Gray', value: '#D3D3D3' },
      { name: 'Navy', value: '#000080' },
      { name: 'Burgundy', value: '#800020' },
    ],
    category: 'premium',
    featured: true,
    rating: 4.7,
    reviewCount: 67,
    stock: 40,
    sku: 'PPT-006',
    weight: 205,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['premium', 'pocket', 'comfort'],
    isActive: true,
  },
  {
    id: '7',
    name: 'Skipaman Athletic Gray',
    description: 'Engineered for active lifestyles. Moisture-wicking technology and athletic fit make this perfect for workouts and casual wear.',
    price: 50000,
    images: [
      '/images/blue1.png',
      '/images/blue2.png',
      '/images/blue3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Athletic Gray', value: '#808080' },
      { name: 'Sport Blue', value: '#1E90FF' },
      { name: 'Energy Red', value: '#FF4500' },
    ],
    category: 'athletic',
    featured: true,
    rating: 4.5,
    reviewCount: 82,
    stock: 65,
    sku: 'SPT-007',
    weight: 175,
    dimensions: { length: 67, width: 47, height: 1 },
    tags: ['sport', 'performance', 'athletic'],
    isActive: true,
  },
  {
    id: '8',
    name: 'Skipaman Black Artist',
    description: 'Collaboration with local artists brings you unique, limited-edition designs. Only 100 pieces available - collect them all!',
    price: 50000,
    images: [
      '/images/orange1.png',
      '/images/orange2.png',
      '/images/orange3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Artist Black', value: '#000000' },
      { name: 'Gallery White', value: '#FFFFFF' },
    ],
    category: 'limited',
    featured: true,
    rating: 4.9,
    reviewCount: 45,
    stock: 15,
    sku: 'LEAT-008',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['limited', 'artist', 'exclusive'],
    isActive: true,
  },
  {
    id: '9',
    name: 'Skipaman Street Black',
    description: 'Bold streetwear design with urban graphics. Perfect for making a statement in the city.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Street Black', value: '#000000' },
      { name: 'Concrete Gray', value: '#696969' },
    ],
    category: 'streetwear',
    featured: true,
    rating: 4.6,
    reviewCount: 78,
    stock: 45,
    sku: 'UST-009',
    weight: 210,
    dimensions: { length: 72, width: 52, height: 1 },
    tags: ['streetwear', 'urban', 'bold'],
    isActive: true,
  },
  {
    id: '10',
    name: 'Skipaman Navy Long Sleeve',
    description: 'Extended comfort with our premium long sleeve tee. Perfect for layering or wearing solo.',
    price: 50000,
    images: [
      '/images/3.png',
      '/images/4.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy Blue', value: '#000080' },
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Olive Green', value: '#808000' },
    ],
    category: 'basics',
    featured: true,
    rating: 4.7,
    reviewCount: 92,
    stock: 55,
    sku: 'CFLS-010',
    weight: 225,
    dimensions: { length: 74, width: 54, height: 1 },
    tags: ['longsleeve', 'comfort', 'layering'],
    isActive: true,
  },
  {
    id: '11',
    name: 'Skipaman Pixel Black',
    description: 'Nostalgic gaming graphics meet modern comfort. Show your love for classic games.',
    price: 50000,
    images: [
      '/images/grey1.png',
      '/images/grey2.png',
      '/images/grey3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pixel Black', value: '#000000' },
      { name: 'Arcade Blue', value: '#0000FF' },
    ],
    category: 'graphic',
    featured: true,
    rating: 4.8,
    reviewCount: 156,
    stock: 30,
    sku: 'RGT-011',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['gaming', 'retro', 'nostalgic'],
    isActive: true,
  },
  {
    id: '12',
    name: 'Skipaman Summer White Tank',
    description: 'Lightweight and breathable tank top perfect for warm weather. Stay cool and stylish.',
    price: 50000,
    images: [
      '/images/black1.png',
      '/images/black2.png',
      '/images/black3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Summer White', value: '#FFFFFF' },
      { name: 'Sky Blue', value: '#87CEEB' },
      { name: 'Coral Pink', value: '#FF7F50' },
    ],
    category: 'summer',
    featured: true,
    rating: 4.5,
    reviewCount: 67,
    stock: 80,
    sku: 'SBT-012',
    weight: 150,
    dimensions: { length: 65, width: 45, height: 1 },
    tags: ['tank', 'summer', 'breathable'],
    isActive: true,
  },
  {
    id: '13',
    name: 'Skipaman Athletic Black',
    description: 'Designed for active lifestyles with moisture-wicking technology and comfortable fit.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Athletic Black', value: '#000000' },
      { name: 'Gym Gray', value: '#808080' },
      { name: 'Energy Orange', value: '#FFA500' },
    ],
    category: 'athletic',
    featured: true,
    rating: 4.6,
    reviewCount: 89,
    stock: 70,
    sku: 'WET-013',
    weight: 180,
    dimensions: { length: 68, width: 48, height: 1 },
    tags: ['workout', 'athletic', 'performance'],
    isActive: true,
  },
  {
    id: '14',
    name: 'Skipaman Red Plaid Flannel',
    description: 'Warm and comfortable flannel shirt perfect for cold weather. Soft brushed interior.',
    price: 50000,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Red Plaid', value: '#8B0000' },
      { name: 'Blue Plaid', value: '#000080' },
      { name: 'Green Plaid', value: '#006400' },
    ],
    category: 'winter',
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    stock: 35,
    sku: 'CWF-014',
    weight: 280,
    dimensions: { length: 76, width: 56, height: 1 },
    tags: ['flannel', 'winter', 'cozy'],
    isActive: true,
  },
  {
    id: '15',
    name: 'Skipaman Business Navy Polo',
    description: 'Professional polo shirt perfect for business casual settings. Classic collar and button placket.',
    price: 50000,
    images: [
      '/images/6.jpg',
      '/images/7.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Business Navy', value: '#000080' },
      { name: 'Corporate White', value: '#FFFFFF' },
      { name: 'Executive Gray', value: '#696969' },
    ],
    category: 'business',
    featured: true,
    rating: 4.7,
    reviewCount: 98,
    stock: 50,
    sku: 'BCP-015',
    weight: 220,
    dimensions: { length: 72, width: 52, height: 1 },
    tags: ['polo', 'business', 'professional'],
    isActive: true,
  },
  {
    id: '16',
    name: 'Skipaman White Canvas',
    description: 'Unique abstract design that stands out. Perfect for creative individuals who love art.',
    price: 50000,
    images: [
      '/images/8.jpg',
      '/images/1.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Canvas White', value: '#FFFFFF' },
      { name: 'Artist Black', value: '#000000' },
    ],
    category: 'artistic',
    featured: true,
    rating: 4.9,
    reviewCount: 76,
    stock: 25,
    sku: 'AAT-016',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['artistic', 'abstract', 'creative'],
    isActive: true,
  },
  {
    id: '17',
    name: 'Skipaman Black Hood',
    description: 'Comfortable hoodie with kangaroo pocket and drawstring hood. Perfect for casual wear.',
    price: 50000,
    images: [
      '/images/blueHoody1.png',
      '/images/blueHoody2.png',
      '/images/blueHoody3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Hoodie Black', value: '#000000' },
      { name: 'Hoodie Gray', value: '#808080' },
      { name: 'Hoodie Navy', value: '#000080' },
    ],
    category: 'hoodies',
    featured: true,
    rating: 4.8,
    reviewCount: 145,
    stock: 40,
    sku: 'HE-017',
    weight: 350,
    dimensions: { length: 78, width: 58, height: 2 },
    tags: ['hoodie', 'casual', 'comfortable'],
    isActive: true,
  },
  {
    id: '18',
    name: 'Skipaman Festival Black',
    description: 'Vibrant festival-themed design perfect for music lovers and festival-goers.',
    price: 50000,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Festival Black', value: '#000000' },
      { name: 'Neon Pink', value: '#FF69B4' },
      { name: 'Electric Blue', value: '#00BFFF' },
    ],
    category: 'festival',
    featured: true,
    rating: 4.6,
    reviewCount: 83,
    stock: 60,
    sku: 'MFT-018',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['festival', 'music', 'vibrant'],
    isActive: true,
  },
  {
    id: '19',
    name: 'Skipaman Adventure Green',
    description: 'Inspire wanderlust with our travel-themed tee. Perfect for adventurers and explorers.',
    price: 50000,
    images: [
      '/images/6.jpg',
      '/images/7.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Adventure Green', value: '#228B22' },
      { name: 'Explorer Brown', value: '#8B4513' },
    ],
    category: 'travel',
    featured: true,
    rating: 4.7,
    reviewCount: 112,
    stock: 45,
    sku: 'TAT-019',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['travel', 'adventure', 'explore'],
    isActive: true,
  },
  {
    id: '20',
    name: 'Skipaman Black Quote',
    description: 'Clean typography design with inspiring quotes. Perfect for those who love simple, meaningful designs.',
    price: 50000,
    images: [
      '/images/8.jpg',
      '/images/1.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Quote Black', value: '#000000' },
      { name: 'Text White', value: '#FFFFFF' },
      { name: 'Minimal Gray', value: '#D3D3D3' },
    ],
    category: 'minimalist',
    featured: true,
    rating: 4.8,
    reviewCount: 94,
    stock: 55,
    sku: 'MTT-020',
    weight: 195,
    dimensions: { length: 69, width: 49, height: 1 },
    tags: ['typography', 'minimalist', 'quotes'],
    isActive: true,
  },
  {
    id: '21',
    name: 'Skipaman Team Red',
    description: 'Show your team spirit with our sports-themed collection. Support your favorite teams in style.',
    price: 50000,
    images: [
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Team Red', value: '#DC143C' },
      { name: 'Team Blue', value: '#0000FF' },
      { name: 'Team Green', value: '#008000' },
    ],
    category: 'sports',
    featured: true,
    rating: 4.5,
    reviewCount: 67,
    stock: 75,
    sku: 'STPT-021',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['sports', 'team', 'pride'],
    isActive: true,
  },
  {
    id: '22',
    name: 'Skipaman Forest Green',
    description: 'Celebrate nature with beautiful botanical designs. Perfect for outdoor enthusiasts.',
    price: 50000,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Forest Green', value: '#228B22' },
      { name: 'Earth Brown', value: '#8B4513' },
      { name: 'Sky Blue', value: '#87CEEB' },
    ],
    category: 'nature',
    featured: true,
    rating: 4.7,
    reviewCount: 89,
    stock: 50,
    sku: 'NLT-022',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['nature', 'botanical', 'outdoor'],
    isActive: true,
  },
  {
    id: '23',
    name: 'Skipaman Tech Black',
    description: 'Embrace the future with our tech-inspired designs. Perfect for tech enthusiasts and innovators.',
    price: 50000,
    images: [
      '/images/6.jpg',
      '/images/7.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Tech Black', value: '#000000' },
      { name: 'Digital Blue', value: '#0000FF' },
      { name: 'Circuit Green', value: '#00FF00' },
    ],
    category: 'tech',
    featured: true,
    rating: 4.8,
    reviewCount: 103,
    stock: 35,
    sku: 'TIT-023',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['tech', 'innovation', 'digital'],
    isActive: true,
  },
  {
    id: '24',
    name: 'Skipaman Classic Blues Jacket',
    description: 'Classic denim jacket with vintage wash. Timeless style that never goes out of fashion.',
    price: 50000,
    images: [
      '/images/8.jpg',
      '/images/1.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Classic Blue', value: '#0000FF' },
      { name: 'Vintage Black', value: '#000000' },
    ],
    category: 'jackets',
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    stock: 25,
    sku: 'VDJ-024',
    weight: 450,
    dimensions: { length: 80, width: 60, height: 2 },
    tags: ['denim', 'vintage', 'jacket'],
    isActive: true,
  },
  {
    id: '25',
    name: 'Skipaman Cream Sweater',
    description: 'Warm and comfortable sweater perfect for cold weather. Soft knit fabric with relaxed fit.',
    price: 50000,
    images: [
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Cream', value: '#F5F5DC' },
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Navy', value: '#000080' },
    ],
    category: 'sweaters',
    featured: true,
    rating: 4.7,
    reviewCount: 128,
    stock: 40,
    sku: 'CS-025',
    weight: 320,
    dimensions: { length: 75, width: 55, height: 2 },
    tags: ['sweater', 'cozy', 'warm'],
    isActive: true,
  },
  {
    id: '26',
    name: 'Skipaman Ocean Blues',
    description: 'Tropical vibes with beach-themed graphics. Perfect for vacation and summer fun.',
    price: 50000,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ocean Blue', value: '#4682B4' },
      { name: 'Sunset Orange', value: '#FF4500' },
      { name: 'Palm Green', value: '#228B22' },
    ],
    category: 'summer',
    featured: true,
    rating: 4.6,
    reviewCount: 71,
    stock: 65,
    sku: 'BVT-026',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['beach', 'vacation', 'tropical'],
    isActive: true,
  },
  {
    id: '27',
    name: 'Skipaman Gym Black',
    description: 'Stay motivated with inspiring fitness quotes and designs. Perfect for gym sessions.',
    price: 50000,
    images: [
      '/images/6.jpg',
      '/images/7.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gym Black', value: '#000000' },
      { name: 'Energy Red', value: '#DC143C' },
      { name: 'Power Blue', value: '#0000FF' },
    ],
    category: 'fitness',
    featured: true,
    rating: 4.7,
    reviewCount: 95,
    stock: 55,
    sku: 'FMT-027',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['fitness', 'motivation', 'gym'],
    isActive: true,
  },
  {
    id: '28',
    name: 'Skipaman Coffee',
    description: 'Celebrate your love for coffee with our caffeine-inspired designs. Perfect for coffee enthusiasts.',
    price: 50000,
    images: [
      '/images/8.jpg',
      '/images/1.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Coffee Brown', value: '#8B4513' },
      { name: 'Cream', value: '#F5F5DC' },
      { name: 'Espresso Black', value: '#000000' },
    ],
    category: 'lifestyle',
    featured: true,
    rating: 4.8,
    reviewCount: 87,
    stock: 60,
    sku: 'CLT-028',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['coffee', 'lifestyle', 'caffeine'],
    isActive: true,
  },
  {
    id: '29',
    name: 'Skipaman Space Black',
    description: 'Journey to the stars with our space-themed collection. Perfect for astronomy enthusiasts.',
    price: 50000,
    images: [
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Space Black', value: '#000000' },
      { name: 'Galaxy Purple', value: '#800080' },
      { name: 'Star Silver', value: '#C0C0C0' },
    ],
    category: 'space',
    featured: true,
    rating: 4.9,
    reviewCount: 134,
    stock: 30,
    sku: 'SET-029',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['space', 'astronomy', 'galaxy'],
    isActive: true,
  },
  {
    id: '30',
    name: 'Skipaman Pet Pink',
    description: 'Show your love for pets with adorable animal designs. Perfect for pet owners and animal lovers.',
    price: 50000,
    images: [
      '/images/4.jpg',
      '/images/5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pet Pink', value: '#FFC0CB' },
      { name: 'Animal Brown', value: '#8B4513' },
      { name: 'Fur Gray', value: '#808080' },
    ],
    category: 'pets',
    featured: true,
    rating: 4.7,
    reviewCount: 102,
    stock: 70,
    sku: 'PLT-030',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['pets', 'animals', 'cute'],
    isActive: true,
  },
  {
    id: '31',
    name: 'Skipaman Premium Black Hood',
    description: 'Ultimate comfort meets street style. Our premium hoody features front, back, and lifestyle views showcasing the perfect fit and quality craftsmanship.',
    price: 75000,
    images: [
      '/images/blueHoody1.png',
      '/images/blueHoody2.png',
      '/images/blueHoody3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Classic Black', value: '#000000' },
      { name: 'Charcoal', value: '#36454F' },
    ],
    category: 'hoodies',
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    stock: 35,
    sku: 'PBH-031',
    weight: 400,
    dimensions: { length: 80, width: 60, height: 3 },
    tags: ['hoody', 'premium', 'streetwear', 'comfort'],
    isActive: true,
  },
  {
    id: '32',
    name: 'Skipaman Charcoal',
    description: 'The perfect tee with front, back, and lifestyle views. Premium cotton blend with modern fit and timeless style that works for any occasion.',
    price: 45000,
    images: [
      '/src/assets/blacktFront.png',
      '/src/assets/blacktback.png',
      '/src/assets/blackTOne.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal Gray', value: '#36454F' },
      { name: 'Heather Gray', value: '#D3D3D3' },
    ],
    category: 'basics',
    featured: true,
    rating: 4.8,
    reviewCount: 142,
    stock: 50,
    sku: 'CBT-032',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['basic', 'black', 'classic', 'cotton'],
    isActive: true,
  },
  {
    id: '33',
    name: 'Skipaman Royal Purple',
    description: 'Bold and vibrant purple tee that makes a statement. Features front, back, and lifestyle views showcasing the rich purple color and modern design.',
    price: 55000,
    images: [
      '/src/assets/blackPurpleTwo.png',
      '/src/assets/black1.png',
      '/src/assets/blackPurpleTwo.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Purple', value: '#6B46C1' },
      { name: 'Deep Purple', value: '#4C1D95' },
      { name: 'Vibrant Purple', value: '#8B5CF6' },
    ],
    category: 'statement',
    featured: true,
    rating: 4.9,
    reviewCount: 98,
    stock: 40,
    sku: 'PST-033',
    weight: 210,
    dimensions: { length: 72, width: 52, height: 1 },
    tags: ['purple', 'statement', 'vibrant', 'bold'],
    isActive: true,
  }
];

// Helper functions
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

interface SearchResult {
  product: Product;
  score: number;
}

export const searchProducts = (query: string): Product[] => {
  if (!query || !query.trim()) {
    return products.filter(p => p.isActive);
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
  if (searchTerms.length === 0) {
    return products.filter(p => p.isActive);
  }

  const results: SearchResult[] = [];

  products.forEach(product => {
    if (!product.isActive) return;

    let score = 0;
    const productName = product.name.toLowerCase();
    const productDescription = product.description.toLowerCase();
    const productCategory = product.category.toLowerCase();
    const productTags = product.tags.map(tag => tag.toLowerCase());
    const productColors = product.colors.map(c => c.name.toLowerCase());

    searchTerms.forEach(term => {
      // Exact name match (highest priority)
      if (productName === term) {
        score += 100;
      } else if (productName.startsWith(term)) {
        score += 50;
      } else if (productName.includes(term)) {
        score += 30;
      }

      // Category match
      if (productCategory.includes(term)) {
        score += 20;
      }

      // Tag match
      productTags.forEach(tag => {
        if (tag === term) {
          score += 25;
        } else if (tag.includes(term)) {
          score += 15;
        }
      });

      // Color match
      productColors.forEach(color => {
        if (color.includes(term)) {
          score += 20;
        }
      });

      // Description match (lower priority)
      if (productDescription.includes(term)) {
        score += 10;
      }

      // SKU match
      if (product.sku.toLowerCase().includes(term)) {
        score += 15;
      }
    });

    // Boost featured products
    if (product.featured) {
      score += 5;
    }

    // Only include products with some match
    if (score > 0) {
      results.push({ product, score });
    }
  });

  // Sort by score (highest first) and return products
  return results
    .sort((a, b) => b.score - a.score)
    .map(result => result.product);
};

export const getAvailableSizes = (): string[] => {
  const sizes = new Set<string>();
  products.forEach(product => {
    product.sizes.forEach(size => sizes.add(size));
  });
  return Array.from(sizes).sort();
};

export const getAvailableColors = (): { name: string; value: string }[] => {
  const colors = new Map<string, string>();
  products.forEach(product => {
    product.colors.forEach(color => {
      colors.set(color.name, color.value);
    });
  });
  return Array.from(colors.entries()).map(([name, value]) => ({ name, value }));
};

export const getProductsByPriceRange = (minPrice: number, maxPrice: number): Product[] => {
  return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
};

export const sortProducts = (products: Product[], sortBy: 'price' | 'rating' | 'name', order: 'asc' | 'desc' = 'asc'): Product[] => {
  const sorted = [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};

export default products;
