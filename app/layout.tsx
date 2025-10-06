import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skipaman Store - Premium T-Shirts & Streetwear',
  description: 'Discover premium quality t-shirts and streetwear with unique designs. Fast shipping and exceptional customer service.',
  keywords: 't-shirts, streetwear, fashion, premium quality, custom design',
  authors: [{ name: 'Skipaman Store' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Skipaman Store - Premium T-Shirts & Streetwear',
    description: 'Discover premium quality t-shirts and streetwear with unique designs.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
