const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const SUPABASE_URL = required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");

export const CLOUDINARY_CLOUD_NAME = required("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = required("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = required("CLOUDINARY_API_SECRET");

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
export const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export const SINGLE_USER_ID =
  process.env.NEXT_PUBLIC_SINGLE_USER_ID ??
  "00000000-0000-0000-0000-000000000000";
