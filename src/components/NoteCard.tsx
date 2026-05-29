import Link from "next/link";
import type { NoteMeta } from "@/lib/types";
import TagList from "./TagList";

export default function NoteCard({ meta }: { meta: NoteMeta }) {
  return (
    <Link href={`/notes/${meta.slug}`}>
      <article className="card-hover rounded-xl border border-border bg-card p-5 sm:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-card-foreground leading-snug line-clamp-2">
            {meta.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {meta.year}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mb-3 space-y-1">
          <p>{meta.authors}</p>
          <p className="text-xs">{meta.journal}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
          {meta.abstract}
        </p>
        <TagList tags={meta.tags} />
      </article>
    </Link>
  );
}
