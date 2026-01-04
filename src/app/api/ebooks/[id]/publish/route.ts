import { createRouteHandlerClient } from '@/lib/supabase/server'
import { generateEbookPDF } from '@/lib/pdf'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Step 1: Fetch ebook and chapters
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (ebookError || !ebook) {
      return NextResponse.json({ error: 'Ebook not found' }, { status: 404 })
    }

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('ebook_id', params.id)
      .order('order_index', { ascending: true })

    if (chaptersError) {
      return NextResponse.json(
        { error: 'Error fetching chapters' },
        { status: 500 }
      )
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json(
        { error: 'Ebook must have at least one chapter' },
        { status: 400 }
      )
    }

    // Step 2: Generate the PDF
    const pdfBuffer = await generateEbookPDF(ebook, chapters)

    // Step 3: Upload the PDF to Supabase Storage (bucket name: ebooks)
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Step 6: Generate a unique slug
    const slug = `${ebook.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    const fileName = `${user.id}/${ebook.id}/${slug}.pdf`
    const { error: uploadError } = await serviceClient.storage
      .from('ebooks')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Error uploading PDF' },
        { status: 500 }
      )
    }

    // Step 4: Save the pdf path in database
    const { error: assetError } = await supabase
      .from('ebook_assets')
      .upsert({
        ebook_id: params.id,
        pdf_path: fileName,
        pdf_url: serviceClient.storage.from('ebooks').getPublicUrl(fileName).data.publicUrl,
      })

    if (assetError) {
      console.error('Asset error:', assetError)
      return NextResponse.json(
        { error: 'Error saving PDF path' },
        { status: 500 }
      )
    }

    // Step 5: Set ebook status to "published"
    const { error: updateError } = await supabase
      .from('ebooks')
      .update({
        status: 'published',
        slug,
      })
      .eq('id', params.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Error updating ebook status' },
        { status: 500 }
      )
    }

    // Return the public product URL
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${slug}`

    return NextResponse.json(
      {
        success: true,
        product_url: productUrl,
        slug,
      },
      {
        headers: response.headers,
      }
    )
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
