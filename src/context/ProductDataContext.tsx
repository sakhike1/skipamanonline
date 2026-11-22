import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import type { Color, Product, Size } from '../types';
import { products as fallbackProducts } from '../data/products';
import { supabase } from '../lib/supabase';

interface ProductDataContextValue {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getProductById: (id: string) => Product | undefined;
  isUsingBackendData: boolean;
}

const ProductDataContext = createContext<ProductDataContextValue | undefined>(undefined);

function mapSupabaseProduct(row: Record<string, unknown>): Product {
  const cat = row.categories as { name?: string; slug?: string } | null | undefined;
  const categoryName = typeof cat?.name === 'string' && cat.name ? cat.name : 'general';
  const rawSizes = row.sizes as string[] | null | undefined;
  const sizes = (Array.isArray(rawSizes) && rawSizes.length > 0
    ? rawSizes
    : ['S', 'M', 'L', 'XL']) as Size[];

  const colourStrings = row.colours as string[] | null | undefined;
  const colors: Color[] =
    Array.isArray(colourStrings) && colourStrings.length > 0
      ? colourStrings.map((c) => ({ name: c, value: '#111111' }))
      : [{ name: 'Default', value: '#000000' }];

  const imageUrls = row.image_urls as string[] | null | undefined;
  const images = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : ['/images/grey1.png'];

  const priceRand = Number(row.price ?? 0);

  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    price: Math.round(priceRand * 100),
    images,
    sizes,
    colors,
    category: categoryName,
    featured: Boolean(row.is_featured),
    rating: 4.5,
    reviewCount: 0,
    stock: Number(row.stock_quantity ?? 0),
    sku: String(row.id ?? '').slice(0, 8),
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: [],
    isActive: row.is_active !== false,
  };
}

export const ProductDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!supabase) {
      setRemoteProducts(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: qErr } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (qErr) throw qErr;

      const rows = (data ?? []) as Record<string, unknown>[];
      setRemoteProducts(rows.map(mapSupabaseProduct));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load products';
      setError(message);
      setRemoteProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const value = useMemo<ProductDataContextValue>(() => {
    const hasRemote = !!(remoteProducts && remoteProducts.length > 0);
    const mergedProducts = hasRemote ? remoteProducts! : fallbackProducts;
    const featuredProducts = mergedProducts.filter((p) => p.featured);

    return {
      products: mergedProducts,
      featuredProducts: featuredProducts.length > 0 ? featuredProducts : mergedProducts.slice(0, 6),
      loading,
      error,
      refetch: fetchProducts,
      isUsingBackendData: hasRemote,
      getProductById: (id: string) => mergedProducts.find((product) => product.id === id),
    };
  }, [remoteProducts, loading, error, fetchProducts]);

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductData = (): ProductDataContextValue => {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error('useProductData must be used within a ProductDataProvider');
  }
  return context;
};
