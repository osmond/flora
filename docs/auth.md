# Authentication Approach

Flora currently operates as a single-user application without full Supabase Auth.

## Evaluation

- **Supabase Auth**: Provides secure user management and session handling but adds configuration overhead during early development.
- **Hardcoded single-user fallback**: Keeps setup minimal by bypassing sign-in flows, suitable while the app targets a single caretaker.

Given Flora's single-user focus at this stage, we chose the hardcoded fallback. Supabase Auth can be integrated later when multi-user support is needed.

## Current Implementation

The app reads a single user ID from the `NEXT_PUBLIC_SINGLE_USER_ID` environment variable (defaulting to `"flora-single-user"`). This value is exposed via `src/lib/auth.ts`, stored in `user_id` columns on tables like `plants` and `tasks`, and enforced by Supabase row-level security policies.

## Route Protection

For deployments, routes can be gated with simple HTTP Basic Auth. Set the
`BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` environment variables to require a
username and password for all pages. Leaving these unset disables the auth
layer, which is useful for local development.
