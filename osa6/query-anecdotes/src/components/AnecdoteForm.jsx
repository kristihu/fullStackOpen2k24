import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "./requests";
import NotificationContext from "./NotificationContext";

const AnecdoteForm = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const [notificationState, notificationDispatch] =
    useContext(NotificationContext);

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries(["anecdotes"]);

      notificationDispatch({
        type: "SET_MESSAGE",
        message: `Anecdote "${newAnecdote.content}" created!`,
      });

      setTimeout(() => {
        notificationDispatch({ type: "HIDE_MESSAGE" });
      }, 3000);
    },
    onError: () => {
      notificationDispatch({
        type: "SET_MESSAGE",
        message: "Error: Could not create anecdote!",
      });

      setTimeout(() => {
        notificationDispatch({ type: "HIDE_MESSAGE" });
      }, 3000);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (content.length < 5) {
      notificationDispatch({
        type: "SET_MESSAGE",
        message: "Anecdote must be at least 5 characters long!",
      });
      setTimeout(() => {
        notificationDispatch({ type: "HIDE_MESSAGE" });
      }, 3000);
      return;
    }
    newAnecdoteMutation.mutate({ content, votes: 0 });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter new anecdote"
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default AnecdoteForm;
