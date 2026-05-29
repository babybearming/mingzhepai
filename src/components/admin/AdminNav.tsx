"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← 返回网站
          </Link>
          <span className="text-border">|</span>
          <Link href="/admin" className="font-semibold text-foreground">
            管理面板
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Link
                href="/admin/notes/new"
                className="text-sm px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                + 新建笔记
              </Link>
              <Link
                href="/admin/essays/new"
                className="text-sm px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                + 新建随笔
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                退出登录
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
