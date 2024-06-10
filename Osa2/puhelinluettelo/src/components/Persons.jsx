import React from 'react';

const Persons = ({ persons, searchParam, handleDelete }) => {
  return (
    <div>
      {' '}
      <table>
        <tbody>
          {persons
            .filter(person => {
              return searchParam.toLowerCase() === '' ? person : person.name.toLowerCase().includes(searchParam);
            })
            .map(person => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.number}</td>
                <td>
                  <button onClick={() => handleDelete(person.id)}>delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Persons;
