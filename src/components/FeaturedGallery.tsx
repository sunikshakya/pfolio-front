"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { getStrapiMedia } from "@/lib/strapi";
import type { Post, StrapiImage } from "@/lib/types";

interface FeaturedGalleryProps {
  posts: Post[];
}

/** Return the aspect ratio of the first image, defaulting to 1 (square). */
function getAspectRatio(post: Post): number {
  const img = post.images?.[0];
  if (!img || !img.width || !img.height) return 1;
  return img.width / img.height;
}

/**
 * Distribute posts into two columns, balancing total height.
 * Each item's visual height contribution is 1/aspectRatio (taller = bigger value).
 */
function balanceColumns(posts: Post[]): [Post[], Post[]] {
  const left: Post[] = [];
  const right: Post[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const post of posts) {
    const h = 1 / getAspectRatio(post); // relative height
    if (leftHeight <= rightHeight) {
      left.push(post);
      leftHeight += h;
    } else {
      right.push(post);
      rightHeight += h;
    }
  }

  return [left, right];
}

export default function FeaturedGallery({ posts }: FeaturedGalleryProps) {
  // Sort by updatedAt descending (latest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const featuredPost = sortedPosts[0];
  const gridPosts = sortedPosts.slice(1);

  const cssLoaded = useRef(false);

  const openLightbox = useCallback(
    async (images: StrapiImage[], title: string, startIndex = 0) => {
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

      pswp.on("change", () => {
        const data = pswp.currSlide?.data as
          | { title?: string; caption?: string }
          | undefined;
        const titleEl = pswp.element?.querySelector(".pswp__custom-title");
        const captionEl = pswp.element?.querySelector(".pswp__custom-caption");
        if (titleEl) titleEl.textContent = data?.title || "";
        if (captionEl) captionEl.textContent = data?.caption || "";
      });

      pswp.init();
    },
    []
  );

  if (!featuredPost) {
    return null;
  }

  const featuredImg = featuredPost.images?.[0];
  const featuredUrl = featuredImg ? getStrapiMedia(featuredImg.url) : null;

  return (
    <section id="featured-gallery" className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Featured post - full width hero */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <button
            type="button"
            onClick={() => {
              if (featuredPost.images && featuredPost.images.length > 0) {
                openLightbox(featuredPost.images, featuredPost.title);
              }
            }}
            className="group relative aspect-[16/10] w-full overflow-hidden bg-card text-left"
          >
            {featuredUrl && featuredImg ? (
              <Image
                src={featuredUrl}
                alt={featuredImg.alternativeText || featuredPost.title}
                fill
                sizes="100vw"
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-800/50">
                <span className="text-lg text-muted">{featuredPost.title}</span>
              </div>
            )}

          </button>
          <div className="mt-2 flex items-start justify-between gap-2">
            <div>
                <p className="font-serif text-sm font-medium text-foreground">
                {featuredPost.title}
                </p>
                {featuredPost.location && (
                <p className="mt-0.5 text-xs text-muted">
                    {featuredPost.location}
                </p>
                )}
            </div>
            {featuredPost.category && (
                <p className="shrink-0 text-xs text-muted">
                {featuredPost.category}
                </p>
            )}
        </div>
        </motion.div>

        {/* Balanced two-column grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {balanceColumns(gridPosts).map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-4">
                {column.map((post, index) => {
                  const images = post.images ?? [];
                  const firstImg = images[0];
                  const thumbUrl = firstImg ? getStrapiMedia(firstImg.url) : null;
                  const ratio = getAspectRatio(post);
                  const paddingBottom = `${(1 / ratio) * 100}%`;

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (images.length > 0) openLightbox(images, post.title);
                        }}
                        className="group relative w-full overflow-hidden bg-card text-left"
                        style={{ paddingBottom }}
                      >
                        {thumbUrl && firstImg ? (
                          <Image
                            src={thumbUrl}
                            alt={firstImg.alternativeText || post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                            <span className="text-sm text-muted">{post.title}</span>
                          </div>
                        )}
                      </button>

                      {/* Title, location & category below image */}
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif text-sm font-medium text-foreground">
                            {post.title}
                          </p>
                          {post.location && (
                            <p className="mt-0.5 text-xs text-muted">
                              {post.location}
                            </p>
                          )}
                        </div>
                        {post.category && (
                          <p className="shrink-0 text-xs text-muted">
                            {post.category}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
