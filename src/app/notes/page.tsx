import type { Metadata } from "next";
import { getAllNotes, getNoteBySlug } from "@/lib/content";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import { buildSearchIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "文献笔记",
  description: "文献阅读笔记集合，记录学术文献的核心要点和个人思考。",
};

export default function NotesPage() {
  const notes = getAllNotes();
  const searchIndex = buildSearchIndex();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          文献笔记
        </h1>
        <p className="text-muted-foreground mb-6">
          记录学术文献的核心要点、个人思考与评论。
        </p>
        <SearchBar items={searchIndex} />
      </div>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notes.map((note) => (
            <NoteCard key={note.slug} meta={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">暂无文献笔记</p>
          <p className="text-sm mt-2">在 content/notes/ 目录下添加 MDX 文件即可。</p>
        </div>
      )}
    </div>
  );
}
