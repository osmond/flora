function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (name.includes("SUPABASE_URL")) {
      return "https://example.supabase.co";
    }
    return "placeholder";
  }
  return value;
}

const config = {
  get NEXT_PUBLIC_SUPABASE_URL() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
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
