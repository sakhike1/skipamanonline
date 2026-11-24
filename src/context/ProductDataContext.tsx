import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import type { Color, Product, Size } from '../types';
import { products as fallbackProducts } from '../data/products';
import { skip } from '../lib/skipApi';

interface ProductDataContextValue {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getProductById: (id: string) => Product | undefined;
  isUsingBackendData: boolean;
  searchProducts: (query: string) => Product[];
}

const ProductDataContext = createContext<ProductDataContextValue | undefined>(undefined);

const COLOR_HEX: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', gray: '#808080', grey: '#808080', navy: '#000080', blue: '#1E40AF',
  red: '#B91C1C', maroon: '#800000', green: '#15803D', yellow: '#FACC15', orange: '#EA580C', pink: '#EC4899',
  purple: '#7E22CE', brown: '#78350F', beige: '#D6C7A1', cream: '#F5F0E1',
};

type BackendProduct = {
  id: string; slug: string; name: string; description: string; category: string; priceCents: number;
  imageUrls: string[]; active: boolean; featured?: boolean;
  variants: Array<{ id: string; size: string; color: string; stock: number }>;
  priceBreaks?: Array<{ minQty: number; percentOff: number }>;
};

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const bySize = (a: string, b: string) => {
  const ia = SIZE_ORDER.indexOf(a), ib = SIZE_ORDER.indexOf(b);
  if (ia >= 0 && ib >= 0) return ia - ib;
  if (ia >= 0) return -1;
  if (ib >= 0) return 1;
  return a.localeCompare(b, undefined, { numeric: true });
};

function mapBackendProduct(row: BackendProduct): Product {
  const sizes = [...new Set(row.variants.map((v) => v.size))].sort(bySize) as Size[];
  const colorNames = [...new Set(row.variants.map((v) => v.color))];
  const colors: Color[] = colorNames.length
    ? colorNames.map((name) => ({ name, value: COLOR_HEX[name.toLowerCase()] ?? '#111111' }))
    : [{ name: 'Default', value: '#000000' }];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.priceCents,
    images: row.imageUrls.length ? row.imageUrls : ['/images/grey1.png'],
    sizes: sizes.length ? sizes : (['S', 'M', 'L', 'XL'] as Size[]),
    colors,
    category: row.category || 'general',
    featured: Boolean(row.featured),
    rating: 0,
    reviewCount: 0,
    stock: row.variants.reduce((n, v) => n + v.stock, 0),
    sku: row.slug,
    weight: 200,
    dimensions: { length: 70, width: 50, height: 1 },
    tags: [],
    isActive: row.active,
    variants: row.variants,
    priceBreaks: row.priceBreaks ?? [],
  };
}

function scoreSearch(list: Product[], query: string): Product[] {
  const active = list.filter((p) => p.isActive);
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return active;
  const scored: Array<{ p: Product; score: number }> = [];
  for (const p of active) {
    const name = p.name.toLowerCase();
    const desc = p.description.toLowerCase();
    const cat = p.category.toLowerCase();
    const tags = (p.tags ?? []).map((t) => t.toLowerCase());
    const colors = p.colors.map((c) => c.name.toLowerCase());
    let score = 0;
    for (const t of terms) {
      if (name === t) score += 100;
      else if (name.startsWith(t)) score += 50;
      else if (name.includes(t)) score += 30;
      if (cat.includes(t)) score += 20;
      for (const tag of tags) score += tag === t ? 25 : tag.includes(t) ? 15 : 0;
      if (colors.some((c) => c.includes(t))) score += 10;
      if (desc.includes(t)) score += 5;
    }
    if (score > 0) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.p);
}

export const ProductDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await skip.get<BackendProduct[]>('/products', undefined, false);
      setRemoteProducts(rows.map(mapBackendProduct));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
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
      searchProducts: (query: string) => scoreSearch(mergedProducts, query),
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
