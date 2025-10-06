'use client'

import { AuthProvider } from '@/src/context/AuthContext'
import { CartProvider } from '@/src/context/CartContext'
import { WishlistProvider } from '@/src/context/WishlistContext'
import { HeaderProvider } from '@/src/context/HeaderContext'
import { PaymentProvider } from '@/src/context/PaymentContext'
import { NotificationProvider } from '@/src/context/NotificationContext'
import Layout from '@/src/components/layout/Layout'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PaymentProvider>
          <WishlistProvider>
            <HeaderProvider>
              <NotificationProvider>
                <Layout>
                  {children}
                </Layout>
              </NotificationProvider>
            </HeaderProvider>
          </WishlistProvider>
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  )
}
