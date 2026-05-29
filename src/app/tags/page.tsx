import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览所有内容。",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        标签
      </h1>
      <p className="text-muted-foreground mb-10">
        按标签浏览所有文献笔记和随笔。
      </p>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                border border-border bg-card text-sm text-foreground
                hover:border-accent hover:text-accent transition-colors duration-200"
            >
              <span>{tag}</span>
              <span className="text-xs text-muted-foreground">({count})</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">暂无标签。</p>
      )}
    </div>
  );
}