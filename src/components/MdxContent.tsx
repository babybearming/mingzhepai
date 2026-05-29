import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

export default function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: { dark: "github-dark", light: "github-light" },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}