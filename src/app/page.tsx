import { getHeroImage, getPosts } from "@/lib/strapi";
import type { Post } from "@/lib/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  let posts: Post[] = [];
  let heroImageUrl: string | null = null;
  let error: string | null = null;

  try {
    [posts, heroImageUrl] = await Promise.all([getPosts(), getHeroImage()]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <>
      <Header />
      <Hero heroImageUrl={heroImageUrl} />

      {/* Error state */}
      {error && (
        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-md rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center">
            <p className="text-sm font-medium text-red-300">
              Could not load posts
            </p>
            <p className="mt-1 text-xs text-red-400/80">{error}</p>
            <p className="mt-3 text-xs text-red-500/60">
              Make sure Strapi is running at{" "}
              <code className="rounded bg-red-900/40 px-1.5 py-0.5">
                http://localhost:1337
              </code>
            </p>
          </div>
        </section>
      )}

      {/* Portfolio grid */}
      {!error && posts.length > 0 && (
        <PortfolioGrid posts={posts} />
      )}

      {/* Empty state */}
      {!error && posts.length === 0 && (
        <section className="px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted">
              No posts yet. Add some in your Strapi CMS.
            </p>
          </div>
        </section>
      )}

      <CTA />
      <Footer />
    </>
  );
}
