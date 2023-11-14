const { json, request } = require('express');
const	express = require('express');
const	morgan = require('morgan');
const	cors = require('cors');
const	app = express();
const	PORT = process.env.PORT || 3002;
const	personsUrl = '/api/persons';
const	infoUrl = '/info';
const	url = `http://localhost:${PORT}${personsUrl}`;
const	db = require('./db');
const	personsService = require('./services/PersonsService');

db.connectDB();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('data', (request) =>
{
	return (JSON.stringify(request.body));
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

const formatTime = () =>
{
	const now = new Date();
	const formattedTimestamp = `${now.toDateString()} ${now.toTimeString()}`;

	return (formattedTimestamp);
}

app.get(personsUrl, async (request, response) => 
{
	await personsService.getAllPersons(request, response);
})

app.get(`${personsUrl}/:id`, async (request, response) => 
{
	await personsService.getPersonById(request, response);
})

app.delete(`${personsUrl}/:id`, (request, response) =>
{
	const	id = Number(request.params.id);
	
	persons = persons.filter(person => person.id !== id);
	response.status(204).end();
})

app.post(personsUrl, async (request, response) => 
{
	await personsService.savePerson(request, response);
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