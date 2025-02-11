import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import SearchFilter from "./components/SearchFilter";
import Notification from "./components/Notification";
import { useEffect } from "react";

import { initialAnecdotes } from "./reducers/anecdoteReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialAnecdotes());
  }, [dispatch]);
  return (
    <div>
      <h2>Anecdotes</h2>
      <SearchFilter />
      <AnecdoteList />
      <AnecdoteForm />
      <Notification />
    </div>
  );
};

export default App;
