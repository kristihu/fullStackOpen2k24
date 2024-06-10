import React from 'react';

const Filter = ({ searchParam, handleSearchChange }) => {
  return (
    <div>
      <h4>filter shown with</h4>
      <input type="text" value={searchParam} onChange={handleSearchChange} />
    </div>
  );
};

export default Filter;
