# Flora Notifications Scaffold

This is a lightweight scaffold for testing notifications. It does not send real emails by default.
Configure an email provider (Resend/Postmark/etc.) and wire it in `scripts/send-reminders.ts`.

## Env (example)
RESEND_API_KEY=
NOTIFY_FROM_EMAIL="Flora <noreply@yourdomain.com>"

## Test endpoints
- GET /api/notifications/test?to=email@example.com -> simulates a reminder payload.
- CLI: pnpm reminders:send -> runs the script once (logs output).
