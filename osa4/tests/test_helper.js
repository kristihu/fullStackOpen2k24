const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const initialBlogs = [
  {
    title: "test",
    author: "testAuthor",
    url: "testUrl",
    likes: 10,
  },
  {
    title: "test2",
    author: "testAuthor2",
    url: "testUrl2",
    likes: 101,
  },
];

const BlogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "test",
    url: "testUrl",
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const getTokenForUser = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });
};
module.exports = {
  initialBlogs,
  BlogsInDb,
  nonExistingId,
  usersInDb,
  getTokenForUser,
};
