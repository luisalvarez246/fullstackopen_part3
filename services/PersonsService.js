const	Person = require('../models/Person');

const parseRequest = async (body) =>
{
	let		error;
	const	isInDB = await Person.find({name: body.name});

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
	else if (isInDB.length > 0)
	{
		error = 'name must be unique';
	}
	else
	{
		error = null;
	}
	return (error);

};

const getAllPersons = async (request, response) =>
{
	try
	{
		const	result = await Person.find({});

		response.json(result);
	}
	catch(error)
	{
		console.log(`Could not fetch persons: ${error}`);
	}
}

const getPersonById = async (request, response) =>
{
	const	id = request.params.id;
	try
	{
		const	person = await Person.findById(id);
		if (person)
		{
			response.json(person);
		}
		else
		{
			response.status(404);
			response.send(`person with id ${id} not found`);
		}
	}
	catch(error)
	{
		console.log(`Could not fetch person: ${error}`);
	}
}

const savePerson = async (request, response) =>
{
	const	body = request.body;
	const	error = await parseRequest(body);	
	const	person = new Person(
	{
		name: body.name,
		number: body.number
	})

	if (error)
	{
		console.log('enters here');
		return (response.status(400).json({error: error}));
	}
	try
	{
		const savedNote = await person.save();
		response.json(savedNote);
	}
	catch(error)
	{
		console.log(`Error saving note: ${error}`);
	}
}

module.exports = { getAllPersons, getPersonById, savePerson };