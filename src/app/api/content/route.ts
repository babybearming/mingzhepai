import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

function getDir(type: string) {
  return type === "note"
    ? path.join(contentDir, "notes")
    : path.join(contentDir, "essays");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (slug && type) {
    const dir = getDir(type);
    const filePath = path.join(dir, slug + ".mdx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "内容不存在" }, { status: 404 });
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return NextResponse.json({ meta: data, content, slug });
  }

  const types = type ? [type] : ["note", "essay"];
  const items: Record<string, unknown>[] = [];
  for (const t of types) {
    const dir = getDir(t);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      items.push({ ...data, slug: file.replace(/\.mdx$/, ""), type: t, content });
    }
  }
  items.sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime());
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { type, slug, frontmatter, content } = body;
    if (!type || !slug || !frontmatter || content === undefined) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }
    if (type !== "note" && type !== "essay") {
      return NextResponse.json({ error: "类型无效" }, { status: 400 });
    }
    const dir = getDir(type);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, slug + ".mdx");
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "slug 已存在" }, { status: 409 });
    }
    const fileContent = matter.stringify("\n" + content, frontmatter);
    fs.writeFileSync(filePath, fileContent, "utf-8");
    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { type, slug, frontmatter, content, oldSlug } = body;
    if (!type || !slug || !frontmatter || content === undefined) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }
    const dir = getDir(type);
    const targetSlug = oldSlug || slug;
    const filePath = path.join(dir, targetSlug + ".mdx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "内容不存在" }, { status: 404 });
    }
    const fileContent = matter.stringify("\n" + content, frontmatter);
    fs.writeFileSync(filePath, fileContent, "utf-8");
    if (oldSlug && oldSlug !== slug) {
      const newPath = path.join(dir, slug + ".mdx");
      fs.renameSync(filePath, newPath);
    }
    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
