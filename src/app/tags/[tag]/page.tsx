import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getContentByTag } from "@/lib/content";
import NoteCard from "@/components/NoteCard";
import EssayCard from "@/components/EssayCard";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `标签：${decodeURIComponent(tag)}`,
    description: `浏览标签「${decodeURIComponent(tag)}」下的所有内容。`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const items = getContentByTag(decodedTag);

  if (items.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <div className="mb-10">
        <a href="/tags" className="text-sm text-accent hover:underline underline-offset-4 mb-4 inline-block">
          ← 全部标签
        </a>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {decodedTag}
        </h1>
        <p className="text-muted-foreground">
          共 {items.length} 篇内容
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) =>
          item.type === "note" ? (
            <NoteCard key={item.slug} meta={item} />
          ) : (
            <EssayCard key={item.slug} meta={item} />
          )
        )}
      </div>
    </div>
  );
}