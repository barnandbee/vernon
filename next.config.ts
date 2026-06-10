import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://barnandbee.github.io/vernon/,
// so static exports need the basePath/assetPrefix below. Local dev,
// `next start`, and other hosts (e.g. Vercel) are unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      basePath: "/vernon",
      assetPrefix: "/vernon/",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
