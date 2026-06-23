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
    const area       = searchParams.get("area")        || "";
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
        { name:     { $regex: search, $options: "i" } },
        { role:     { $regex: search, $options: "i" } },
        { skills:   { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    if (category) query.role  = { $regex: category, $options: "i" };
    if (area)     query.area  = { $regex: area,     $options: "i" };
    if (available) query.availability = true;

    // Rate filter
    query.dailyRate = { $gte: minRate, $lte: maxRate };

    const [workers, total] = await Promise.all([
      Labour.find(query)
        .select("-phone -whatsapp") // hide contact by default
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
      dailyRate: allowed ? w.dailyRate : null, // optionally hide rate too
    }));

    return NextResponse.json({ workers: sanitized, total, page, isSubscribed: allowed });
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
      role, category, area,
      dailyRate, skills, availability,
    } = body;

    // Basic validation
    if (!name || !phone || !role || !area || !dailyRate) {
      return NextResponse.json(
        { error: "name, phone, role, area and dailyRate are required" },
        { status: 400 }
      );
    }

    // Prevent duplicate phone registrations
    const existing = await Labour.findOne({ phone });
    if (existing) {
      return NextResponse.json(
        { error: "A worker with this phone number is already registered" },
        { status: 409 }
      );
    }

    let validPhoto = null;
    if (photo) {
      try {
        validPhoto = validateImageDataUrl(photo, 'Profile photo', 150 * 1024, '150 KB');
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    const worker = await Labour.create({
      name,
      phone,
      whatsapp: whatsapp || phone,
      photo: validPhoto,
      role,
      category: category || role,
      area,
      dailyRate: Number(dailyRate),
      skills:    Array.isArray(skills) ? skills : [],
      availability: availability !== false,
      isApproved: false, // admin must approve
      rating:    0,
      reviewCount: 0,
    });

    return NextResponse.json(
      { message: "Registration submitted. You'll be listed after admin approval.", worker: { _id: worker._id, name: worker.name } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/labour error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
