import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { sendPasswordResetEmail } from "@/lib/services/email";
import { enforceRateLimit } from "@/lib/security/rateLimit";

export async function POST(request) {
  const limited = enforceRateLimit(request, "forgot-password", { limit: 5, windowMs: 15 * 60 * 1000 });
  if (limited) return limited;

  try {
    await connectDB();
    const { identifier = "" } = await request.json().catch(() => ({}));
    const typed = String(identifier).trim();
    const normalized = typed.toLowerCase();

    if (!typed) {
      return NextResponse.json({ error: "Mobile number or Email is required" }, { status: 400 });
    }

    const user = await User.findOne({
      $or: [
        { email: { $in: [typed, normalized] } },
        { phone: typed }
      ],
      isDeleted: { $ne: true },
    });
    
    // Generic response so we never reveal whether an account is registered (no user enumeration).
    const generic = NextResponse.json({
      success: true,
      message: "If an account exists with this detail, a reset link has been sent to the registered email address.",
    });

    if (!user) return generic;

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    try {
      await sendPasswordResetEmail(user, rawToken);
    } catch (mailErr) {
      // Roll back the token so a failed send doesn't leave a dangling reset window.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error("Password reset email failed:", mailErr);
      return NextResponse.json(
        { error: "Could not send the reset email right now. Please try again later." },
        { status: 502 }
      );
    }

    return generic;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
