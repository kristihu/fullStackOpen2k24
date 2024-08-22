const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  } else {
    const winner = blogs.reduce((prev, current) => {
      return prev.likes > current.likes ? prev : current;
    });
    return {
      title: winner.title,
      author: winner.author,
      likes: winner.likes,
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCount = _.countBy(blogs, "author");
  console.log("Author count:", authorCount);

  const mostFrequentAuthor = _.maxBy(
    Object.keys(authorCount),
    (author) => authorCount[author]
  );
  console.log("Most frequent author:", mostFrequentAuthor);

  const numberOfBlogs = authorCount[mostFrequentAuthor];
  console.log("Number of blogs for the most frequent author:", numberOfBlogs);

  return {
    author: mostFrequentAuthor,
    blogs: numberOfBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = _.mapValues(
    _.groupBy(blogs, "author"),
    (blogsByAuthor) => _.sumBy(blogsByAuthor, "likes")
  );
  console.log("Likes by author:", likesByAuthor);

  const authorWithMostLikes = _.maxBy(
    Object.keys(likesByAuthor),
    (author) => likesByAuthor[author]
  );

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
