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
const	middleware = require('./middleware/middleware');

db.connectDB();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('data', (request) =>
{
	return (JSON.stringify(request.body));
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get(personsUrl, async (request, response) => 
{
	await personsService.getAllPersons(request, response);
})

app.get(`${personsUrl}/:id`, async (request, response, next) => 
{
	await personsService.getPersonById(request, response, next);
})

app.delete(`${personsUrl}/:id`, async (request, response, next) =>
{
	await personsService.deletePerson(request, response, next);
})

app.post(personsUrl, async (request, response, next) => 
{
	await personsService.savePerson(request, response, next);
})

app.put(`${personsUrl}/:id`, async (request, response) => 
{
	await personsService.updatePerson(request, response);
})

app.get(infoUrl, async (request, response) =>
{
	await personsService.getInfo(request, response);
})

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(PORT, () =>
{
	console.log(`Server Successfully Started on port ${PORT}`);
	console.log(`Go to: %c ${url}`, "color: blue;");
});