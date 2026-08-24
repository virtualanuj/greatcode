/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double mounting in dev that can trigger duplicate Web Worker runs
  webpack: (config, { isServer }) => {
    // Enable WebWorker and WebAssembly support if needed
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
