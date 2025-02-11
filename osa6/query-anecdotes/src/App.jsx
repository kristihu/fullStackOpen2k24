import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import NotificationReducer from "./components/NotificationReducer";
import { useReducer } from "react";
import { getAnecdotes, updateAnecdote } from "./components/requests";
import NotificationContext from "./components/NotificationContext";

const App = () => {
  const [notification, notificationDispatch] = useReducer(NotificationReducer, {
    message: "",
    visible: false,
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    console.log("vote", anecdote);
    notificationDispatch({
      type: "SET_MESSAGE",
      message: `You voted for "${anecdote.content}!"`,
    });

    setTimeout(() => {
      notificationDispatch({ type: "HIDE_MESSAGE" });
    }, 3000);
  };
  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(["anecdotes"]);
    },
  });
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>Loading.....</div>;
  }

  if (result.isError) {
    return <div>Error fetching anecdotes</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>
      <NotificationContext.Provider
        value={[notification, notificationDispatch]}
      >
        <Notification />
        <AnecdoteForm />

        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </NotificationContext.Provider>
    </div>
  );
};

export default App;
