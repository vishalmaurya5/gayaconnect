import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/security/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  clearUserSession(response);

  return response;
}
