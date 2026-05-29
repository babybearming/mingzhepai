"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface NoteFrontmatter {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  tags: string[];
  date: string;
  type: "note";
  abstract: string;
}

interface EssayFrontmatter {
  title: string;
  date: string;
  tags: string[];
  type: "essay";
  excerpt: string;
}

type Frontmatter = NoteFrontmatter | EssayFrontmatter;

interface MarkdownEditorProps {
  contentType: "note" | "essay";
  initialSlug?: string;
  initialFrontmatter?: Partial<Frontmatter>;
  initialContent?: string;
  onSave: (slug: string, frontmatter: Frontmatter, content: string) => Promise<void>;
  isEditing?: boolean;
}

export default function MarkdownEditor({
  contentType,
  initialSlug,
  initialFrontmatter,
  initialContent = "",
  onSave,
  isEditing = false,
}: MarkdownEditorProps) {
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();

  const [slug, setSlug] = useState(initialSlug || "");
  const [title, setTitle] = useState(initialFrontmatter?.title || "");
  const [date, setDate] = useState(initialFrontmatter?.date || today);
  const [tagsInput, setTagsInput] = useState(
    initialFrontmatter?.tags?.join(", ") || ""
  );
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const [authors, setAuthors] = useState(
    (initialFrontmatter as NoteFrontmatter)?.authors || ""
  );
  const [year, setYear] = useState(
    (initialFrontmatter as NoteFrontmatter)?.year || currentYear
  );
  const [journal, setJournal] = useState(
    (initialFrontmatter as NoteFrontmatter)?.journal || ""
  );
  const [doi, setDoi] = useState(
    (initialFrontmatter as NoteFrontmatter)?.doi || ""
  );
  const [abstract, setAbstract] = useState(
    (initialFrontmatter as NoteFrontmatter)?.abstract || ""
  );
  const [excerpt, setExcerpt] = useState(
    (initialFrontmatter as EssayFrontmatter)?.excerpt || ""
  );

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "untitled";
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("请输入标题");
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    const tags = tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean);

    let frontmatter: Frontmatter;
    if (contentType === "note") {
      frontmatter = {
        title: title.trim(),
        authors: authors.trim(),
        year: Number(year),
        journal: journal.trim(),
        doi: doi.trim() || undefined,
        tags,
        date,
        type: "note" as const,
        abstract: abstract.trim(),
      };
    } else {
      frontmatter = {
        title: title.trim(),
        date,
        tags,
        type: "essay" as const,
        excerpt: excerpt.trim(),
      };
    }

    Object.keys(frontmatter).forEach(key => {
      if (frontmatter[key as keyof Frontmatter] === undefined) {
        delete frontmatter[key as keyof Frontmatter];
      }
    });

    setSaving(true);
    setError("");
    try {
      await onSave(finalSlug, frontmatter, content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200";

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">基本信息</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={contentType === "note" ? "文献标题" : "随笔标题"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Slug（留空自动生成）</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              disabled={isEditing}
              className={inputClass + (isEditing ? " opacity-50 cursor-not-allowed" : "")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">标签（逗号分隔）</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="标签1, 标签2, 标签3"
              className={inputClass}
            />
          </div>
        </div>

        {contentType === "note" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">作者</label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="作者列表"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">年份</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">期刊/来源</label>
                <input
                  type="text"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="期刊名称"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">DOI（可选）</label>
                <input
                  type="text"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="10.xxxx/xxxxx"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">摘要</label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="文献摘要"
                rows={3}
                className={inputClass + " resize-y"}
              />
            </div>
          </>
        )}

        {contentType === "essay" && (
          <div>
            <label className="block text-xs text-muted-foreground mb-1">摘要</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="简短摘要"
              rows={2}
              className={inputClass + " resize-y"}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-sm font-medium text-foreground">正文 (Markdown)</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {showPreview ? "隐藏预览" : "显示预览"}
          </button>
        </div>
        <div className={`flex ${showPreview ? "divide-x divide-border" : ""}`}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此输入 Markdown 内容..."
            className={`p-4 bg-transparent text-sm text-foreground font-mono leading-relaxed focus:outline-none resize-none ${showPreview ? "w-1/2" : "w-full"}`}
            style={{ minHeight: "400px" }}
          />
          {showPreview && (
            <div className="w-1/2 p-4 overflow-auto prose prose-sm max-w-none" style={{ minHeight: "400px" }}>
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">预览区域</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "保存中..." : isEditing ? "更新" : "发布"}
        </button>
      </div>
    </div>
  );
}

