"use client";

import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default function NewEssayPage() {
  const router = useRouter();

  const handleSave = async (slug: string, frontmatter: any, content: string) => {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "essay", slug, frontmatter, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "创建失败");
    }

    router.push("/admin");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <a href="/admin" className="text-sm text-accent hover:underline underline-offset-4 mb-3 inline-block">
          ← 返回管理面板
        </a>
        <h1 className="text-2xl font-bold text-foreground">新建随笔</h1>
      </div>
      <MarkdownEditor contentType="essay" onSave={handleSave} />
    </div>
  );
}
