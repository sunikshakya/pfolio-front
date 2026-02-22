import type { Post, Project, StrapiResponse } from "./types";

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

export async function getFeaturedPost(): Promise<Post | null> {
  const featuredResponse = await fetchAPI<StrapiResponse<Post[]>>(
    "/posts?filters[featured][$eq]=true&populate=images&sort=order:asc",
    { next: { revalidate: 60 } },
  );
  if (featuredResponse.data?.length) {
    return featuredResponse.data[0];
  }
  const allResponse = await fetchAPI<StrapiResponse<Post[]>>(
    "/posts?populate=images&sort=order:asc",
    { next: { revalidate: 60 } },
  );
  return allResponse.data?.[0] ?? null;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const response = await fetchAPI<StrapiResponse<Post[]>>(
    "/posts?filters[featured][$eq]=true&populate=images&sort=order:asc",
    { next: { revalidate: 60 } },
  );
  if (response.data?.length) {
    return response.data;
  }
  const allResponse = await fetchAPI<StrapiResponse<Post[]>>(
    "/posts?populate=images&sort=order:asc&pagination[limit]=3",
    { next: { revalidate: 60 } },
  );
  return allResponse.data ?? [];
}
