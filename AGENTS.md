# AGENTS Instructions (root scope)

## Overview
These instructions apply to the entire repository unless overridden by more specific AGENTS files in subdirectories.

## Development workflow
1. **Branching & commits**
   - Work directly on `main`; do not create extra branches.
   - Write clear, conventional commit messages.
2. **Dependencies**
   - Use `pnpm` for installing and running scripts.
3. **Testing & linting**
   - Run `pnpm lint` and `pnpm test` before committing.
   - Fix lint/test failures rather than skipping or ignoring them.
4. **Pull requests**
   - Every commit in `main` must be accompanied by a PR.
   - PR descriptions must summarize the change and include test evidence.

## Code conventions
1. **Language & tooling**
   - Use TypeScript for all new code.
   - Prefer modern ECMAScript syntax; avoid `any`.
2. **API routes**
   - Return responses with `NextResponse.json(...)` to ensure proper JSON headers.
   - Handle errors gracefully and surface user-friendly messages.
3. **Styling**
   - Follow Tailwind conventions from `docs/style-guide.md`.
   - Use design tokens (`rounded-xl`, `p-4`, `text-sm`, etc.) and avoid inline styles.
4. **File organization**
   - Place new pages under `src/app/...`.
   - Keep components in `src/components`.
   - Add tests beside implementation files (`*.test.tsx` or `*.test.ts`).

## Review checklist
- [ ] Lint passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] UI matches style guide
- [ ] API endpoints respond with proper JSON headers
- [ ] Error handling covers both network and validation failures

---

Include additional AGENTS files in subdirectories when more specialized conventions are needed.
