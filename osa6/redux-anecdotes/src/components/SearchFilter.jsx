import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const SearchFilter = () => {
  const dispatch = useDispatch();

  const handleFilterChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  return (
    <div>
      <input
        name="filter"
        onChange={handleFilterChange}
        placeholder="Search anecdotes"
      />
    </div>
  );
};

export default SearchFilter;
