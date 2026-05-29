import Link from "next/link";
import type { EssayMeta } from "@/lib/types";
import TagList from "./TagList";

export default function EssayCard({ meta }: { meta: EssayMeta }) {
  return (
    <Link href={`/essays/${meta.slug}`}>
      <article className="card-hover rounded-xl border border-border bg-card p-5 sm:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-card-foreground leading-snug">
            {meta.title}
          </h3>
          <time className="shrink-0 text-xs text-muted-foreground" dateTime={meta.date}>
            {new Date(meta.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
          {meta.excerpt}
        </p>
        <TagList tags={meta.tags} />
      </article>
    </Link>
  );
}
