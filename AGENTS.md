# Repository Guidelines

## Project Structure & Modules
- App routes: `src/app/**` (Next.js App Router). Public assets in `public/`.
- UI: `src/components/**`; utilities and services in `src/lib/**`; shared types in `src/types` or `src/types.ts`.
- Data layer: Prisma schema in `prisma/schema.prisma` with seed in `prisma/seed.ts`; Supabase config in `supabase/`.
- Tests: `__tests__/` and `tests/` (Vitest). Docs in `docs/`.
- Path alias: import app code via `@/*` (see `tsconfig.json`).

## Build, Test, and Development
- Install: `pnpm install`
- Dev server: `pnpm dev` (Next.js on localhost)
- Build: `pnpm build` • Start: `pnpm start`
- Lint: `pnpm lint`
- Tests (all): `pnpm test` • Watch: `pnpm test:watch` • UI: `pnpm test:ui`
- Coverage: `pnpm test:coverage` (reports in `coverage/`)
- DB: `pnpm prisma migrate dev` (apply migrations) • Seed: `pnpm db:seed`

## Coding Style & Naming
- Language: TypeScript (strict). Indentation: 2 spaces.
- Components: PascalCase files (e.g., `PlantCard.tsx`). Utilities/hooks: camelCase or `use-*.ts` in `src/lib`.
- Routes/segments: kebab-case folders under `src/app`.
- Prefer named exports for libs; use `@/` alias instead of deep relative paths.
- Linting: ESLint with Next.js/TypeScript rules (`eslint.config.mjs`). Fix issues before pushing.

## Testing Guidelines
- Framework: Vitest + Testing Library (jsdom). Setup at `test/setup.ts` (mocks `next/navigation`).
- Location/patterns: Place specs in `__tests__/` or `tests/` as `*.test.ts`/`*.test.tsx`.
- Write component tests with accessible queries; mock external services (Supabase, Cloudinary) in tests.
- Coverage: include meaningful unit tests for new code; HTML/LCOV output in `coverage/`.

## Commit & Pull Requests
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, etc. Keep subjects concise (≤72 chars).
- PRs: include a clear description, linked issues, and screenshots for UI changes.
- CI runs lint, unit, and e2e (`.github/workflows/ci.yml`). Vercel preview deploys on PRs.

## Security & Configuration
- Copy `.env.example` to `.env.local`. Set `DATABASE_URL`, Supabase, and Cloudinary keys. Never commit secrets.
- Use server-only keys (e.g., Supabase service role) on the server side (`src/lib/**`).
