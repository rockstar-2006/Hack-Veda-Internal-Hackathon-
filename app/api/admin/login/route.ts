import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP, getRemainingAttempts } from "@/lib/rateLimiter";

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      const remaining = getRemainingAttempts(ip);
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many login attempts. Please try again in 15 minutes.` 
        }, 
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required." }, 
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "Server configuration missing: ADMIN_EMAIL or ADMIN_PASSWORD not found." }, 
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json({ success: true, message: "Admin access granted." });
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials. Unauthorized access attempt logged." }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Protocol failure. Service unreachable." }, { status: 500 });
  }
}
