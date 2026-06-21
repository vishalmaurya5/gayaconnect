import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'
import { toAuthUser } from '@/lib/utils/contactAccess'
import { validateImageDataUrl } from '@/lib/utils/imageUpload'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { profileSchema, validationError } from '@/lib/security/validation'

export async function GET(request) {
  try {
    await connectDB()

    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const vendor = user.role === 'vendor' ? await Vendor.findOne({ userId: user._id }) : null

    return NextResponse.json({
      success: true,
      user: toAuthUser(user),
      vendor,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const parsed = profileSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: validationError(parsed.error) }, { status: 400 })
    }
    const { name, address, profileImage, businessName, category, subCategory, businessAddress, description } = parsed.data

    user.name = name
    user.address = address || ''

    if (profileImage !== undefined) {
      user.profileImage = validateImageDataUrl(profileImage) || ''
    }

    await user.save()

    let vendor = null
    if (user.role === 'vendor') {
      vendor = await Vendor.findOne({ userId: user._id })
      if (vendor) {
        if (businessName) vendor.name = businessName
        if (category) vendor.category = category
        if (subCategory) vendor.subCategory = subCategory
        if (businessAddress) vendor.address = businessAddress
        vendor.description = description || ''
        if (profileImage !== undefined) vendor.logo = user.profileImage || ''
        await vendor.save()
      }
    }

    return NextResponse.json({
      success: true,
      user: toAuthUser(user),
      vendor,
      message: 'Profile updated',
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
