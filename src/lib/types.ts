// Strapi API response types

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

// Strapi Blocks (rich text) types
export type BlockNode =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock;

export interface ParagraphBlock {
  type: "paragraph";
  children: InlineNode[];
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
}

export interface ListBlock {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemBlock[];
}

export interface ListItemBlock {
  type: "list-item";
  children: InlineNode[];
}

export interface QuoteBlock {
  type: "quote";
  children: InlineNode[];
}

export interface CodeBlock {
  type: "code";
  children: InlineNode[];
}

export interface ImageBlock {
  type: "image";
  image: StrapiImage;
  children: InlineNode[];
}

export interface InlineNode {
  type: "text" | "link";
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  children?: InlineNode[];
}

// Project content type
export interface Project {
  id: number;
  documentId: string;
  title: string;
  description: BlockNode[] | null;
  images: StrapiImage[];
  tags: string | null;
  slug: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

// Post content type
export type PostCategory = "Weddings" | "Portraits" | "Landscapes" | "Events";

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: BlockNode[] | null;
  images: StrapiImage[];
  category: PostCategory | null;
  featured: boolean | null;
  order: number | null;
  location?: string | null;
  year?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Tutorial content type
export interface Tutorial {
  id: number;
  documentId: string;
  Title: string;
  Excerpt: string | null;
  ReadTime: string | null;
  CoverImage: StrapiImage | null;
  Difficulty: string | null;
  Content: BlockNode[] | null;
  createdAt: string;
  updatedAt: string;
}

// Strapi API wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
