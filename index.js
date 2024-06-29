const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('dist'));

app.use(express.json());
morgan.token('type', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));

let persons = [
  {
    name: 'Arto Hellas',
    number: '123566',
    id: '1',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const requestTime = new Date();
  const responseText = `<p>Phonebook has info for ${persons.length} people</p>
                          <p>Request was made at: ${requestTime}</p>`;
  response.send(responseText);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const user = persons.find(person => person.id === id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  persons = persons.filter(person => person.id !== id);

  console.log(`Deleted person with ID ${id}`);

  response.status(204).end();
});
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
  return Math.floor(Math.random() * 1000);
};
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  const existingPerson = persons.find(person => person.name.toLowerCase() === request.body.name.toLowerCase());
  if (existingPerson) {
    return response.status(400).json({ error: 'Name is already in use' });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId().toString(),
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
