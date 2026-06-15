import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Labourer from '@/lib/db/models/Labourer'
import { validateImageDataUrl } from '@/lib/utils/imageUpload'
import { enforceRateLimit } from '@/lib/security/rateLimit'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    
    const query = { isApproved: true }

    const category = searchParams.get('category')
    if (category) query.category = category

    const area = searchParams.get('area')
    if (area) query.area = { $regex: new RegExp(area, 'i') }

    const availability = searchParams.get('availability')
    if (availability === 'today') query.availability = true

    const minRate = searchParams.get('minRate')
    const maxRate = searchParams.get('maxRate')
    if (minRate || maxRate) {
      query.dailyRate = {}
      if (minRate) query.dailyRate.$gte = Number(minRate)
      if (maxRate) query.dailyRate.$lte = Number(maxRate)
    }

    const labourers = await Labourer.find(query).sort('-createdAt')

    return NextResponse.json({ success: true, labourers })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const limited = enforceRateLimit(request, 'labour-register', { limit: 5, windowMs: 60 * 60 * 1000 })
  if (limited) return limited

  try {
    await connectDB()
    const body = await request.json()

    const { name, phone, category, area, dailyRate, skills, availability, photoStr } = body

    if (!name || !phone || !category || !area) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    let photoUrl = ''
    if (photoStr && photoStr.startsWith('data:image/')) {
      photoUrl = validateImageDataUrl(photoStr, 'Labour photo')
    }

    const labourer = new Labourer({
      name,
      phone,
      category,
      area,
      dailyRate: dailyRate ? Number(dailyRate) : 0,
      skills: skills || [],
      availability: availability !== undefined ? availability : true,
      photo: photoUrl,
      isApproved: false // Admin must approve
    })

    await labourer.save()

    return NextResponse.json({ success: true, message: 'Registration submitted successfully. Waiting for admin approval.', labourer })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
