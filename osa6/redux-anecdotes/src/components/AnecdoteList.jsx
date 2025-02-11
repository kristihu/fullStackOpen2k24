import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector((state) => {
    let filteredAnecdotes = state.anecdotes;

    if (state.filter === "ALL") {
      filteredAnecdotes = state.anecdotes;
    } else {
      filteredAnecdotes = state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      );
    }

    return [...filteredAnecdotes].sort((a, b) => b.votes - a.votes);
  });

  const vote = (id) => {
    const anecdote = anecdotes.find((a) => a.id === id);
    // dispatch(voteAnecdote({ id }));
    //
    console.log(id, "ANECDOTE");
    dispatch(voteAnecdote(id));
    dispatch(
      setNotificationWithTimeout(`You voted for: "${anecdote.content}"`, 5)
    );
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
