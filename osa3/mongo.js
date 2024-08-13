const mongoose = require('mongoose');
require('dotenv').config();
if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.env.API_PASSWORD;

const url = `mongodb+srv://fullstack:${password}@cluster0.asmpxry.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}