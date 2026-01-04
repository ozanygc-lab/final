import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  return NextResponse.json(
    { error: 'Génération PDF temporairement désactivée pour debug' },
    { status: 503 }
  )
}
