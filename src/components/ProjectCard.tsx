"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { getStrapiMedia } from "@/lib/strapi";
import type { Project } from "@/lib/types";
import BlockRenderer from "./BlockRenderer";

export default function ProjectCard({ project }: { project: Project }) {
  const firstImage = project.images?.[0];
  const imageUrl = firstImage ? getStrapiMedia(firstImage.url) : null;
  const tags = project.tags
    ? project.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {/* Image */}
      {imageUrl && firstImage && (
        <motion.div
          className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={imageUrl}
            alt={firstImage.alternativeText || project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
            {project.title}
          </h2>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-zinc-200 p-2 text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              aria-label={`Visit ${project.title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>

        {/* Description */}
        <BlockRenderer blocks={project.description} />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Image gallery (if multiple images) */}
        {project.images && project.images.length > 1 && (
          <div className="flex gap-2 pt-2">
            {project.images.slice(1, 4).map((img, i) => {
              const url = getStrapiMedia(img.url);
              if (!url) return null;
              return (
                <motion.div
                  key={img.id}
                  className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Image
                    src={url}
                    alt={img.alternativeText || "Project image"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </motion.div>
              );
            })}
            {project.images.length > 4 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                +{project.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
