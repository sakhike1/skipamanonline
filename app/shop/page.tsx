import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { products } from '@/src/data/products'
import LoadingSpinner from '@/src/components/ui/LoadingSpinner'

// Stream the shop page for faster perceived performance
const ShopPage = dynamic(() => import('@/src/pages/ShopPage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingSpinner
        variant="gradient"
        size="xl"
        color="purple"
        text="Loading shop..."
      />
    </div>
  ),
  ssr: true,
})

// Generate metadata with dynamic product count
export async function generateMetadata() {
  const totalProducts = products.length
  const categories = [...new Set(products.map(p => p.category))].length

  return {
    title: 'Shop - Premium T-Shirts & Streetwear | Skipaman Store',
    description: `Browse our collection of ${totalProducts} premium t-shirts and streetwear across ${categories} categories. Fast shipping and exceptional quality.`,
    keywords: 't-shirts, streetwear, fashion, premium quality, shop, clothing, apparel',
    openGraph: {
      title: 'Shop - Skipaman Store',
      description: `Browse our collection of ${totalProducts} premium t-shirts and streetwear.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shop - Skipaman Store',
      description: `Browse our collection of ${totalProducts} premium t-shirts and streetwear.`,
    },
  }
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner
          variant="gradient"
          size="xl"
          color="purple"
          text="Loading shop..."
        />
      </div>
    }>
      <ShopPage />
    </Suspense>
  )
}

// Enable ISR - revalidate every 30 minutes for fresh product data
export const revalidate = 1800

// Add caching headers for better performance
export async function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}
