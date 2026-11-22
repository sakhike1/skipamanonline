import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { products } from '@/src/data/products'
import LoadingSpinner from '@/src/components/ui/LoadingSpinner'

// Stream the shop page for faster perceived performance
const ShopPage = dynamic(() => import('@/src/pages/ShopPage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center space-y-6">
        <LoadingSpinner
          variant="default"
          size="xl"
          color="white"
          text=""
        />
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2">
            SKIPAMAN
          </h2>
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Loading shop...
          </p>
        </div>
      </div>
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center space-y-6">
          <LoadingSpinner
            variant="default"
            size="xl"
            color="white"
            text=""
          />
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2">
              SKIPAMAN
            </h2>
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              Loading shop...
            </p>
          </div>
        </div>
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
