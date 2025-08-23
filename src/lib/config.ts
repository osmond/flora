// src/lib/config.ts

export const isDev = process.env.NODE_ENV === 'development';

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const appName = 'Flora';
