import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black Tee',
    description: 'Our signature classic tee in sleek black. Made from 100% organic cotton for ultimate comfort and durability. Features a relaxed fit and soft-touch finish.',
    price: 29.99,
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
    stock: 50,
    sku: 'CBT-001',
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: ['basic', 'cotton', 'comfortable'],
    isActive: true,
  },
  {
    id: '2',
    name: 'AI Future Graphic Tee',
    description: 'Express your love for technology with our AI Future graphic tee. Features a unique AI-inspired design on premium cotton fabric.',
    price: 34.99,
    images: [
      '/images/2.png',
      '/images/2-1.png',
      '/images/2-2.png',
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
    name: 'Minimalist Logo Tee',
    description: 'Clean, simple, elegant. Our minimalist logo tee speaks volumes with its understated design and premium quality construction.',
    price: 32.99,
    images: [
      '/images/3.png',
      '/images/3-1.png',
      '/images/3-2.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', value: '#FFFFFF' },
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
    name: 'Vintage Band Tee',
    description: 'Rock your style with our vintage band tee collection. Featuring distressed prints and that perfect broken-in feel.',
    price: 39.99,
    images: [
      '/images/4.png',
      '/images/4-1.png',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', value: '#36454F' },
      { name: 'Faded Black', value: '#2F2F2F' },
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
    name: 'Eco-Friendly Organic Tee',
    description: 'Sustainable fashion meets style. Made from 100% organic cotton with eco-friendly dyes. Perfect for the environmentally conscious.',
    price: 36.99,
    images: [
      '/images/5.png',
      '/images/5-1.png',
      '/images/5-2.png',
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
    name: 'Premium Pocket Tee',
    description: 'Elevated basics with a modern twist. Features a subtle chest pocket and superior fabric blend for lasting comfort and style.',
    price: 33.99,
    images: [
      '/images/6.png',
      '/images/6-1.png',
      '/images/6-2.png',
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
    name: 'Sport Performance Tee',
    description: 'Engineered for active lifestyles. Moisture-wicking technology and athletic fit make this perfect for workouts and casual wear.',
    price: 28.99,
    images: [
      '/images/7.png',
      '/images/7-1.png',
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
    name: 'Limited Edition Artist Tee',
    description: 'Collaboration with local artists brings you unique, limited-edition designs. Only 100 pieces available - collect them all!',
    price: 44.99,
    images: [
      '/images/8.png',
      '/images/8-1.png',
      '/images/8-2.png',
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

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
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







