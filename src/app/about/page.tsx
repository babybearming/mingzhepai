import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于明哲派和站长。",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
        关于明哲派
      </h1>

      <div className="prose prose-lg max-w-none">
        <p>
          「明哲」二字，取自「明明德，止于至善」之意，亦暗合「明哲保身」的智慧。明哲派不是学术流派，不是一个标签，而是一种态度——透过知识看见道理，透过道理抵达智慧。
        </p>

        <h2>为什么做这个站？</h2>
        <p>
          在信息过载的时代，我们每天都在消费大量内容，但真正被消化的知识却很少。这个网站是我的一个实验——用结构化的方式记录文献阅读，用自由的方式书写随笔，把碎片化的信息沉淀为系统的思考。
        </p>

        <h2>站点内容</h2>
        <ul>
          <li><strong>文献笔记</strong> — 学术文献的阅读记录，包含文献信息、核心要点和个人思考</li>
          <li><strong>随笔</strong> — 生活中的感悟、方法论思考、和读书心得</li>
        </ul>

        <h2>技术栈</h2>
        <p>
          本站使用 Next.js 构建，内容以 Markdown/MDX 文件管理，静态生成，部署在 Vercel 上。
        </p>

        <h2>联系方式</h2>
        <p>
          如果你对我的内容感兴趣，或有任何想法想交流，欢迎通过以下方式联系我：
        </p>
        <ul>
          <li>电子邮件：hello@example.com</li>
          <li>GitHub：github.com/your-username</li>
        </ul>

        <blockquote>
          <p>读书的终极目的，不是为了成为一个「博学」的人，而是为了成为一个「明理」的人。</p>
        </blockquote>
      </div>
    </div>
  );
}