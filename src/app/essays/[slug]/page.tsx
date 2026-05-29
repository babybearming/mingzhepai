import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEssays, getEssayBySlug } from "@/lib/content";
import MdxContent from "@/components/MdxContent";
import TagList from "@/components/TagList";

export async function generateStaticParams() {
  const essays = getAllEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getEssayBySlug(slug);
    return {
      title: meta.title,
      description: meta.excerpt,
    };
  } catch {
    return { title: "未找到" };
  }
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let essay;
  try {
    essay = getEssayBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = essay;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="/essays" className="hover:text-accent transition-colors">随笔</a>
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

      <MdxContent source={content} />

      <footer className="mt-16 pt-8 border-t border-border">
        <a
          href="/essays"
          className="text-sm text-accent hover:underline underline-offset-4"
        >
          ← 返回随笔列表
        </a>
      </footer>
    </article>
  );
}