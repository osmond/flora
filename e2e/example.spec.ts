import { test, expect } from "@playwright/test"

test("homepage has title and CTA", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Flora/i)
  await expect(page.getByRole("button", { name: /add a plant/i })).toBeVisible()
})

