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

test.describe("article page", () => {
  // A published article, so these run against the live site and PR builds alike
  const article = "/blog/00-bastion-aws-tf/";

  test.beforeEach(async ({ page }) => {
    const response = await page.goto(article);
    expect(response?.status()).toBe(200);
  });

  test("has a collapsed table of contents", async ({ page }) => {
    const toc = page.locator("details", { hasText: "Table of Contents" });
    await expect(toc).toBeVisible();
    await expect(toc).not.toHaveAttribute("open");
  });

  test("has anchor links on headings, kept out of the table of contents", async ({
    page,
  }) => {
    const anchor = page.locator("article h2 a.heading-anchor").first();
    await expect(anchor).toHaveAttribute("href", /^#.+/);
    await expect(anchor).toHaveAttribute("data-pagefind-ignore");

    const tocLinks = page.locator("details nav a");
    expect(await tocLinks.count()).toBeGreaterThan(0);
    for (const text of await tocLinks.allTextContents()) {
      expect(text).not.toContain("#");
    }
  });
});

test("tags are shown as #tag", async ({ page }) => {
  const response = await page.goto("/tags/");
  expect(response?.status()).toBe(200);
  const tags = page.locator('main a[href^="/tags/"]');
  test.skip((await tags.count()) === 0, "no published article has tags yet");
  for (const text of await tags.allTextContents()) {
    expect(text.trim()).toMatch(/^#\S+/);
  }
});

test("the TalosCon 2026 article is published", async ({ page }) => {
  const response = await page.goto("/blog/01-taloscon-2026/");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "TalosCon 2026" }),
  ).toBeVisible();
});

for (const path of ["/blog/", "/projects/"]) {
  test(`${path} is reachable`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("footer")).toBeVisible();
  });
}
