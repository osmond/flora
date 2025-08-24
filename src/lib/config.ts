const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const baseUrl = required("NEXT_PUBLIC_BASE_URL");
export const appName = required("NEXT_PUBLIC_APP_NAME");
export const isDev = process.env.NODE_ENV !== "production";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = { baseUrl, appName, isDev, OPENAI_API_KEY };
export default config;
