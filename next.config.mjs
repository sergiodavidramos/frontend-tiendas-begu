/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokiJs", "encoding");
    return config;
  },
};

export default withPWA({});
