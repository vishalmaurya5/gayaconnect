// app/api/labour/route.js — Labour listing API
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Labour from "@/lib/db/models/Labourer";
import { checkSubscription } from "@/lib/security/subscription";
import { validateImageDataUrl } from "@/lib/utils/imageUpload";

// ─── GET /api/labour — List approved workers ──────────────────────────────────
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search     = searchParams.get("search")     || "";
    const category   = searchParams.get("category")   || "";
    const area       = searchParams.get("area")       || "";
    const state      = searchParams.get("state")      || "";
    const district   = searchParams.get("district")   || "";
    const minRate    = Number(searchParams.get("minRate")) || 0;
    const maxRate    = Number(searchParams.get("maxRate")) || 99999;
    const available  = searchParams.get("available")   === "true";
    const page       = Math.max(1, Number(searchParams.get("page"))  || 1);
    const limit      = Math.min(50, Number(searchParams.get("limit")) || 12);
    const skip       = (page - 1) * limit;

    // Build query
    const query = { isApproved: true };

    if (search) {
      query.$or = [
        { name:       { $regex: search, $options: "i" } },
        { role:       { $regex: search, $options: "i" } },
        { skills:     { $elemMatch: { $regex: search, $options: "i" } } },
        { bloodGroup: { $regex: search, $options: "i" } },
        { state:      { $regex: search, $options: "i" } },
        { district:   { $regex: search, $options: "i" } },
        { pincode:    { $regex: search, $options: "i" } },
        { address:    { $regex: search, $options: "i" } },
        { area:       { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.role  = { $regex: category, $options: "i" };
    if (area)     query.area  = { $regex: area,     $options: "i" };
    if (state)    query.state = { $regex: state,    $options: "i" };
    if (district) query.district = { $regex: district, $options: "i" };
    if (available) query.availability = true;

    // Rate filter - only apply if minRate or maxRate was explicitly requested
    if (searchParams.has("minRate") || searchParams.has("maxRate")) {
      query.dailyRate = { $gte: minRate, $lte: maxRate };
    }

    const [workers, total] = await Promise.all([
      Labour.find(query)
        .select("-phone -whatsapp -aadhaarNumber -aadhaarImage") // hide contact and Aadhaar by default
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Labour.countDocuments(query),
    ]);

    // Check if requester is subscribed — reveal contact if yes
    const { allowed } = await checkSubscription(request);

    const sanitized = workers.map(w => ({
      ...w,
      phone:    allowed ? w.phone    : null,
      whatsapp: allowed ? w.whatsapp : null,
    }));

    return NextResponse.json({ success: true, labourers: sanitized, total, page, isSubscribed: allowed });
  } catch (err) {
    console.error("GET /api/labour error:", err);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}

// ─── POST /api/labour — Register as a labour ─────────────────────────────────
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name, phone, whatsapp, photo,
      role, category, area, address, pincode, district, state, bloodGroup,
      dailyRate, skills, availability, aadhaarNumber, aadhaarImage
    } = body;

    const actualRole = role || category;

    // Basic validation
    if (!name || !phone || !actualRole || !area || !aadhaarNumber || !aadhaarImage) {
      return NextResponse.json(
        { success: false, message: "Name, phone, category, area, and Aadhaar details are required" },
        { status: 400 }
      );
    }
    
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { success: false, message: "Aadhaar number must be exactly 12 numeric digits" },
        { status: 400 }
      );
    }

    // Prevent duplicate phone registrations
    const existing = await Labour.findOne({ phone });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A worker with this phone number is already registered" },
        { status: 409 }
      );
    }

    let validPhoto = null;
    if (photo) {
      try {
        validPhoto = validateImageDataUrl(photo, 'Profile photo', 150 * 1024, '150 KB');
      } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
      }
    }

    let validAadhaarImage = null;
    if (aadhaarImage) {
      try {
        validAadhaarImage = validateImageDataUrl(aadhaarImage, 'Aadhaar Card', 100 * 1024, '100 KB');
      } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
      }
    }

    // Auto-link to existing user if phone matches
    let userId = null;
    try {
      const User = (await import("@/lib/db/models/User")).default;
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        userId = existingUser._id;
      }
    } catch (e) {
      console.error("Error auto-linking user to labour:", e);
    }

    const worker = await Labour.create({
      userId,
      name,
      phone,
      whatsapp: whatsapp || phone,
      photo: validPhoto,
      role: actualRole,
      category: category || actualRole,
      area,
      address,
      pincode,
      district: district || 'Gaya', // fallback for old forms if needed
      state: state || 'Bihar', // fallback
      bloodGroup,
      dailyRate: dailyRate ? Number(dailyRate) : null,
      skills:    Array.isArray(skills) ? skills : [],
      availability: availability !== false,
      aadhaarNumber,
      aadhaarImage: validAadhaarImage,
      status: 'PENDING',
      isApproved: false,
      rating:    0,
      reviewCount: 0,
    });

    return NextResponse.json(
      { success: true, message: "Registration submitted successfully! Your profile is pending review.", worker: { _id: worker._id, name: worker.name } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/labour error:", err);
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
