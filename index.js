const { json } = require('express');
const	express = require('express');
const	morgan = require('morgan');
const	app = express();
const	PORT = 3002;
const	personsUrl = '/api/persons';
const	infoUrl = '/info';
const	url = `http://localhost:${PORT}${personsUrl}`;
let		persons;

app.use(express.json());

app.use(morgan('tiny'));

persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const formatTime = () =>
{
	const now = new Date();
	const formattedTimestamp = `${now.toDateString()} ${now.toTimeString()}`;

	return (formattedTimestamp);
}

const generateId = () =>
{
	const personsMaxId = Math.max(...persons.map(person => person.id));
	const id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - personsMaxId + 1)) + personsMaxId;

	return (id);
};

const parseRequest = (body) =>
{
	let error;

	if (!body.name && !body.number)
	{
		error = 'name AND/OR number must not be empty';
	}
	else if (!body.name)
	{
		error ='name must not be empty';
	}
	else if (!body.number)
	{
		error ='number must not be empty';
	}
	else if (persons.find(person => person.name === body.name))
	{
		error = 'name must be unique';
	}
	else
	{
		error = null;
	}
	return (error);

};

app.get(personsUrl, (request, response) =>
{
	response.json(persons);
})

app.get(`${personsUrl}/:id`, (request, response) =>
{
	const	id = Number(request.params.id);
	const	person = persons.find(person => person.id === id);

	if (person)
	{
		response.json(person);
	}
	else
	{
		response.status(404);
		response.send(`person with id ${id} not found`);
	}
})

app.delete(`${personsUrl}/:id`, (request, response) =>
{
	const	id = Number(request.params.id);
	
	persons = persons.filter(person => person.id !== id);
	response.status(204).end();
})

app.post(personsUrl, (request, response) =>
{
	const	person = request.body;
	const	error = parseRequest(person);	
	
	if (error)
	{
		return (response.status(400).json({error: error}));
	}
	person.id = generateId();
	persons = persons.concat(person);
	response.json(person);
})


app.get(infoUrl, (request, response) =>
{
	const	message = `Phonebook has info for ${persons.length} people`
	const	date = formatTime();

	response.send(`<p>${message}</p><p>${date}</p>`);
})

app.listen(PORT, () =>
{
	console.log(`Server Successfully Started on port ${PORT}`);
	console.log(`Go to: %c ${url}`, "color: blue;");
});