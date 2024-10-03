const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti",
        username: "mluukkai2",
        password: "salainen2",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const loginForm = await page.getByText("login");
    await expect(loginForm).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "mluukkai");
      await page.fill('input[name="Password"]', "salainen");
      await page.click('button[type="submit"]');

      const userGreeting = await page.getByText("Matti Luukkainen logged in");
      await expect(userGreeting).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "wrongUsername");
      await page.fill('input[name="Password"]', "wrongPassword");

      await page.click('button[type="submit"]');

      const errorMessage = await page.getByText("invalid username or password");
      await expect(errorMessage).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.fill('input[name="Username"]', "mluukkai");
      await page.fill('input[name="Password"]', "salainen");
      await page.click('button[type="submit"]');

      const userGreeting = await page.getByText("Matti Luukkainen logged in");
      await expect(userGreeting).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      const newBlogButton = await page.getByRole("button", {
        name: "New Blog",
      });
      await newBlogButton.click();

      await page.fill('input[name="title"]', "test");
      await page.fill('input[name="author"]', "John Doe");
      await page.fill('input[name="url"]', "https://example.com");

      await page.click('button[type="submit"]');

      const blogTitle = await page
        .locator(".blog", { hasText: "test John Doe" })
        .first();
      await expect(blogTitle).toBeVisible();
    });

    test("a blog can be liked and is at the top after liking and deleted after", async ({
      page,
    }) => {
      const newBlogButton = await page.getByRole("button", {
        name: "New Blog",
      });
      await newBlogButton.click();

      await page.fill('input[name="title"]', "test blog for liking");
      await page.fill('input[name="author"]', "John Doe");
      await page.fill('input[name="url"]', "https://example.com");

      await page.click('button[type="submit"]');

      await page.waitForSelector(".blog", { timeout: 5000 });

      const viewButton = await page
        .locator(".blog", { hasText: "test blog for liking John Doe" })
        .first()
        .getByRole("button", { name: "view all" });
      await viewButton.click();

      const likeButton = await page.getByRole("button", { name: "like" });
      await likeButton.click();

      const likeCount = await page.getByText("1 likes");
      await expect(likeCount).toBeVisible();
      const firstBlogInList = await page.locator(".blog").first();
      await expect(firstBlogInList).toContainText("test blog for liking");
      page.on("dialog", (dialog) => dialog.accept());
      const deleteButton = await page.getByRole("button", { name: "delete" });
      await deleteButton.click();
      const blogLocator = page.locator(".blog", {
        hasText: "test blog for liking John Doe",
      });
      await expect(blogLocator).not.toBeVisible();
    });
  });
  describe("Login with second user", () => {
    test("Cannot see delete button", async ({ page }) => {
      await page.fill('input[name="Username"]', "mluukkai2");
      await page.fill('input[name="Password"]', "salainen2");
      await page.click('button[type="submit"]');

      const userGreeting = await page.getByText("Matti logged in");
      await expect(userGreeting).toBeVisible();

      const deleteButton = await page.getByRole("button", { name: "delete" });
      await expect(deleteButton).not.toBeVisible();
    });
  });
});
