"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

function NoteEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    fetch("/api/content?type=note&slug=" + encodeURIComponent(slug))
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const handleSave = async (newSlug: string, frontmatter: any, content: string) => {
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "note", slug: newSlug, oldSlug: slug, frontmatter, content }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "更新失败");
    }
    router.push("/admin");
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">加载中...</div>;
  if (notFound) return <div className="text-center py-20 text-muted-foreground">内容不存在</div>;

  return (
    <MarkdownEditor
      contentType="note"
      initialSlug={slug!}
      initialFrontmatter={data.meta}
      initialContent={data.content}
      onSave={handleSave}
      isEditing
    />
  );
}

export default function EditNotePage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <a href="/admin" className="text-sm text-accent hover:underline underline-offset-4 mb-3 inline-block">
          ← 返回管理面板
        </a>
        <h1 className="text-2xl font-bold text-foreground">编辑文献笔记</h1>
      </div>
      <Suspense fallback={<div className="text-center py-20 text-muted-foreground">加载中...</div>}>
        <NoteEditForm />
      </Suspense>
    </div>
  );
}
