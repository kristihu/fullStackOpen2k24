import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import "./app.css";
import personService from "./services/person";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        console.log(response.data, "data?");
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
        setNotification({
          message: "Error fetching persons from server",
          type: "error",
        });
      });
  }, []);

  const addNewName = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, want to update number?`
        )
      ) {
        const personObject = { name: existingPerson.name, number: newNumber };
        personService
          .update(existingPerson.id, personObject)
          .then((response) => {
            setPersons(
              persons.map((p) =>
                p.id === existingPerson.id ? response.data : p
              )
            );
            setNotification({
              message: `Updated number for ${newName}`,
              type: "success",
            });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error updating person:", error);
            const errorMessage =
              error.response?.data?.error || "Unknown error occurred";
            setNotification({
              message: `Error updating ${existingPerson.name}: ${errorMessage}`,
              type: "error",
            });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber };
      personService
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNotification({
            message: `Added a new number for ${newName}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.error("Error adding person:", error);
          const errorMessage =
            error.response?.data?.error || "Unknown error occurred";
          setNotification({
            message: `Error adding person: ${errorMessage}`,
            type: "error",
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchParam(event.target.value);
  };

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService
        .remove(id)
        .then((response) => {
          console.log(response, "response");
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({
            message: `Deleted number for ${person.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          setNotification({
            message: `Error deleting ${person.name}, it might have been already removed from the server`,
            type: "error",
          });
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        notification={notification.message}
        type={notification.type}
      />
      <Filter
        handleSearchChange={handleSearchChange}
        searchParam={searchParam}
      />
      <PersonForm
        addNewName={addNewName}
        newName={newName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchParam={searchParam}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
