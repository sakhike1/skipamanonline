// Strapi CMS Integration Service
// This service handles all communication with the Strapi CMS backend

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface Product {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    images: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          alternativeText: string;
          width: number;
          height: number;
        };
      }>;
    };
    sizes: string[];
    colors: Array<{ name: string; value: string }>;
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    featured: boolean;
    rating: number;
    reviewCount: number;
    stock: number;
    sku: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    tags: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string;
    image: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      } | null;
    };
    isActive: boolean;
  };
}

interface DesignRequest {
  id: number;
  attributes: {
    title: string;
    description: string;
    category: string;
    budget: string;
    timeline: string;
    size: string;
    materials: string[];
    colors: string[];
    referenceImages: {
      data: Array<{
        attributes: {
          url: string;
          alternativeText: string;
        };
      }>;
    };
    additionalNotes: string;
    customerEmail: string;
    customerName: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  };
}

class StrapiService {
  private baseURL: string;
  private apiToken?: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
    this.apiToken = process.env.REACT_APP_STRAPI_TOKEN;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Products API
  async getProducts(params?: {
    populate?: string;
    filters?: Record<string, any>;
    sort?: string;
    pagination?: { page: number; pageSize: number };
  }): Promise<StrapiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.populate) {
      queryParams.append('populate', params.populate);
    }
    
    if (params?.filters) {
      queryParams.append('filters', JSON.stringify(params.filters));
    }
    
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }
    
    if (params?.pagination) {
      queryParams.append('pagination[page]', params.pagination.page.toString());
      queryParams.append('pagination[pageSize]', params.pagination.pageSize.toString());
    }

    return this.request<Product[]>(`/products?${queryParams.toString()}`);
  }

  async getProduct(id: number): Promise<StrapiResponse<Product>> {
    return this.request<Product>(`/products/${id}?populate=*`);
  }

  async createProduct(productData: Partial<Product['attributes']>): Promise<StrapiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({ data: productData }),
    });
  }

  async updateProduct(id: number, productData: Partial<Product['attributes']>): Promise<StrapiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: productData }),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(): Promise<StrapiResponse<Category[]>> {
    return this.request<Category[]>('/categories?populate=*');
  }

  async getCategory(id: number): Promise<StrapiResponse<Category>> {
    return this.request<Category>(`/categories/${id}?populate=*`);
  }

  // Design Requests API
  async createDesignRequest(requestData: Partial<DesignRequest['attributes']>): Promise<StrapiResponse<DesignRequest>> {
    return this.request<DesignRequest>('/design-requests', {
      method: 'POST',
      body: JSON.stringify({ data: requestData }),
    });
  }

  async getDesignRequests(): Promise<StrapiResponse<DesignRequest[]>> {
    return this.request<DesignRequest[]>('/design-requests?populate=*');
  }

  async updateDesignRequestStatus(id: number, status: DesignRequest['attributes']['status']): Promise<StrapiResponse<DesignRequest>> {
    return this.request<DesignRequest>(`/design-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { status } }),
    });
  }

  // Utility methods
  async uploadFile(file: File): Promise<{ id: number; url: string }> {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: 'POST',
      headers: this.apiToken ? { 'Authorization': `Bearer ${this.apiToken}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result[0].id,
      url: result[0].url,
    };
  }

  // Transform Strapi data to match your current Product interface
  transformProduct(strapiProduct: Product): any {
    return {
      id: strapiProduct.id.toString(),
      name: strapiProduct.attributes.name,
      description: strapiProduct.attributes.description,
      price: strapiProduct.attributes.price,
      images: strapiProduct.attributes.images.data.map(img => img.attributes.url),
      sizes: strapiProduct.attributes.sizes,
      colors: strapiProduct.attributes.colors,
      category: strapiProduct.attributes.category.data?.attributes.name || 'uncategorized',
      featured: strapiProduct.attributes.featured,
      rating: strapiProduct.attributes.rating,
      reviewCount: strapiProduct.attributes.reviewCount,
      stock: strapiProduct.attributes.stock,
      sku: strapiProduct.attributes.sku,
      weight: strapiProduct.attributes.weight,
      dimensions: strapiProduct.attributes.dimensions,
      tags: strapiProduct.attributes.tags,
      isActive: strapiProduct.attributes.isActive,
    };
  }
}

// Create and export a singleton instance
export const strapiService = new StrapiService();
export default strapiService;

// Export types for use in components
export type { Product, Category, DesignRequest, StrapiResponse };

