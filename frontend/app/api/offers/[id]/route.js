import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Offer from '@/lib/db/models/Offer'
import Vendor from '@/lib/db/models/Vendor'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { offerSchema, validationError } from '@/lib/security/validation'

async function getOwnedOffer(request, id) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) }
  }

  if (user.role !== 'vendor') {
    return { error: NextResponse.json({ success: false, message: 'Only vendors can manage offers' }, { status: 403 }) }
  }

  const vendor = await Vendor.findOne({ userId: user._id }).select('_id')
  const ownerIds = [user._id, vendor?._id].filter(Boolean)
  const offer = await Offer.findOne({ _id: id, vendorId: { $in: ownerIds } })
  if (!offer) {
    return { error: NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 }) }
  }

  return { offer }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params;

    const { offer, error } = await getOwnedOffer(request, id)
    if (error) return error

    const parsed = offerSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: validationError(parsed.error) }, { status: 400 })
    }
    const { title, description, discountText, validUntil } = parsed.data

    offer.title = title
    offer.description = description
    offer.discountText = discountText
    offer.validUntil = validUntil ? new Date(validUntil) : undefined
    await offer.save()

    return NextResponse.json({
      success: true,
      offer,
      message: 'Offer updated successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params;

    const { offer, error } = await getOwnedOffer(request, id)
    if (error) return error

    await offer.deleteOne()

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
