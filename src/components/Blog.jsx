import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlogList, handleDelete, user }) => {
  const [viewDetails, setViewDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const isOwner = blog.user && blog.user.username === user.username;
  const toggleView = () => {
    setViewDetails(!viewDetails);
  };

  const handleLike = async () => {
    console.log("handleLike called");
    try {
      const updatedBlog = {
        ...blog,
        likes: likes + 1,
      };
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setLikes(returnedBlog.likes);
      updateBlogList(returnedBlog);
    } catch (error) {
      console.error("Failed to update likes:", error.message);
    }
  };

  return (
    <div>
      <div className="blog">
        {blog.title} {blog.author}{" "}
        {isOwner && (
          <button onClick={() => handleDelete(blog.id)}>delete</button>
        )}
        <button className="toggleView" onClick={toggleView}>
          {viewDetails ? "hide" : "view all"}
        </button>
      </div>

      {viewDetails && (
        <div className="blogDetails">
          <p>{blog.url}</p>
          <p>
            {likes} likes <button onClick={handleLike}>like this</button>
          </p>
          <p>added by {blog.user.name}</p>
        </div>
      )}
    </div>
  );
};
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
  singleView: PropTypes.bool,
};

export default Blog;
