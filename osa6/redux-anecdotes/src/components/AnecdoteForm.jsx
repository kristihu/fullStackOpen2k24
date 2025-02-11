import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";
//import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    dispatch(createAnecdote(content));

    //const newAnecdote = await anecdoteService.createNew(content);
    //dispatch(createAnecdote(newAnecdote));
    dispatch(
      setNotificationWithTimeout(`Created new anecdote: "${content}"`, 5)
    );
  };

  return (
    <>
      <h4>new anecdote</h4>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
