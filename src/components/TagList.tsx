import Link from "next/link";

export default function TagList({
  tags,
  baseHref,
}: {
  tags: string[];
  baseHref?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={baseHref ? `${baseHref}?tag=${encodeURIComponent(tag)}` : `/tags/${encodeURIComponent(tag)}`}
          className="text-xs px-2.5 py-0.5 rounded-full bg-accent-light text-accent
            hover:opacity-80 transition-opacity duration-200"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
