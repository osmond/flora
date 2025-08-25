/**
 * Placeholder reminder sender.
 * Integrate real email provider here (Resend/Postmark/etc.).
 */
async function main() {
  const now = new Date().toISOString()
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  let dueCount = 0
  try {
    const res = await fetch(`${base}/api/tasks?days=1`)
    if (res.ok) {
      const json = await res.json()
      dueCount = Array.isArray(json.tasks) ? json.tasks.length : 0
    }
  } catch {
    // ignore errors and fall back to zero
  }
  const tasks = [
    {
      to: "test@example.com",
      subject: "Flora — Daily digest",
      body: `You have ${dueCount} task${dueCount === 1 ? "" : "s"} due today.`,
    },
  ]
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
