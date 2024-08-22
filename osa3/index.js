const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("type", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const requestTime = new Date();

  Person.countDocuments({})
    .then((count) => {
      const responseText = `<p>Phonebook has info for ${count} people</p>
                            <p>Request was made at: ${requestTime}</p>`;
      response.send(responseText);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({ error: "Name is already in use" });
      }

      const newPerson = new Person({
        name: body.name,
        number: body.number,
      });

      return newPerson.save();
    })
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Error handler
const errorHandler = (error, request, response) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Id does not exist" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  if (error.code === 11000) {
    return response.status(400).send({ error: "Duplicate key error" });
  }

  if (error.name === "NotFoundError") {
    return response.status(404).send({ error: "Resource not found" });
  }

  return response.status(500).send({ error: "Internal Server Error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
