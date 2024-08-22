const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

describe("Blog API tests", () => {
  let validTokenUser1;
  let validTokenUser2;
  let user1;
  let user2;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    user1 = new User({ username: "user1", passwordHash: "password1" });
    user2 = new User({ username: "user2", passwordHash: "password2" });
    await user1.save();
    await user2.save();

    const blog = new Blog({
      title: "Blog for user1",
      author: "User1",
      url: "http://user1url.com",
      likes: 5,
      user: user1._id,
    });
    await blog.save();

    validTokenUser1 = helper.getTokenForUser(user1);
    validTokenUser2 = helper.getTokenForUser(user2);
  });

  describe("Fetching blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("there are blogs in the database", async () => {
      const res = await api.get("/api/blogs");
      assert.strictEqual(res.body.length, 1);
    });

    test("blogs have an id field instead of _id", async () => {
      const response = await api.get("/api/blogs");
      const blogs = response.body;
      blogs.forEach((blog) => {
        assert(blog.id);
        assert.strictEqual(blog._id, undefined);
        assert.strictEqual(blog.__v, undefined);
      });
    });
  });

  describe("Adding a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "New Blog",
        author: "New Author",
        url: "newUrl",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.BlogsInDb();
      const titles = blogsAtEnd.map((b) => b.title);
      assert.strictEqual(blogsAtEnd.length, 2);
      assert(titles.includes("New Blog"));
    });

    test("likes default value of 0 works", async () => {
      const newBlog = {
        title: "Test",
        author: "Sad no like",
        url: "wwww",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const savedBlog = response.body;
      assert.strictEqual(savedBlog.likes, 0);

      const blogsAtEnd = await helper.BlogsInDb();
      const blogInDb = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      assert.strictEqual(blogInDb.likes, 0);
    });

    test("fails with status code 400 if title is missing", async () => {
      const newBlog = {
        author: "Author without title",
        url: "asd",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, 1);
    });
    test("fails with status code 401 if no token is provided", async () => {
      const newBlog = {
        title: "asdasdg",
        author: "Nasdr",
        url: "asd",
        likes: 0,
      };

      const blogsAtStart = await helper.BlogsInDb();

      await api.post("/api/blogs").send(newBlog).expect(401);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("fails with status code 400 if url is missing", async () => {
      const newBlog = {
        title: "Blog without URL",
        author: "Author without URL",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, 1);
    });
  });

  describe("Invalid blog requests", () => {
    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/blogs/${invalidId}`).expect(404);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });
  });

  describe("Delete blog", () => {
    test("deletes a blog if the user is the owner", async () => {
      const blogsAtStart = await helper.BlogsInDb();

      const blogToDelete = blogsAtStart[0];
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .expect(200);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, 0);
    });

    test("fails with status code 403 if another user tries to delete the blog", async () => {
      const blogsAtStart = await helper.BlogsInDb();

      const blogToDelete = blogsAtStart[0];
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${validTokenUser2}`)
        .expect(403);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, 1);
    });

    test("fails with status code 401 if token is invalid", async () => {
      const blogsAtStart = await helper.BlogsInDb();

      const blogToDelete = blogsAtStart[0];
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", "Bearer invalidtoken")
        .expect(401);

      const blogsAtEnd = await helper.BlogsInDb();
      assert.strictEqual(blogsAtEnd.length, 1);
    });
  });

  describe("Updating a blog", () => {
    test("ok with a blog that exists", async () => {
      const blogsAtStart = await helper.BlogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlog = {
        title: "Updated Title",
        author: "Updated Author",
        url: "updatedUrl",
        likes: 10,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.title, updatedBlog.title);
      assert.strictEqual(response.body.author, updatedBlog.author);
      assert.strictEqual(response.body.url, updatedBlog.url);
      assert.strictEqual(response.body.likes, updatedBlog.likes);

      const blogsAtEnd = await helper.BlogsInDb();
      const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
      assert.strictEqual(updatedBlogInDb.title, updatedBlog.title);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const nonExistingId = await helper.nonExistingId();

      const updatedBlog = {
        title: "Updated Title",
        author: "Updated Author",
        url: "updatedUrl",
        likes: 10,
      };

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .set("Authorization", `Bearer ${validTokenUser1}`)
        .send(updatedBlog)
        .expect(404);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
