import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { NoteMeta, EssayMeta, ContentMeta, TagCount } from "./types";

const contentDir = path.join(process.cwd(), "content");
const notesDir = path.join(contentDir, "notes");
const essaysDir = path.join(contentDir, "essays");

function getFileSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function parseFile(dir: string, slug: string) {
  const filePath = path.join(dir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return { data: { ...data, slug }, content, readingTime: stats.text };
}

export function getNoteBySlug(slug: string) {
  const { data, content, readingTime } = parseFile(notesDir, slug);
  return {
    meta: { ...data, type: "note", readingTime } as NoteMeta,
    content,
  };
}

export function getEssayBySlug(slug: string) {
  const { data, content, readingTime } = parseFile(essaysDir, slug);
  return {
    meta: { ...data, type: "essay", readingTime } as EssayMeta,
    content,
  };
}

export function getAllNotes(): NoteMeta[] {
  return getFileSlugs(notesDir)
    .map((slug) => getNoteBySlug(slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllEssays(): EssayMeta[] {
  return getFileSlugs(essaysDir)
    .map((slug) => getEssayBySlug(slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllContent(): ContentMeta[] {
  const notes = getAllNotes();
  const essays = getAllEssays();
  return [...notes, ...essays].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllTags(): TagCount[] {
  const all = getAllContent();
  const tagMap = new Map<string, number>();
  for (const item of all) {
    for (const tag of item.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getContentByTag(tag: string): ContentMeta[] {
  return getAllContent().filter((item) =>
    item.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function buildSearchIndex(): {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  tags: string[];
}[] {
  const all = getAllContent();
  return all.map((item) => ({
    slug: item.slug,
    type: item.type,
    title: item.title,
    excerpt: item.type === "note"
      ? (item as NoteMeta).abstract
      : (item as EssayMeta).excerpt,
    tags: item.tags,
  }));
}
