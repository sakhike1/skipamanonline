import type { SupabaseClient } from '@supabase/supabase-js';
import type { Review, ReviewStats } from '../types';

export type ProductReviewRow = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  size: string | null;
  color: string | null;
  fit: string | null;
  quality: string | null;
  would_recommend: boolean;
  image_urls: string[] | null;
  helpful_count: number;
  status: 'published' | 'hidden' | 'pending';
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function mapProductReviewRow(row: ProductReviewRow): Review {
  const fullName = row.profiles?.full_name?.trim() || 'Customer';

  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    userName: fullName,
    userInitials: initialsFromName(fullName),
    rating: row.rating,
    title: row.title,
    comment: row.comment,
    date: row.created_at.slice(0, 10),
    verified: true,
    helpful: row.helpful_count ?? 0,
    images: row.image_urls?.length ? row.image_urls : undefined,
    size: row.size ?? undefined,
    color: row.color ?? undefined,
    fit: row.fit as Review['fit'],
    quality: row.quality as Review['quality'],
    wouldRecommend: row.would_recommend,
  };
}

export function computeReviewStats(reviewList: Review[]): ReviewStats {
  const totalReviews = reviewList.length;
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
  const totalRating = reviewList.reduce((sum, r) => sum + r.rating, 0);
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviewList) {
    const key = r.rating as 1 | 2 | 3 | 4 | 5;
    if (key >= 1 && key <= 5) ratingDistribution[key]++;
  }
  return {
    averageRating: Math.round((totalRating / totalReviews) * 10) / 10,
    totalReviews,
    ratingDistribution,
  };
}

const REVIEW_COLUMNS = `
  id,
  product_id,
  user_id,
  rating,
  title,
  comment,
  size,
  color,
  fit,
  quality,
  would_recommend,
  image_urls,
  helpful_count,
  status,
  created_at,
  updated_at
`;

type ReviewRowBase = Omit<ProductReviewRow, 'profiles'>;

async function attachProfileNames(
  supabase: SupabaseClient,
  rows: ReviewRowBase[],
): Promise<ProductReviewRow[]> {
  if (rows.length === 0) return [];

  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);

  if (error) {
    return rows.map((r) => ({ ...r, profiles: { full_name: null } }));
  }

  const nameById = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string | null]));
  return rows.map((r) => ({
    ...r,
    profiles: { full_name: nameById.get(r.user_id) ?? null },
  }));
}

export async function fetchPublishedReviewsForProduct(
  supabase: SupabaseClient,
  productId: string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(REVIEW_COLUMNS)
    .eq('product_id', productId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  const enriched = await attachProfileNames(supabase, (data ?? []) as ReviewRowBase[]);
  return enriched.map((row) => mapProductReviewRow(row));
}

export async function userHasReviewedProduct(
  supabase: SupabaseClient,
  userId: string,
  productId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function submitProductReview(
  supabase: SupabaseClient,
  payload: {
    productId: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    size?: string;
    color?: string;
    fit?: string;
    quality?: string;
    wouldRecommend?: boolean;
    imageUrls?: string[];
  },
): Promise<Review> {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: payload.productId,
      user_id: payload.userId,
      rating: payload.rating,
      title: payload.title.trim(),
      comment: payload.comment.trim(),
      size: payload.size || null,
      color: payload.color || null,
      fit: payload.fit || null,
      quality: payload.quality || null,
      would_recommend: payload.wouldRecommend ?? true,
      image_urls: payload.imageUrls ?? [],
      status: 'published',
    })
    .select(REVIEW_COLUMNS)
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already reviewed this product.');
    }
    throw error;
  }

  const [enriched] = await attachProfileNames(supabase, [data as ReviewRowBase]);
  return mapProductReviewRow(enriched);
}

export async function fetchAllReviewsForAdmin(
  supabase: SupabaseClient,
  limit = 300,
): Promise<ProductReviewRow[]> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(REVIEW_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return attachProfileNames(supabase, (data ?? []) as ReviewRowBase[]);
}

export async function updateReviewStatusAdmin(
  supabase: SupabaseClient,
  reviewId: string,
  status: ProductReviewRow['status'],
): Promise<void> {
  const { error } = await supabase
    .from('product_reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reviewId);
  if (error) throw error;
}

export async function deleteReviewAdmin(supabase: SupabaseClient, reviewId: string): Promise<void> {
  const { error } = await supabase.from('product_reviews').delete().eq('id', reviewId);
  if (error) throw error;
}
