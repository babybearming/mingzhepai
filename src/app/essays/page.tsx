import type { Metadata } from "next";
import { getAllEssays } from "@/lib/content";
import EssayCard from "@/components/EssayCard";
import SearchBar from "@/components/SearchBar";
import { buildSearchIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "随笔",
  description: "个人随笔与思考，记录生活中的感悟与反思。",
};

export default function EssaysPage() {
  const essays = getAllEssays();
  const searchIndex = buildSearchIndex();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          随笔
        </h1>
        <p className="text-muted-foreground mb-6">
          记录生活中的思考、感悟与反省。
        </p>
        <SearchBar items={searchIndex} />
      </div>
      {essays.length > 0 ? (
        <div className="space-y-5">
          {essays.map((essay) => (
            <EssayCard key={essay.slug} meta={essay} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">暂无随笔</p>
          <p className="text-sm mt-2">在 content/essays/ 目录下添加 MDX 文件即可。</p>
        </div>
      )}
    </div>
  );
}