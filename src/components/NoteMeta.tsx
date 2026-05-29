import type { NoteMeta } from "@/lib/types";

export default function NoteMeta({ meta }: { meta: NoteMeta }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5 sm:p-6 space-y-3">
      <h2 className="text-lg font-semibold text-foreground">文献信息</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">作者</dt>
          <dd className="text-foreground font-medium">{meta.authors}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">发表年份</dt>
          <dd className="text-foreground font-medium">{meta.year}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">期刊/来源</dt>
          <dd className="text-foreground font-medium">{meta.journal}</dd>
        </div>
        {meta.doi && (
          <div>
            <dt className="text-muted-foreground">DOI</dt>
            <dd>
              <a
                href={`https://doi.org/${meta.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline break-all"
              >
                {meta.doi}
              </a>
            </dd>
          </div>
        )}
        {meta.readingTime && (
          <div>
            <dt className="text-muted-foreground">阅读时间</dt>
            <dd className="text-foreground font-medium">{meta.readingTime}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
