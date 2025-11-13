// Custom React hooks for Strapi CMS integration
import { useState, useEffect, useCallback } from 'react';
import strapiService, { Product, Category, DesignRequest } from '../services/strapi';

// Hook for fetching products
export const useProducts = (params?: {
  populate?: string;
  filters?: Record<string, any>;
  sort?: string;
  pagination?: { page: number; pageSize: number };
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.getProducts(params);
      
      // Transform Strapi products to match your current format
      const transformedProducts = response.data.map(strapiService.transformProduct);
      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

// Hook for fetching a single product
export const useProduct = (id: number) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.getProduct(id);
      const transformedProduct = strapiService.transformProduct(response.data);
      setProduct(transformedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

// Hook for managing design requests
export const useDesignRequests = () => {
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesignRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.getDesignRequests();
      setDesignRequests(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch design requests');
      console.error('Error fetching design requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDesignRequest = useCallback(async (requestData: Partial<DesignRequest['attributes']>) => {
    try {
      setError(null);
      const response = await strapiService.createDesignRequest(requestData);
      // Refresh the list after creating
      await fetchDesignRequests();
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create design request';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchDesignRequests]);

  const updateDesignRequestStatus = useCallback(async (id: number, status: DesignRequest['attributes']['status']) => {
    try {
      setError(null);
      const response = await strapiService.updateDesignRequestStatus(id, status);
      // Update the local state
      setDesignRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, attributes: { ...request.attributes, status } }
            : request
        )
      );
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update design request';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchDesignRequests();
  }, [fetchDesignRequests]);

  return {
    designRequests,
    loading,
    error,
    createDesignRequest,
    updateDesignRequestStatus,
    refetch: fetchDesignRequests,
  };
};

// Hook for file uploads
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      const result = await strapiService.uploadFile(file);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadFile, uploading, error };
};

// Hook for product management (admin features)
export const useProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (productData: Partial<Product['attributes']>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.createProduct(productData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: Partial<Product['attributes']>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await strapiService.updateProduct(id, productData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await strapiService.deleteProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
};

