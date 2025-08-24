export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Flora';
export const isDev = process.env.NODE_ENV !== 'production';

const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export default config;
