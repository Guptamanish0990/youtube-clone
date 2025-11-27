// ====================== app/api/login/route.js ======================
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json();

  const res = NextResponse.json({ success: true });

  // SERVER-SET COOKIE (middleware can read this)
  res.cookies.set({
    name: "auth",
    value: email,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
