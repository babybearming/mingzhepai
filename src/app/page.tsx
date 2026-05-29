import Link from "next/link";
import { getAllNotes, getAllEssays, buildSearchIndex } from "@/lib/content";
import NoteCard from "@/components/NoteCard";
import EssayCard from "@/components/EssayCard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const notes = getAllNotes().slice(0, 4);
  const essays = getAllEssays().slice(0, 4);
  const searchIndex = buildSearchIndex();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
              明哲派
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              透过知识看见道理，透过道理抵达智慧。
              <br />
              这里记录我的文献阅读笔记、思考和随笔。
            </p>
            <div>
              <SearchBar items={searchIndex} />
            </div>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">最新文献笔记</h2>
            <Link
              href="/notes"
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              查看全部 →
            </Link>
          </div>
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.map((note) => (
                <NoteCard key={note.slug} meta={note} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无文献笔记，敬请期待。</p>
          )}
        </div>
      </section>

      {/* Essays Section */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">最新随笔</h2>
            <Link
              href="/essays"
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              查看全部 →
            </Link>
          </div>
          {essays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {essays.map((essay) => (
                <EssayCard key={essay.slug} meta={essay} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无随笔，敬请期待。</p>
          )}
        </div>
      </section>
    </div>
  );
}
