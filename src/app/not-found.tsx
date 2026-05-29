import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center animate-fade-in">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        页面未找到，或许它在另一条思考路径上。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
          bg-accent text-accent-foreground font-medium
          hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}