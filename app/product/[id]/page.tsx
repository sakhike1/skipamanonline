import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { products } from '@/src/data/products'
import LoadingSpinner from '@/src/components/ui/LoadingSpinner'

// Dynamically import with streaming for faster perceived performance
const ProductPage = dynamic(() => import('@/src/pages/ProductPage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingSpinner
        variant="gradient"
        size="xl"
        color="purple"
        text="Loading product..."
      />
    </div>
  ),
  ssr: true,
})

interface ProductPageProps {
  params: {
    id: string
  }
}

// Generate static params for ALL products (SSG)
export async function generateStaticParams() {
  // Pre-generate pages for all products for instant loading
  return products.map((product) => ({
    id: product.id,
  }))
}

// Generate metadata for SEO (runs at build time)
export async function generateMetadata({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found - Skipaman Store',
      description: 'The requested product could not be found.',
    }
  }

  return {
    title: `${product.name} - Skipaman Store`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, t-shirt, streetwear, fashion`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

export default function Product({ params }: ProductPageProps) {
  // Validate product exists (this runs on the server)
  const product = products.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner
          variant="gradient"
          size="xl"
          color="purple"
          text="Loading product..."
        />
      </div>
    }>
      <ProductPage />
    </Suspense>
  )
}

// Enable ISR for dynamic updates (revalidate every hour)
export const revalidate = 3600
