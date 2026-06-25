import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/security/auth";
import { toAuthUser } from "@/lib/utils/contactAccess";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Remove password from response just in case
    const userObj = toAuthUser(user);

    return NextResponse.json({ success: true, user: userObj });

  } catch (error) {
    console.error("Auth Me Error:", error.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
