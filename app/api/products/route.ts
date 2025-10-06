import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/src/data/products'

// Cache products data in memory for faster access
let cachedProducts = products
let cacheTimestamp = Date.now()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Check if cache is still valid
    if (Date.now() - cacheTimestamp > CACHE_DURATION) {
      cachedProducts = products
      cacheTimestamp = Date.now()
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const sort = searchParams.get('sort') || 'name'

    let filteredProducts = [...cachedProducts]

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
    }

    // Sort products
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'name':
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    // Apply pagination
    const startIndex = offset ? parseInt(offset) : 0
    const endIndex = limit ? startIndex + parseInt(limit) : filteredProducts.length
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response = NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      hasMore: endIndex < filteredProducts.length,
      page: Math.floor(startIndex / (limit ? parseInt(limit) : filteredProducts.length)) + 1,
      totalPages: Math.ceil(filteredProducts.length / (limit ? parseInt(limit) : filteredProducts.length))
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=300')

    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new product (in a real app, this would save to database)
    const newProduct = {
      id: (products.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
