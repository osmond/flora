/**
 * Placeholder reminder sender.
 * Integrate real email provider here (Resend/Postmark/etc.).
 */
async function main() {
  const now = new Date().toISOString()
  // TODO: fetch due/overdue tasks by querying your /api/tasks once implemented
  const tasks = [{ to: "test@example.com", subject: "Flora — Daily digest", body: "You have 2 tasks due today." }]
  for (const t of tasks) {
    // eslint-disable-next-line no-console
    console.log(`[${now}] Would send email to ${t.to}: ${t.subject} -> ${t.body}`)
  }
}
main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
