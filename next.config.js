/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Failed to parse source map/,
    ];
    return config;
  },
};

export default nextConfig;
