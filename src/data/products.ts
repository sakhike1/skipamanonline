import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black Tee',
    description: 'Our signature classic tee in sleek black. Made from 100% organic cotton for ultimate comfort and durability. Features a relaxed fit and soft-touch finish.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Gray', value: '#808080' },
    ],
    category: 'basics',
    featured: true,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    name: 'AI Future Graphic Tee',
    description: 'Express your love for technology with our AI Future graphic tee. Features a unique AI-inspired design on premium cotton fabric.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
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
  },
  {
    id: '3',
    name: 'Minimalist Logo Tee',
    description: 'Clean, simple, elegant. Our minimalist logo tee speaks volumes with its understated design and premium quality construction.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', value: '#FFFFFF' },
      { name: 'Sky Blue', value: '#87CEEB' },
      { name: 'Mint Green', value: '#98FB98' },
    ],
    category: 'essentials',
    featured: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: '4',
    name: 'Gradient Wave Pattern',
    description: 'Make a statement with our eye-catching gradient wave pattern tee. Features a modern design with vibrant color transitions.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Ocean Blue', value: '#4B9CD3' },
      { name: 'Sunset Orange', value: '#FD5E53' },
    ],
    category: 'graphic',
    featured: true,
    rating: 4.6,
    reviewCount: 73,
  },
  {
    id: '5',
    name: 'Vintage Wash',
    description: 'Our vintage wash crew neck offers that perfectly broken-in feel from day one. Garment dyed and washed for a unique, lived-in appearance.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Faded Olive', value: '#6B8E23' },
      { name: 'Washed Black', value: '#333333' },
      { name: 'Vintage Red', value: '#B22222' },
    ],
    category: 'vintage',
    featured: true,
    rating: 4.5,
    reviewCount: 94,
  },
  {
    id: '6',
    name: 'Tech Mesh ',
    description: 'Engineered for movement and comfort, our Tech Mesh tee features breathable fabric and moisture-wicking technology for your active lifestyle.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Electric Blue', value: '#0892D0' },
      { name: 'Neon Green', value: '#39FF14' },
    ],
    category: 'performance',
    featured: true,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    id: '7',
    name: 'Urban Street  Tee',
    description: 'Contemporary streetwear with an oversized silhouette. Features dropped shoulders and an extended hem for a modern urban look.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Sand', value: '#C2B280' },
    ],
    category: 'streetwear',
    featured: true,
    rating: 4.3,
    reviewCount: 82,
  },
  {
    id: '8',
    name: 'Avant-Garde Cut Tee',
    description: 'Push boundaries with our avant-garde cut tee. Features asymmetrical hemlines and innovative fabric combinations.',
    price: 50000,
    images: [
      '/images/1.png',
      '/images/2.png',
      '/images/3.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate', value: '#708090' },
      { name: 'Ivory', value: '#FFFFF0' },
    ],
    category: 'designer',
    featured: true,
    rating: 4.2,
    reviewCount: 45,
  },
];

export const getProductById = (id: string): Product | undefined => {
  // First check in the original products
  const originalProduct = products.find(product => product.id === id);
  if (originalProduct) return originalProduct;
  
  // If not found, check in the generated products
  const allProducts = getFeaturedProducts();
  return allProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  // Get the original 8 products
  const originalProducts = products.filter(product => product.featured);
  
  // Generate additional products to reach 200 total
  const additionalProducts: Product[] = [];
  
  for (let i = 9; i <= 200; i++) {
    const categories = ['basics', 'graphic', 'essentials', 'vintage', 'performance', 'streetwear', 'designer'];
    const category = categories[i % categories.length];
    
    const productNames = [
      'Classic Crew Neck',
      'Modern Fit Tee',
      'Premium Cotton',
      'Street Style',
      'Urban Collection',
      'Designer Series',
      'Limited Edition',
      'Signature Line',
      'Exclusive Drop',
      'Seasonal Collection'
    ];
    
    const name = `${productNames[i % productNames.length]} #${i}`;
    
    additionalProducts.push({
      id: i.toString(),
      name,
      description: `High-quality t-shirt with premium materials and modern design. Part of our ${category} collection.`,
      price: 45000 + (i * 100), // Varying prices
      images: [
        '/images/1.png',
        '/images/2.png',
        '/images/3.png',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Gray', value: '#808080' },
      ],
      category,
      featured: true,
      rating: 4.0 + (i % 10) * 0.1, // Varying ratings
      reviewCount: 50 + (i % 100),
    });
  }
  
  return [...originalProducts, ...additionalProducts];
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};