const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");

// Helper function to create a valid token
const createToken = async (username) => {
  const user = await User.findOne({ username });
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

describe("when there is initially one user in the db", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();

    token = await createToken("root");
  });

  test("creation of a blog succeeds with a valid token", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes(newBlog.title));
  });

  test("creation fails without a token", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Token missing or invalid");
  });

  test("creation fails with invalid token", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer invalidtoken`)
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("creation fails with missing title or URL", async () => {
    const newBlog = {
      author: "Test Author",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      response.body.error,
      "Blog validation failed: title: Path `title` is required., url: Path `url` is required."
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
