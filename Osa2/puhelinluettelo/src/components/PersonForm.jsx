import React from 'react';

const PersonForm = ({ addNewName, newName, handleNameChange, handleNumberChange, newNumber }) => {
  return (
    <div>
      <form onSubmit={addNewName}>
        <div>
          <h4>Add a new number</h4>
          name: <input value={newName} onChange={handleNameChange} />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
