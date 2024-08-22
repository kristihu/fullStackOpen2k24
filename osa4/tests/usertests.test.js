const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with username shorter than 3 characters", async () => {
    const newUser = {
      username: "ab",
      name: "test",
      password: "test",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      response.body.error,
      "Username must be at least 3 characters long"
    );
  });

  test("creation fails with missing password", async () => {
    const newUser = {
      username: "asdfg",
      name: "test",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Password is required");
  });

  test("creation fails with a duplicate username", async () => {
    const duplicateUser = {
      username: "root",
      name: "Joku",
      password: "asd",
    };

    const response = await api
      .post("/api/users")
      .send(duplicateUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "expected `username` to be unique");
  });
  test("creation fails with missing username and responds with appropriate status and message", async () => {
    const newUser = {
      name: "No Username",
      password: "password",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "Path `username` is required.");
  });
});

after(async () => {
  await mongoose.connection.close();
});
