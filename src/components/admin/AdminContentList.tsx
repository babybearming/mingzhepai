"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ContentItem {
  slug: string;
  type: string;
  title: string;
  date: string;
  tags: string[];
  abstract?: string;
  excerpt?: string;
}

export default function AdminContentList() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "note" | "essay">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (type: string, slug: string) => {
    if (!confirm("确定要删除这篇内容吗？此操作不可撤销。")) return;
    setDeleting(slug);
    try {
      const res = await fetch("/api/content/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => !(i.type === type && i.slug === slug)));
      }
    } finally {
      setDeleting(null);
    }
  };

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);
  const noteCount = items.filter(i => i.type === "note").length;
  const essayCount = items.filter(i => i.type === "essay").length;

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">加载中...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{items.length}</div>
          <div className="text-sm text-muted-foreground">全部内容</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{noteCount}</div>
          <div className="text-sm text-muted-foreground">文献笔记</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{essayCount}</div>
          <div className="text-sm text-muted-foreground">随笔</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "note", "essay"] as const).map((t) => {
          const isActive = filter === t;
          const label = t === "all" ? "全部" : t === "note" ? "文献笔记" : "随笔";
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>暂无内容</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const editHref = item.type === "note" ? `/admin/notes/edit?slug=${item.slug}` : `/admin/essays/edit?slug=${item.slug}`;
            const viewHref = item.type === "note" ? `/notes/${item.slug}` : `/essays/${item.slug}`;
            const typeLabel = item.type === "note" ? "笔记" : "随笔";
            const typeColor = item.type === "note"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400";
            return (
              <div
                key={item.type + "-" + item.slug}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>
                      {typeLabel}
                    </span>
                    <h3 className="text-sm font-medium text-foreground truncate">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <time>{new Date(item.date).toLocaleDateString("zh-CN")}</time>
                    <span>{item.tags.join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={editHref}
                    className="px-3 py-1.5 text-sm rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    编辑
                  </Link>
                  <Link
                    href={viewHref}
                    target="_blank"
                    className="px-3 py-1.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => handleDelete(item.type, item.slug)}
                    disabled={deleting === item.slug}
                    className="px-3 py-1.5 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    {deleting === item.slug ? "..." : "删除"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
