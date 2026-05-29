import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { type, slug } = body;
    if (!type || !slug) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }
    const dir = type === "note"
      ? path.join(contentDir, "notes")
      : path.join(contentDir, "essays");
    const filePath = path.join(dir, slug + ".mdx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "内容不存在" }, { status: 404 });
    }
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
