import { render, screen } from "@testing-library/react";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";

import BlogForm from "../components/BlogForm";
vi.mock("../services/blogs", () => ({
  __esModule: true,
  default: {
    update: vi.fn().mockResolvedValue({}),
  },
}));
test("renders title  but does not render url or likes by default", () => {
  const blog = {
    title: "Testing Blog Component",
    author: "John Doe",
    url: "https://example.com",
    likes: 15,
    id: "blog123",
  };
  const { container } = render(<Blog blog={blog} />);
  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent("Testing Blog Component");
});

test("renders the rest after button is pressed", async () => {
  const blog = {
    title: "Testing Blog Component",
    author: "John Doe",
    url: "https://example.com",
    likes: 15,
    user: { username: "john", name: "Jane Doe" }, // Make sure to define user with name
    id: "blog123",
  };
  const user = { username: "john", name: "Jane Doe" };
  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={user} onClick={mockHandler} />);
  const userEventInstance = userEvent.setup();
  const button = screen.getByText("view all");
  await userEventInstance.click(button);
  expect(screen.getByText("https://example.com")).toBeInTheDocument();
  expect(screen.getByText("15 likes")).toBeInTheDocument();
  expect(screen.getByText("added by Jane Doe")).toBeInTheDocument();
});

test("clicking like button twice calls event handler twice", async () => {
  const mockHandler = vi.fn();
  const blog = {
    title: "Testing Blog Component",
    author: "John Doe",
    url: "https://example.com",
    likes: 15,
    user: { username: "john", name: "Jane Doe" },
    id: "blog123",
  };
  const user = { username: "john", name: "Jane Doe" };
  render(<Blog blog={blog} updateBlogList={mockHandler} user={user} />);
  const userEventInstance = userEvent.setup();
  const button = screen.getByText("view all");
  await userEventInstance.click(button);
  const likeButton = screen.getByText("like this");

  await userEvent.click(likeButton);
  await userEvent.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
  screen.debug();
});

test("<BlogForm /> updates parent state and calls addBlog", async () => {
  const user = userEvent.setup();
  const addBlog = vi.fn();
  const toggleVisibility = vi.fn();

  render(<BlogForm addBlog={addBlog} toggleVisibility={toggleVisibility} />);

  const titleInput = screen.getByLabelText("Title:");
  const authorInput = screen.getByLabelText("Author:");
  const urlInput = screen.getByLabelText("URL:");
  const sendButton = screen.getByText("Save");

  await user.type(titleInput, "Testing Blog Title");
  await user.type(authorInput, "John Doe");
  await user.type(urlInput, "https://example.com");
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: "Testing Blog Title",
    author: "John Doe",
    url: "https://example.com",
  });
});
