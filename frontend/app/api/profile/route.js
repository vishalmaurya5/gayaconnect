import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'
import Labourer from '@/lib/db/models/Labourer'
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

    let worker = await Labourer.findOne({ $or: [{ userId: user._id }, { phone: user.phone }] })
    if (worker && !worker.userId) {
      worker.userId = user._id;
      await worker.save();
    }

    return NextResponse.json({
      success: true,
      user: toAuthUser(user),
      vendor,
      worker,
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
    const { 
      name, address, profileImage, 
      businessName, category, subCategory, businessAddress, description,
      workerName, workerRole, workerCategory, workerArea, workerDailyRate, workerHourlyRate, workerAvailability, workerSkills
    } = parsed.data

    user.name = name
    user.address = address || ''
    if (businessName) user.businessName = businessName

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
        if (parsed.data.instagram !== undefined) vendor.instagram = parsed.data.instagram
        if (parsed.data.facebook !== undefined) vendor.facebook = parsed.data.facebook
        if (parsed.data.experience !== undefined) vendor.experience = parsed.data.experience
        if (parsed.data.workingHours !== undefined) vendor.workingHours = parsed.data.workingHours
        if (parsed.data.services !== undefined) {
          vendor.services = parsed.data.services.split(',').map(s => s.trim()).filter(Boolean)
        }
        vendor.description = description || ''
        if (profileImage !== undefined) vendor.logo = user.profileImage || ''
        vendor.isApproved = true
        await vendor.save()
      } else {
        vendor = await Vendor.create({
          userId: user._id,
          regCode: user.regCode || '',
          name: businessName || user.businessName || user.name,
          category: category || user.category || 'Other',
          subCategory: subCategory || user.subCategory || '',
          address: businessAddress || user.address || '',
          description: description || user.description || '',
          instagram: parsed.data.instagram || '',
          facebook: parsed.data.facebook || '',
          experience: parsed.data.experience || '',
          workingHours: parsed.data.workingHours || '',
          services: parsed.data.services ? parsed.data.services.split(',').map(s => s.trim()).filter(Boolean) : [],
          logo: user.profileImage || '',
          isApproved: true
        })
      }
    }

    let worker = await Labourer.findOne({ userId: user._id })
    if (worker) {
      if (workerName !== undefined && workerName !== '') worker.name = workerName;
      if (workerRole !== undefined && workerRole !== '') worker.role = workerRole;
      if (workerCategory !== undefined && workerCategory !== '') worker.category = workerCategory;
      if (workerArea !== undefined && workerArea !== '') worker.area = workerArea;
      if (workerDailyRate !== undefined && workerDailyRate !== '') worker.dailyRate = Number(workerDailyRate);
      if (workerHourlyRate !== undefined && workerHourlyRate !== '') worker.hourlyRate = Number(workerHourlyRate);
      if (workerAvailability !== undefined) worker.availability = workerAvailability;
      if (workerSkills !== undefined) worker.skills = workerSkills;
      if (profileImage !== undefined) worker.photo = user.profileImage || '';
      await worker.save()
    }

    return NextResponse.json({
      success: true,
      user: toAuthUser(user),
      vendor,
      worker,
      message: 'Profile updated',
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
