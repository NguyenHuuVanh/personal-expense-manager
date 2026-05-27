/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.vietqr.io",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
