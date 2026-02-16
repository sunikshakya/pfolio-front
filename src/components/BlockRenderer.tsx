import React from "react";
import type { BlockNode, InlineNode } from "@/lib/types";

function renderInlineNode(node: InlineNode, index: number): React.ReactNode {
  if (node.type === "link") {
    return (
      <a
        key={index}
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition-colors hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-100"
      >
        {node.children?.map((child, i) => renderInlineNode(child, i))}
      </a>
    );
  }

  let content: React.ReactNode = node.text || "";

  if (node.bold) content = <strong key={`b-${index}`}>{content}</strong>;
  if (node.italic) content = <em key={`i-${index}`}>{content}</em>;
  if (node.underline) content = <u key={`u-${index}`}>{content}</u>;
  if (node.strikethrough) content = <s key={`s-${index}`}>{content}</s>;
  if (node.code) {
    content = (
      <code
        key={`c-${index}`}
        className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800"
      >
        {content}
      </code>
    );
  }

  return <span key={index}>{content}</span>;
}

function renderBlock(block: BlockNode, index: number): React.ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={index}
          className="text-base leading-7 text-zinc-600 dark:text-zinc-400"
        >
          {block.children.map((child, i) => renderInlineNode(child, i))}
        </p>
      );

    case "heading": {
      const Tag = `h${block.level}` as keyof Pick<
        React.JSX.IntrinsicElements,
        "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      >;
      return (
        <Tag
          key={index}
          className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {block.children.map((child, i) => renderInlineNode(child, i))}
        </Tag>
      );
    }

    case "list": {
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      return (
        <ListTag
          key={index}
          className={`space-y-1 text-zinc-600 dark:text-zinc-400 ${
            block.format === "ordered" ? "list-decimal" : "list-disc"
          } pl-5`}
        >
          {block.children.map((item, i) => (
            <li key={i}>
              {item.children.map((child, j) => renderInlineNode(child, j))}
            </li>
          ))}
        </ListTag>
      );
    }

    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-2 border-zinc-200 pl-4 italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          {block.children.map((child, i) => renderInlineNode(child, i))}
        </blockquote>
      );

    case "code":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm dark:bg-zinc-800"
        >
          <code>
            {block.children.map((child, i) => renderInlineNode(child, i))}
          </code>
        </pre>
      );

    default:
      return null;
  }
}

export default function BlockRenderer({
  blocks,
}: { blocks: BlockNode[] | null }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-3">{blocks.map((block, i) => renderBlock(block, i))}</div>
  );
}
