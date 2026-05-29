import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <span className="text-foreground font-medium">明哲派</span>
          <span className="mx-2">·</span>
          <span>透过知识看见道理</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rss.xml" className="hover:text-accent transition-colors">
            RSS
          </Link>
          <Link href="/tags" className="hover:text-accent transition-colors">
            标签
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            关于
          </Link>
        </div>
      </div>
    </footer>
  );
}
