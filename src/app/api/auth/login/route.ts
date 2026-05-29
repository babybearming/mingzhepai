import { NextRequest, NextResponse } from "next/server";
import { createToken, checkPassword, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    if (!password || !checkPassword(password)) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }
    const token = await createToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
