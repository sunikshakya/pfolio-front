"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { getStrapiMedia } from "@/lib/strapi";
import type { Tutorial } from "@/lib/types";

export default function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const coverImageUrl = tutorial.CoverImage
    ? getStrapiMedia(tutorial.CoverImage.url)
    : null;

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-500/20 text-emerald-600";
      case "intermediate":
        return "bg-amber-500/20 text-amber-600";
      case "advanced":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-muted/20 text-muted";
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Cover Image */}
      {coverImageUrl && tutorial.CoverImage && (
        <motion.div
          className="relative aspect-[16/9] w-full overflow-hidden bg-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={coverImageUrl}
            alt={tutorial.CoverImage.alternativeText || tutorial.Title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Difficulty Badge */}
          {tutorial.Difficulty && (
            <div className="absolute right-3 top-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getDifficultyColor(tutorial.Difficulty)}`}
              >
                {tutorial.Difficulty}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          {tutorial.Title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted">
          {tutorial.ReadTime && (
            <>
              <span className="rounded-full bg-border px-2.5 py-1">
                {tutorial.ReadTime}
              </span>
              <span>•</span>
            </>
          )}
          <span className="rounded-full bg-border px-2.5 py-1">
            {tutorial.Difficulty || "Intermediate"}
          </span>
        </div>

        {/* Excerpt */}
        {tutorial.Excerpt && (
          <p className="line-clamp-2 text-sm text-muted">
            {tutorial.Excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
