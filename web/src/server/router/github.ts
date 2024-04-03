import { createRouter } from "./context";
import { z } from "zod";

const commitsRegExp = /&page=(\d+)>; rel="last"/;

const checkHeaders = (headers: Headers, default_value = 0): number => {
  const link = headers.get("Link") as string;
  if (link) {
    const matches = link.match(commitsRegExp);
    if (matches) {
      return parseInt(matches?.[1] as string);
    } else {
      return default_value;
    }
  } else {
    return default_value;
  }
};

export const githubRouter = createRouter()
  .query("get_github_repo", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_3,
          },
        }
      );

      return response.json();
    },
  })
  .query("get_github_commits", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/commits?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_3,
          },
        }
      );

      const data = await response.json();

      return {
        commits: checkHeaders(response.headers),
        last_commit_at: data[0]?.commit?.author?.date as Date,
      };
    },
  })
  .query("get_github_open_prs", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/pulls?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_6,
          },
        }
      );

      return { open_prs: checkHeaders(response.headers, 1) };
    },
  })
  .query("get_github_branches", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/branches?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_6,
          },
        }
      );

      return { branches: checkHeaders(response.headers, 1) };
    },
  })
  .query("get_github_repo_contributors", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/contributors?per_page=100`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_4,
          },
        }
      );

      return response.json();
    },
  })
  .query("get_contributions_count", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response_all_commits = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/commits?per_page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_5,
          },
        }
      );

      const all_commits = checkHeaders(response_all_commits.headers, 1);

      return {
        total_contributions: all_commits,
        // all_commits,
        // gh_pages_commits,
        // all_pulls,
        // all_issues: all_issues - all_pulls,
      };
    },
  })
  .query("get_community_health", {
    input: z.object({
      owner: z.string(),
      repo: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://api.github.com/repos/${input.owner}/${input.repo}/community/profile`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN_5,
          },
        }
      );

      return response.json();
    },
  });
