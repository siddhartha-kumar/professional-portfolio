import { profile } from "@/content/profile";

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  company: string | null;
  location: string | null;
  blog: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  updated_at: string;
};

const GITHUB_API = "https://api.github.com";
const REVALIDATE = 60 * 60 * 24; // 24 hours

async function fetchFromGitHub<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    });
    if (!res.ok) {
      console.warn(`GitHub API ${path} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn("GitHub API failed:", err);
    return null;
  }
}

export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  return fetchFromGitHub<GitHubProfile>(
    `/users/${profile.social.githubUsername}`
  );
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const repos = await fetchFromGitHub<GitHubRepo[]>(
    `/users/${profile.social.githubUsername}/repos?per_page=100&sort=pushed`
  );
  if (!repos) return [];
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      // Prioritize stars, then recency
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    });
}

export function computeLanguageStats(repos: GitHubRepo[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  repos.forEach((r) => {
    if (r.language) {
      map.set(r.language, (map.get(r.language) ?? 0) + 1);
    }
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
