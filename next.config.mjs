/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eoimages.gsfc.nasa.gov",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
