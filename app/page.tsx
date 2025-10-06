import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { products } from '@/src/data/products'
import LoadingSpinner from '@/src/components/ui/LoadingSpinner'

// Stream the HomePage component for faster perceived performance
const HomePage = dynamic(() => import('@/src/pages/HomePage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingSpinner
        variant="gradient"
        size="xl"
        color="purple"
        text="Loading page..."
      />
    </div>
  ),
  ssr: true, // Enable SSR for the homepage
})

// Generate dynamic metadata with product stats
export async function generateMetadata() {
  const totalProducts = products.length
  const featuredProducts = products.filter(p => p.featured).length

  return {
    title: 'Skipaman Store - Premium T-Shirts & Streetwear | Fast Shipping',
    description: `Discover ${totalProducts} premium quality t-shirts and streetwear with unique designs. ${featuredProducts} featured products. Fast shipping and exceptional customer service.`,
    keywords: 't-shirts, streetwear, fashion, premium quality, custom design, fast shipping, South Africa',
    authors: [{ name: 'Skipaman Store' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
      title: 'Skipaman Store - Premium T-Shirts & Streetwear',
      description: `Discover ${totalProducts} premium quality t-shirts and streetwear with unique designs.`,
      type: 'website',
      locale: 'en_US',
      siteName: 'Skipaman Store',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Skipaman Store - Premium T-Shirts & Streetwear',
      description: `Discover ${totalProducts} premium quality t-shirts and streetwear with unique designs.`,
    },
  }
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner
          variant="gradient"
          size="xl"
          color="purple"
          text="Loading page..."
        />
      </div>
    }>
      <HomePage />
    </Suspense>
  )
}

// Enable ISR for dynamic content updates (revalidate every 15 minutes)
export const revalidate = 900

// Add viewport configuration for better mobile performance
export async function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  }
}
