import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/src/components/ui/LoadingSpinner'
import ProtectedRoute from '@/src/components/auth/ProtectedRoute'

const WishlistPage = dynamic(() => import('@/src/pages/WishlistPage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingSpinner
        variant="gradient"
        size="xl"
        color="purple"
        text="Loading wishlist..."
      />
    </div>
  ),
  ssr: false, // Disable SSR for protected routes
})

export default function Wishlist() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <LoadingSpinner
            variant="gradient"
            size="xl"
            color="purple"
            text="Loading wishlist..."
          />
        </div>
      }>
        <WishlistPage />
      </Suspense>
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Wishlist - Skipaman Store',
  description: 'View your saved items and manage your wishlist.',
}
