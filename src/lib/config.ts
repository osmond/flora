const required = (name: string, defaultValue?: string): string => {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const baseUrl = required("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
export const appName = required("NEXT_PUBLIC_APP_NAME", "Flora");
export const isDev = process.env.NODE_ENV !== "production";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = { baseUrl, appName, isDev, OPENAI_API_KEY };
export default config;
