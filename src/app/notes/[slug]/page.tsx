import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNotes, getNoteBySlug } from "@/lib/content";
import NoteMetaCard from "@/components/NoteMeta";
import MdxContent from "@/components/MdxContent";
import TagList from "@/components/TagList";

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getNoteBySlug(slug);
    return {
      title: meta.title,
      description: meta.abstract,
    };
  } catch {
    return { title: "未找到" };
  }
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let note;
  try {
    note = getNoteBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = note;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="/notes" className="hover:text-accent transition-colors">文献笔记</a>
          <span>/</span>
          <span>{meta.journal}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
          {meta.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <time dateTime={meta.date}>
            {new Date(meta.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {meta.readingTime && (
            <>
              <span>·</span>
              <span>{meta.readingTime}</span>
            </>
          )}
        </div>
        <TagList tags={meta.tags} />
      </header>

      <NoteMetaCard meta={meta} />

      <div className="mt-10">
        <MdxContent source={content} />
      </div>

      <footer className="mt-16 pt-8 border-t border-border">
        <a
          href="/notes"
          className="text-sm text-accent hover:underline underline-offset-4"
        >
          ← 返回文献笔记列表
        </a>
      </footer>
    </article>
  );
}