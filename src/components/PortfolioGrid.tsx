"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { getStrapiMedia } from "@/lib/strapi";
import type { Post, PostCategory, StrapiImage } from "@/lib/types";

const CATEGORIES: PostCategory[] = ["Weddings", "Portraits", "Landscapes", "Events"];

interface PortfolioGridProps {
  posts: Post[];
}

export default function PortfolioGrid({ posts }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | PostCategory>("All");

  // Only show categories that have at least one post
  const availableCategories = useMemo(() => {
    const used = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["All" as const, ...CATEGORIES.filter((c) => used.has(c))];
  }, [posts]);

  // Filter posts by active category
  const filtered = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const cssLoaded = useRef(false);

  const openLightbox = useCallback(async (images: StrapiImage[], title: string, startIndex = 0) => {
    // Dynamically import PhotoSwipe core + CSS (client-side only)
    const { default: PhotoSwipe } = await import("photoswipe");
    if (!cssLoaded.current) {
      // @ts-expect-error -- CSS module import
      await import("photoswipe/style.css");
      cssLoaded.current = true;
    }

    const slides = images
      .map((img) => {
        const src = getStrapiMedia(img.url);
        if (!src) return null;
        return {
          src,
          w: img.width,
          h: img.height,
          width: img.width,
          height: img.height,
          alt: img.alternativeText || title,
          title,
          caption: img.caption || "",
        };
      })
      .filter(<T,>(x: T | null): x is T => x !== null);

    if (slides.length === 0) return;

    const pswp = new PhotoSwipe({
      dataSource: slides as unknown as import("photoswipe").DataSource,
      index: startIndex,
      bgOpacity: 0.95,
      padding: { top: 60, bottom: 80, left: 20, right: 20 },
      showHideAnimationType: "fade",
    });

    // Title at the top
    pswp.ui?.registerElement({
      name: "custom-title",
      order: 5,
      isButton: false,
      appendTo: "wrapper",
      onInit: (el) => {
        el.style.position = "absolute";
        el.style.top = "16px";
        el.style.left = "0";
        el.style.right = "0";
        el.style.textAlign = "center";
        el.style.color = "#fff";
        el.style.fontSize = "16px";
        el.style.fontWeight = "500";
        el.style.zIndex = "10";
        el.style.pointerEvents = "none";
      },
    });

    // Caption at the bottom
    pswp.ui?.registerElement({
      name: "custom-caption",
      order: 6,
      isButton: false,
      appendTo: "wrapper",
      onInit: (el) => {
        el.style.position = "absolute";
        el.style.bottom = "20px";
        el.style.left = "0";
        el.style.right = "0";
        el.style.textAlign = "center";
        el.style.color = "rgba(255,255,255,0.7)";
        el.style.fontSize = "14px";
        el.style.zIndex = "10";
        el.style.pointerEvents = "none";
        el.style.padding = "0 40px";
      },
    });

    // Update title + caption on slide change
    pswp.on("change", () => {
      const data = pswp.currSlide?.data as { title?: string; caption?: string } | undefined;
      const titleEl = pswp.element?.querySelector(".pswp__custom-title");
      const captionEl = pswp.element?.querySelector(".pswp__custom-caption");
      if (titleEl) titleEl.textContent = data?.title || "";
      if (captionEl) captionEl.textContent = data?.caption || "";
    });

    pswp.init();
  }, []);

  return (
    <section id="portfolio" className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[11px] font-semibold tracking-[0.25em] text-muted uppercase">
            Featured Portfolio
          </h2>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-5">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-sm transition-colors ${
                  activeCategory === cat
                    ? "text-white"
                    : "text-muted hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {filtered.map((post, index) => {
            const images = post.images ?? [];
            const firstImg = images[0];
            const thumbUrl = firstImg ? getStrapiMedia(firstImg.url) : null;

            return (
              <motion.div
                key={post.id}
                className="aspect-square"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (images.length > 0) openLightbox(images, post.title);
                  }}
                  className="group relative aspect-square w-full overflow-hidden rounded-xl bg-card text-left"
                >
                  {thumbUrl && firstImg ? (
                    <Image
                    src={thumbUrl}
                    alt={firstImg.alternativeText || post.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-800/50">
                    <span className="text-sm text-muted">{post.title}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {post.title}
                    </p>
                    {post.category && (
                      <p className="mt-0.5 text-xs text-white/60">
                        {post.category}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted">
            No posts found for &ldquo;{activeCategory}&rdquo;.
          </p>
        )}
      </div>
    </section>
  );
}
