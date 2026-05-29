import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "明哲派 — 透过知识看见道理",
    template: "%s | 明哲派",
  },
  description: "明哲派是一个关于文献阅读、思考和随笔的个人网站。透过知识看见道理，透过道理抵达智慧。",
  metadataBase: new URL("https://mingzhepai.vercel.app"),
  openGraph: {
    title: "明哲派",
    description: "透过知识看见道理，透过道理抵达智慧",
    type: "website",
    locale: "zh_CN",
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${notoSerif.variable} min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}