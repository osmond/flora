import type { NextConfig } from "next";

// Importing the config ensures critical environment variables are validated
// during application startup. If they're missing, an error will be thrown and
// the process will exit.
import "./src/lib/config";

const nextConfig: NextConfig = {
  // Ensure native modules from lightningcss are resolved at runtime
  // by externalizing it and its wrapper package
  serverExternalPackages: ["lightningcss", "@tailwindcss/node"],
  /* config options here */
};

export default nextConfig;
