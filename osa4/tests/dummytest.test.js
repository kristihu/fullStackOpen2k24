const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const supertest = require("supertest");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("Total likes testing", () => {
  test("total likes when given list of blogs", () => {
    const blogs = [
      { _id: "1", title: "Blog 1", author: "Author 1", url: "url1", likes: 10 },
      { _id: "2", title: "Blog 2", author: "Author 2", url: "url2", likes: 5 },
      { _id: "3", title: "Blog 3", author: "Author 3", url: "url3", likes: 20 },
    ];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 35);
  });

  test("total likes when given empty array is zero?", () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test("one blog given", () => {
    const blogs = [
      { _id: "1", title: "Blog 1", author: "Author 1", url: "url1", likes: 10 },
    ];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 10);
  });
});

describe("Most liked blog testing", () => {
  test("most liked blog many blogs", () => {
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, expected);
  });

  test("most liked blog when no blogs", () => {
    const blogs = [];
    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result, null);
  });
});

describe("Most blogs by an author", () => {
  test("when list has multiple authors, the author with the most blogs is returned", () => {
    const result = listHelper.mostBlogs(blogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };

    assert.deepStrictEqual(result, expected);
  });

  test("when list has only one blog, the single author is returned", () => {
    const oneBlog = [
      {
        _id: "1",
        title: "Single Blog",
        author: "Single Author",
        url: "url1",
        likes: 7,
        __v: 0,
      },
    ];

    const result = listHelper.mostBlogs(oneBlog);
    const expected = {
      author: "Single Author",
      blogs: 1,
    };

    assert.deepStrictEqual(result, expected);
  });

  test("when list is empty, null is returned", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

describe("Most likes by an author", () => {
  test("when list has multiple blogs, the author with the most total likes is returned", () => {
    const result = listHelper.mostLikes(blogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };

    assert.deepStrictEqual(result, expected);
  });

  test("when list has only one blog, the single author and their likes are returned", () => {
    const oneBlog = [
      {
        _id: "1",
        title: "Single Blog",
        author: "Single Author",
        url: "url1",
        likes: 7,
        __v: 0,
      },
    ];

    const result = listHelper.mostLikes(oneBlog);
    const expected = {
      author: "Single Author",
      likes: 7,
    };

    assert.deepStrictEqual(result, expected);
  });

  test("when list is empty, null is returned", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
