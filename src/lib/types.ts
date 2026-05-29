export interface NoteMeta {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  tags: string[];
  date: string;
  type: "note";
  abstract: string;
  slug: string;
  readingTime?: string;
}

export interface EssayMeta {
  title: string;
  date: string;
  tags: string[];
  type: "essay";
  excerpt: string;
  slug: string;
  readingTime?: string;
}

export type ContentMeta = NoteMeta | EssayMeta;

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

export interface TagCount {
  tag: string;
  count: number;
}
