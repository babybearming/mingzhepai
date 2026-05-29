import { getAllContent } from "@/lib/content";
import type { NoteMeta, EssayMeta } from "@/lib/types";

const SITE_URL = "https://mingzhepai.vercel.app";

export const dynamic = "force-static";

export async function GET() {
  const items = getAllContent();

  const rssItems = items.map((item) => {
    const link = `${SITE_URL}/${item.type === "note" ? "notes" : "essays"}/${item.slug}`;
    const description = item.type === "note"
      ? (item as NoteMeta).abstract
      : (item as EssayMeta).excerpt;
    return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>明哲派</title>
    <link>${SITE_URL}</link>
    <description>透过知识看见道理，透过道理抵达智慧</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}