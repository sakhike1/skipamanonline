import { NextRequest, NextResponse } from 'next/server'

// This would typically connect to your backend API
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = request.headers.get('authorization')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // Forward the request to your backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/design-requests?${searchParams}`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch design requests' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching design requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Forward the request to your backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/design-requests`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to create design request' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating design request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
