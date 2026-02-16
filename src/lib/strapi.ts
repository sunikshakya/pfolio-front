import type { HeroImage, Post, Project, StrapiResponse } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiURL(path = ""): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiURL(url);
}

async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const res = await fetch(getStrapiURL(`/api${path}`), mergedOptions);

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetchAPI<StrapiResponse<Project[]>>(
    "/projects?populate=images",
    { next: { revalidate: 60 } },
  );
  return response.data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetchAPI<StrapiResponse<Project[]>>(
    `/projects?filters[slug][$eq]=${slug}&populate=images`,
    { next: { revalidate: 60 } },
  );
  return response.data[0] || null;
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetchAPI<StrapiResponse<Post[]>>(
    "/posts?populate=images&sort=order:asc",
    { next: { revalidate: 60 } },
  );
  return response.data;
}

export async function getHeroImage(): Promise<string | null> {
  const response = await fetchAPI<StrapiResponse<HeroImage>>(
    "/hero-image",
    { next: { revalidate: 60 } },
  );
  return response.data?.url ?? null;
}
