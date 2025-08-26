import type { NextConfig } from "next";

// Importing the config ensures critical environment variables are validated
// during application startup. If they're missing, an error will be thrown and
// the process will exit.
import "./src/lib/config";

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  serverExternalPackages: ["@tailwindcss/node"],
};

export default withPWA(nextConfig);
