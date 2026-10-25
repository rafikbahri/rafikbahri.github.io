import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has the site title", async ({ page }) => {
    await expect(page).toHaveTitle(/Rafik Bahri/);
  });

  test("shows the presentation", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Presentation" }),
    ).toBeVisible();
    await expect(page.getByText("I'm a Senior DevOps Engineer")).toBeVisible();
  });

  test("shows the current copyright year", async ({ page }) => {
    const year = new Date().getUTCFullYear();
    await expect(page.locator("footer")).toContainText(
      `© ${year} • Rafik Bahri`,
    );
  });

  test("has header navigation", async ({ page }) => {
    const nav = page.locator("header nav");
    await expect(nav.getByRole("link", { name: "blog" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "projects" })).toBeVisible();
  });

  test("lists the latest posts", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 2, name: "Latest posts" }),
    ).toBeVisible();
  });
});

for (const path of ["/blog/", "/projects/"]) {
  test(`${path} is reachable`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("footer")).toBeVisible();
  });
}
