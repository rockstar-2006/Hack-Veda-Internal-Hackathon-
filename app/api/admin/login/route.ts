import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

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
