function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Provide sensible defaults so the app can start even if env vars are missing.
const DEFAULT_SUPABASE_URL = "http://localhost:54321";
const DEFAULT_SUPABASE_ANON_KEY = "anon-key";
const DEFAULT_SUPABASE_SERVICE_KEY = "service-role-key";

// Validate critical variables at module load so the app fails fast.
required("NEXT_PUBLIC_SUPABASE_URL", DEFAULT_SUPABASE_URL);
required("SUPABASE_SERVICE_ROLE_KEY", DEFAULT_SUPABASE_SERVICE_KEY);

const config = {
  get NEXT_PUBLIC_SUPABASE_URL() {
    return required("NEXT_PUBLIC_SUPABASE_URL", DEFAULT_SUPABASE_URL);
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      DEFAULT_SUPABASE_ANON_KEY,
    );
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required(
      "SUPABASE_SERVICE_ROLE_KEY",
      DEFAULT_SUPABASE_SERVICE_KEY,
    );
  },
  get CLOUDINARY_CLOUD_NAME() {
    return required("CLOUDINARY_CLOUD_NAME");
  },
  get CLOUDINARY_API_KEY() {
    return required("CLOUDINARY_API_KEY");
  },
  get CLOUDINARY_API_SECRET() {
    return required("CLOUDINARY_API_SECRET");
  },
  get OPENAI_API_KEY() {
    return process.env.OPENAI_API_KEY;
  },
  get BASIC_AUTH_USER() {
    return process.env.BASIC_AUTH_USER;
  },
  get BASIC_AUTH_PASSWORD() {
    return process.env.BASIC_AUTH_PASSWORD;
  },
  get SINGLE_USER_ID() {
    return (
      process.env.NEXT_PUBLIC_SINGLE_USER_ID ??
      "00000000-0000-0000-0000-000000000000"
    );
  },
};

export default config;
