const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: isProd ? "https://dimapio.github.io/map-gl/" : undefined,
  basePath: isProd ? "/map-gl/" : undefined,
};

export default nextConfig;
