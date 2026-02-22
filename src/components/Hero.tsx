"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { getStrapiMedia } from "@/lib/strapi";
import type { Post } from "@/lib/types";

const SLIDE_INTERVAL = 6000;

interface HeroProps {
  featuredPosts?: Post[];
}

function getImageUrl(post: Post): string | null {
  const url = post.images?.[0]?.url;
  return url ? getStrapiMedia(url) : null;
}

export default function Hero({ featuredPosts = [] }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const posts = featuredPosts.length > 0 ? featuredPosts : [];
  const count = posts.length;

  const advance = useCallback(() => {
    if (count > 1) setCurrent((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [advance, count]);

  const activePost = posts[current] ?? null;
  const backgroundUrl = activePost ? getImageUrl(activePost) : null;

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
      {/* Slideshow backgrounds */}
      <AnimatePresence mode="popLayout">
        {backgroundUrl ? (
          <motion.div
            key={activePost!.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={backgroundUrl}
              alt={activePost!.title || "Featured"}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-[#0b0b0b]" />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end px-6 pb-12 sm:px-10 sm:pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Left: slide number + title */}
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePost?.id ?? "empty"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-2"
              >
                <p className="text-[11px] font-semibold tracking-[0.25em] text-white uppercase">
                  {String(current + 1).padStart(2, "0")} - FEATURED
                </p>
                <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl md:text-6xl">
                  {activePost?.title ?? "Featured Work"}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: location + year */}
          <div className="flex flex-col items-start sm:items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePost?.id ?? "empty-meta"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-start text-right sm:items-end"
              >
                {activePost?.location && (
                  <p className="text-sm text-white">{activePost.location}</p>
                )}
                <p className="text-sm text-white">
                  {activePost?.year ??
                    (activePost?.createdAt
                      ? new Date(activePost.createdAt).getFullYear().toString()
                      : "")}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
        {count > 1 && (
          <div className="mt-6 flex items-center gap-2">
            {posts.map((post, i) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-[3px] cursor-pointer overflow-hidden rounded-full transition-all duration-300"
                style={{ width: i === current ? 48 : 24 }}
              >
                <span className="absolute inset-0 rounded-full bg-white/30" />
                {i === current && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_INTERVAL / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
