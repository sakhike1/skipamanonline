import { contentfulClient, previewClient } from './contentful';
import { Entry, Asset } from 'contentful';

// Contentful Content Type Interfaces
export interface ContentfulProduct {
  name: string;
  description: string;
  price: number;
  images: Asset[];
  category: string;
  sizes: string[];
  colors: string[];
  isNew: boolean;
  isFeatured: boolean;
  stock: number;
  tags: string[];
}

export interface ContentfulOrder {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  orderDate: string;
  trackingNumber?: string;
}

export interface ContentfulBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: any; // RichText
  featuredImage: Asset;
  author: string;
  publishDate: string;
  tags: string[];
  isPublished: boolean;
}

export interface ContentfulCollection {
  name: string;
  description: string;
  heroImage: Asset;
  products: Entry<ContentfulProduct>[];
  isActive: boolean;
  sortOrder: number;
}

// Utility function to get image URL
export const getImageUrl = (asset: Asset | undefined): string => {
  if (!asset?.fields?.file?.url) {
    return '/images/placeholder.jpg';
  }
  return `https:${asset.fields.file.url}`;
};

// Utility function to get optimized image URL
export const getOptimizedImageUrl = (
  asset: Asset | undefined, 
  width?: number, 
  height?: number, 
  quality: number = 80
): string => {
  if (!asset?.fields?.file?.url) {
    return '/images/placeholder.jpg';
  }
  
  const baseUrl = `https:${asset.fields.file.url}`;
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', 'webp');
  
  return `${baseUrl}?${params.toString()}`;
};

// Product API functions
export const getProducts = async (): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProductById = async (id: string): Promise<Entry<ContentfulProduct>> => {
  try {
    const response = await contentfulClient.getEntry<ContentfulProduct>(id);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

export const getFeaturedProducts = async (): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      'fields.isFeatured': true,
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};

export const getNewProducts = async (): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      'fields.isNew': true,
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw new Error('Failed to fetch new products');
  }
};

export const getProductsByCategory = async (category: string): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      'fields.category': category,
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
};

export const searchProducts = async (query: string): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      query: query,
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

// Order API functions
export const getOrders = async (): Promise<Entry<ContentfulOrder>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulOrder>({
      content_type: 'order',
      order: '-fields.orderDate',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const getOrdersByEmail = async (email: string): Promise<Entry<ContentfulOrder>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulOrder>({
      content_type: 'order',
      'fields.customerEmail': email,
      order: '-fields.orderDate',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    throw new Error('Failed to fetch orders by email');
  }
};

export const getOrderById = async (id: string): Promise<Entry<ContentfulOrder>> => {
  try {
    const response = await contentfulClient.getEntry<ContentfulOrder>(id);
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

// Collection API functions
export const getCollections = async (): Promise<Entry<ContentfulCollection>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulCollection>({
      content_type: 'collection',
      'fields.isActive': true,
      order: 'fields.sortOrder',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw new Error('Failed to fetch collections');
  }
};

export const getCollectionById = async (id: string): Promise<Entry<ContentfulCollection>> => {
  try {
    const response = await contentfulClient.getEntry<ContentfulCollection>(id);
    return response;
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw new Error('Failed to fetch collection');
  }
};

// Blog API functions
export const getBlogPosts = async (): Promise<Entry<ContentfulBlogPost>[]> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      'fields.isPublished': true,
      order: '-fields.publishDate',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<Entry<ContentfulBlogPost>> => {
  try {
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      'fields.slug': slug,
      'fields.isPublished': true,
      limit: 1,
    });
    
    if (response.items.length === 0) {
      throw new Error('Blog post not found');
    }
    
    return response.items[0];
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
};

export const getBlogPostById = async (id: string): Promise<Entry<ContentfulBlogPost>> => {
  try {
    const response = await contentfulClient.getEntry<ContentfulBlogPost>(id);
    return response;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
};

// Preview API functions (for draft content)
export const getPreviewProducts = async (): Promise<Entry<ContentfulProduct>[]> => {
  try {
    const response = await previewClient.getEntries<ContentfulProduct>({
      content_type: 'product',
      order: '-sys.createdAt',
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching preview products:', error);
    throw new Error('Failed to fetch preview products');
  }
};

export const getPreviewProductById = async (id: string): Promise<Entry<ContentfulProduct>> => {
  try {
    const response = await previewClient.getEntry<ContentfulProduct>(id);
    return response;
  } catch (error) {
    console.error('Error fetching preview product:', error);
    throw new Error('Failed to fetch preview product');
  }
};

// Utility functions
export const getAssetUrl = (assetId: string): string => {
  return `https://images.ctfassets.net/${process.env.REACT_APP_CONTENTFUL_SPACE_ID}/${assetId}`;
};

export const formatContentfulDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getContentfulRichText = (richText: any): string => {
  // Simple function to extract plain text from Contentful RichText
  if (!richText?.content) return '';
  
  const extractText = (node: any): string => {
    if (node.nodeType === 'text') {
      return node.value || '';
    }
    
    if (node.content) {
      return node.content.map(extractText).join('');
    }
    
    return '';
  };
  
  return richText.content.map(extractText).join(' ');
};

